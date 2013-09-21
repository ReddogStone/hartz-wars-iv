'use strict';

function FrameAnimation(frameTime) {
	this.frameTime = frameTime || 1;
	this.frames = [];
	this.time = 0;
}
FrameAnimation.prototype = {
	addFrame: function(rect) {
		this.frames.push(rect);
	},
	update: function(deltaTime) {
		var totalTime = this.frames.length * this.frameTime;
		this.time += deltaTime;
		while (this.time > totalTime) {
			this.time -= totalTime;
		}
	},
	apply: function(rect) {
		var frameIndex = Math.floor(this.time / this.frameTime);
		var frameRect = this.frames[frameIndex];
		rect.x = frameRect.x;
		rect.y = frameRect.y;
		rect.sx = frameRect.sx;
		rect.sy = frameRect.sy;
	}
};
