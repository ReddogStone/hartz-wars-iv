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
		
		Event.observe(button.enter, function(pos) {
			var activity = self._createActivity();
			if (activity) {
				var consequences = Activity.getConsequences(activity, world);
				
				var transform = button.globalTransform;
				
				var infoMessageScene = self._infoMessageScene;
				infoMessageScene.setInfo(consequences);
				infoMessageScene.targetPos = Vec.add(transform.apply(pos), offset);
				infoMessageScene.targetAlpha = 1;
				
				if (!infoMessageScene.visible) {
					infoMessageScene.pos = Pos.clone(targetPos);
				}

				infoMessageScene.visible = true;
			}
		});

		Event.observe(button.exit, function(pos) {
			self._infoMessageScene.targetAlpha = 0;
		});
		
		Event.observe(this._parentScene.eventMouseMove, function(event) {
			self._infoMessageScene.targetPos = Vec.add(event, offset);
		});
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