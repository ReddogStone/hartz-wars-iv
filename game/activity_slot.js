'use strict';

function ActivitySlot(world, parentScene, scene, tempMessageFunc, createActivity) {
	this._world = world;
	this._parentScene = parentScene;
	this._createActivity = createActivity;
	this._showTempMessages = tempMessageFunc;
	this._infoMessageScene = scene;
	
	if (parentScene.children.indexOf(scene) == -1) {
		parentScene.addChild(scene);
		scene.visible = false;
	}
}
ActivitySlot.extends(Object, {
	connect: function(button, offset) {
		var self = this;
		var world = this._world;
		button.onClicked = function() {
			var activity = self._createActivity();
			if (activity) {
				var rejectionReason = activity.reject(world);
				if (rejectionReason) {
					if (self._showTempMessages) {
						self._showTempMessages([rejectionReason]);
					}
					if (self.onReject) {
						self.onReject([rejectionReason]);
					}
				} else {
					var messages = Activity.perform(activity, world);
					if (self._showTempMessages) {
						self._showTempMessages(messages);
					}
					if (self.onSucceed) {
						self.onSucceed(messages);
					}
				}
			}
		};
		
		var oldOnEnter = button.onEnter;
		var oldOnExit = button.onExit;
		var oldOnMouseMove = button.onMouseMove;
		
		var targetPos = new Pos();
		var targetAlpha = 0;
		
		button.onEnter = function(pos) {
			var activity = self._createActivity();
			if (activity) {
				var consequences = Activity.getConsequences(activity, world);
				
				var transform = button.globalTransform;
				targetPos = Vec.add(transform.apply(pos), offset);
				targetAlpha = 0.8;
				
				var infoMessageScene = self._infoMessageScene;
				infoMessageScene.setInfo(consequences);
				
				infoMessageScene.cancelAllActions();
				infoMessageScene.visible = true;
				var currentAlpha = infoMessageScene.background.alpha;
				var currentPos = infoMessageScene.pos;
				infoMessageScene.addAction(new ContinuousAction(function(delta) {
					if (!infoMessageScene.visible) {
						return;
					}
				
					var amount = 0.2;
					
					var alpha = infoMessageScene.background.alpha;
					if (Math.abs(alpha - targetAlpha) < 0.001) {
						alpha = targetAlpha;
					} else {
						alpha = alpha + amount * (targetAlpha - alpha);
					}
					infoMessageScene.background.alpha = alpha;
					if (alpha == 0) {
						infoMessageScene.visible = false;
					} else {
						infoMessageScene.visible = true;
					}
					
					var pos = infoMessageScene.pos;
					if (Vec.squareDist(targetPos, pos) < 1) {
						infoMessageScene.pos = Pos.clone(targetPos);
					} else {
						infoMessageScene.pos = Pos.clone(Vec.add(pos, Vec.mul(Vec.sub(targetPos, pos), amount)));
					}
				}));
			}
			
			if (oldOnEnter) {
				oldOnEnter(pos);
			}
		};
		button.onExit = function(pos) {
			var infoMessageScene = self._infoMessageScene;
			
			targetAlpha = 0;
			
			if (oldOnExit) {
				oldOnExit(pos);
			}
		};
		
		var oldMouseMove = this._parentScene.onMouseMove;
		this._parentScene.onMouseMove = function(event) {
			targetPos = Vec.add(event, offset);
			if (oldMouseMove) {
				oldMouseMove(event);
			}
		};		
	},
	notifyChanges: function() {
		var activity = this._createActivity();
		if (activity) {
			var consequences = Activity.getConsequences(activity, this._world);
			this._infoMessageScene.setInfo(consequences);
		} else {
			this._infoMessageScene.visible = false;
		}
	}
});