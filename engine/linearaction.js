'use strict';

function LinearAction(duration, applyCallback) {
	this.duration = duration;
	this.callback = applyCallback;
	this.time = 0;
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
			this.time = this.duration;
			this.finished = true;
		}
		
		this.callback(this.time / this.duration);
	}
});
