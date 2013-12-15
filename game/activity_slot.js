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
		
		var targetPos = new Pos();
		var targetAlpha = 0;
		
		var oldOnEnter = button.onEnter;
		button.onEnter = function(pos) {
			var activity = self._createActivity();
			if (activity) {
				var consequences = Activity.getConsequences(activity, world);
				
				var transform = button.globalTransform;
				targetPos = Vec.add(transform.apply(pos), offset);
				targetAlpha = 1;
				
				var infoMessageScene = self._infoMessageScene;
				infoMessageScene.setInfo(consequences);
				
				infoMessageScene.cancelAllActions();
				
				if (!infoMessageScene.visible) {
					infoMessageScene.pos = Pos.clone(targetPos);
				}
								
				infoMessageScene.visible = true;
				var currentAlpha = infoMessageScene.background.alpha;
				var currentPos = infoMessageScene.pos;
				infoMessageScene.addAction(new TargetFollowingAction(0.1, function() {
					return [
						{value: infoMessageScene.alpha, target: targetAlpha},
						{value: infoMessageScene.pos.x, target: targetPos.x},
						{value: infoMessageScene.pos.y, target: targetPos.y}
					];
				}, function(values) {
					var alpha = values[0];
					infoMessageScene.visible = (alpha > 0.001);
					infoMessageScene.alpha = alpha;
					infoMessageScene.pos.x = values[1];
					infoMessageScene.pos.y = values[2];
				}));
			}
			
			if (oldOnEnter) {
				oldOnEnter(pos);
			}
		};

		var oldOnExit = button.onExit;
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