'use strict';

function InstantAction(callback) {
	this.callback = callback;
}
InstantAction.extends(Object, {
	start: function() {
		this.callback();
		this.finished = true;
	},
	stop: function() {
	}
});

function LinearAction(duration, callback) {
	this.duration = duration;
	this.callback = callback;
	this.time = 0;
	this.finished = false;
}
LinearAction.extends(Object, {
	start: function() {
		this.time = 0;
		this.finished = false;
		this.callback(0.0);
	},
	stop: function() {
		this.callback(1.0);
	},
	update: function(deltaTime) {
		this.time += deltaTime;
		
		if (this.time > this.duration) {
			this.finished = true;
			return (this.time - this.duration);
		}
		
		this.callback(this.time / this.duration);
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

	this.currentIndex = 0;
	this.finished = false;
}
SequenceAction.extends(Object, {
	_startAction: function() {
		var actions = this.actions;
		var currentIndex = this.currentIndex;
		while (currentIndex < actions.length) {
			var action = actions[currentIndex];
			action.start();
			if (!action.finished) { break; }
			action.stop();
			++currentIndex;
		}
		if (currentIndex >= actions.length) {
			this.finished = true;
		}
		this.currentIndex = currentIndex;
	},
	start: function() {
		this.currentIndex = 0;
		this.finished = false;
		this._startAction();
	},
	stop: function() {
		var actions = this.actions;
		var currentIndex = this.currentIndex;
		if (currentIndex < actions.length) {
			actions[currentIndex].stop();
		}
	},
	update: function(deltaTime) {
		var actions = this.actions;
		var current = actions[this.currentIndex];
		var timeLeft = current.update(deltaTime);
		while (current.finished) {
			current.stop();
			++this.currentIndex;
			this._startAction();
			if (this.finished) { break; }
			
			current = actions[this.currentIndex];
			timeLeft = current.update(timeLeft);
		}
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
}
ParallelAction.extends(Object, {
	get finished() {
		return this.actions.some(function(action) {return action.finished;});
	},
	start: function() {
		this.actions.forEach(function(action) {action.start()});
	},
	stop: function() {
		this.actions.forEach(function(action) {action.stop()});		
	},
	update: function(deltaTime) {
		var minRest = Infinity;
		this.actions.forEach(function(action) {
			var rest = action.update(deltaTime);
			if (rest < minRest) {
				minRest = rest;
			}
		});
		return minRest;
	}
});

function RepeatAction(action) {
	this.action = action;
}
RepeatAction.extends(Object, {
	get finished() {
		return false;
	},
	start: function() {
		var action = this.action;
		action.start();
		if (action.finished) {
			action.stop();
			action.start();
		}
	},
	stop: function() {
		this.action.stop();
	},
	update: function(deltaTime) {
		var action = this.action;
		var rest = action.update(deltaTime);
		if (action.finished) {
			action.stop();
			action.start();
		}
		while (rest > 0) {
			rest = this.action.update(rest);
			if (action.finished) {
				action.stop();
				action.start();
			}			
		}
	}
});
