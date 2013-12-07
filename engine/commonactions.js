'use strict';

function InstantAction(callback) {
	this.callback = callback;
	this._finished = false;
}
InstantAction.extends(Object, {
	get finished() {
		return this._finished;
	},
	start: function() {
		this.callback();
		this._finished = true;
	},
	update: function(deltaTime) {
		return deltaTime;
	}
});

function LinearAction(duration, callback) {
	this._duration = duration;
	this._callback = callback;
	this._init();
}
LinearAction.extends(Object, {
	_init: function() {
		this._time = 0;
		this._finished = false;		
	},
	get finished() {
		return this._finished;
	},
	start: function() {
		this._init();
		this._callback(0.0);
	},
	update: function(deltaTime) {
		this._time += deltaTime;
		
		if (this._time > this._duration) {
			this._finished = true;
			this._callback(1.0);
			return (this._time - this._duration);
		}
		
		this._callback(this._time / this._duration);
		return 0;
	}
});

function EaseInAction(duration, callback) {
	LinearAction.call(this, duration, function(progress) {
		callback(Math.sin(progress * Math.PI * 0.5));
	});
}
EaseInAction.extends(LinearAction);

function EaseOutAction(duration, callback) {
	LinearAction.call(this, duration, function(progress) {
		callback(1.0 - Math.cos(progress * Math.PI * 0.5));
	});
}
EaseOutAction.extends(LinearAction);

function EaseInOutAction(duration, callback) {
	LinearAction.call(this, duration, function(progress) {
		callback(1.0 - 0.5 * (Math.cos(progress * Math.PI) + 1));
	});
}
EaseInOutAction.extends(LinearAction);

function WaitAction(duration) {
	LinearAction.call(this, duration, function() {});
}
WaitAction.extends(LinearAction);

function SequenceAction(action /* any amount of actions can be passed afterwards */) {
	if (!action) { throw new Error('A SequenceAction has to be created with at least one child action'); }
	
	if (Array.isArray(action)) {
		this._actions = new Array(action.length);
		action.forEach(function(element, index) {
			this._actions[index] = element;
		}, this);
	} else {
		this._actions = new Array(arguments.length);
		for (var i = 0; i < arguments.length; ++i) {
			this._actions[i] = arguments[i];
		}
	}

	this._init();
}
SequenceAction.extends(Object, {
	_init: function() {
		this._currentIndex = 0;
		this._finished = false;
	},
	_startChildAction: function() {
		var actions = this._actions,
			currentIndex = this._currentIndex;
		while (true) {
			var action = actions[currentIndex];
			action.start();
			if (!action.finished) { 
				break;
			}
			
			++currentIndex;
			if (currentIndex >= actions.length) {
				this._finished = true;
				break;
			}
		}
		this._currentIndex = currentIndex;
	},
	get finished() {
		return this._finished;
	},
	start: function() {
		this._init();
		this._startChildAction();
	},
	update: function(deltaTime) {
		var current;
		var timeLeft = deltaTime;
		var actions = this._actions;
		
		do {
			current = this._actions[this._currentIndex];
			timeLeft = current.update(timeLeft);
			if (!current.finished) {
				break;
			}
			
			++this._currentIndex;
			this._startChildAction();
			
			// the sequence could be finished during _startChildAction
			if (this._finished) {
				break;
			}
		} while (current.finished);
		
		return timeLeft;
	}
});

function ParallelAction(action /* any amount of actions can be passed afterwards */) {
	if (!action) { throw new Error('A ParallelAction has to be created with at least one child action'); }
	
	if (Array.isArray(action)) {
		this.actions = new Array(action.length);
		action.forEach(function(element, index) {
			this.actions[index] = element;
		}, this);
	} else {
		this.actions = new Array(arguments.length);
		for (var i = 0; i < arguments.length; ++i) {
			this.actions[i] = arguments[i];
		}
	}
	
	this._finished = false;
}
ParallelAction.extends(Object, {
	get finished() {
		return this._finished;
	},
	start: function() {
		var finished = true;
		this.actions.forEach(function(action) {
			action.start();
			finished = finished && action.finished;
		}, this);
		this._finished = finished;
	},
	update: function(deltaTime) {
		var finished = true,
			minRest = Infinity;
		this.actions.forEach(function(action) {
			var rest = action.update(deltaTime);
			if (rest < minRest) {
				minRest = rest;
			}
			finished = finished && action.finished;
		});
		this._finished = finished;
		return minRest;
	}
});

function RepeatAction(action) {
	this._action = action;
}
RepeatAction.extends(Object, {
	get finished() {
		return false;
	},
	start: function() {
		var action = this._action;
		action.start();
		if (action.finished) {
			throw new Error('Don\'t repeat an instant message, lest doom rises!');
		}
	},
	update: function(deltaTime) {
		var rest = deltaTime,
			action = this._action;

		do {
			rest = action.update(rest);
			if (action.finished) {
				action.start();
			}
		} while (rest > 0);
	}
});
