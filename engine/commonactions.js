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

function WaitAction(duration) {
	LinearAction.call(this, duration, function() {});
}
WaitAction.extends(LinearAction);

function SequenceAction(action /* any amount of actions can be passed afterwards */) {
	if (!action) { throw new Error('A SequenceAction has to be created with at least one child action'); }
	this.actions = new Array(arguments.length);
	for (var i = 0; i < arguments.length; ++i) {
		this.actions[i] = arguments[i];
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
	}
});