'use strict';

var transitionTemplate = ( function() {
	return {
		type: 'Scene',
		children: {
			overlay: {
				type: 'Sprite',
				color: 'black',
				size: {x: 1024, y: 640},
				z: 1000,
				visible: false
			}
		}
	};
})();

function TransitionScene(duration, from, to, onNewScene, onFinished) {
	Scene.apply(this);
	
	this.deserialize(transitionTemplate);
	
	this.fromScene = from;
	this.toScene = to;
	this.duration = duration;
	this.onNewScene = onNewScene;
	this.onFinished = onFinished;
	
	var overlay = this.overlay;
	overlay.handleMouseDown = overlay.handleMouseUp = overlay.handleMouseMove = function() {
		return true;
	}
};
TransitionScene.extends(Scene, {
	init: function() {
		var self = this;
		var overlay = this.overlay;
		var duration = this.duration;
		
		if (this.fromScene) {
			this.addChild(this.fromScene);
		}
		overlay.visible = true;
		overlay.addAction(new SequenceAction(
			new EaseInOutAction(0.5 * duration, function(progress) {
				overlay.alpha = progress;
			}),
			new InstantAction(function() {
				self.removeChild(self.fromScene);
				self.addChild(self.toScene);
				self.onNewScene();
			}),
			new EaseInOutAction(0.5 * duration, function(progress) {
				overlay.alpha = 1.0 - progress;
			}),
			new InstantAction(function() {
				self.removeChild(self.toScene);
				overlay.visible = false;
				self.onFinished();
			})
		));
	}
});
