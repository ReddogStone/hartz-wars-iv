'use strict';

function FrameAnimation(frameTime, selector) {
	this.frameTime = frameTime || 1;
	this.frames = [];
	this.time = 0;
	this.selector = selector;
}
FrameAnimation.extends(Object, {
	addFrame: function(rect) {
		this.frames.push(rect);
	},
	update: function(deltaTime) {
		var totalTime = this.frames.length * this.frameTime;
		this.time += deltaTime;
		while (this.time > totalTime) {
			this.time -= totalTime;
		}
		
		var rect = this.selector();
		this.apply(rect);
	},
	apply: function(rect) {
		var frameIndex = Math.floor(this.time / this.frameTime);
		var frameRect = this.frames[frameIndex];
		rect.x = frameRect.x;
		rect.y = frameRect.y;
		rect.sx = frameRect.sx;
		rect.sy = frameRect.sy;
	}
});
