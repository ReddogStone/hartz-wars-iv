'use strict';

function ActivitySlot(world, parentScene, tempMessageFunc, createActivity) {
	this._world = world;
	this._parentScene = parentScene;
	this._createActivity = createActivity;
	this._showTempMessages = tempMessageFunc;
	this._infoMessageScene = new InfoMessageScene();
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
		
		button.onEnter = function(pos) {
			var activity = self._createActivity();
			if (activity) {
				var consequences = Activity.getConsequences(activity, world);
				
				var transform = button.globalTransform;
				pos = Vec.add(transform.apply(pos), offset);
				
				self._infoMessageScene.setInfo(consequences);
				self._infoMessageScene.pos = Pos.clone(pos);
				self._parentScene.addChild(self._infoMessageScene);
			}
			
			if (oldOnEnter) {
				oldOnEnter(pos);
			}
		};
		button.onExit = function(pos) {
			self._parentScene.removeChild(self._infoMessageScene);
			
			if (oldOnExit) {
				oldOnExit(pos);
			}
		};
		button.onMouseMove = function(pos) {
			var transform = button.globalTransform;
			pos = Vec.add(transform.apply(pos), offset);
			self._infoMessageScene.pos = Pos.clone(pos);

			if (oldOnMouseMove) {
				oldOnMouseMove(pos);
			}
		};
	},
	notifyChanges: function() {
		var activity = this._createActivity();
		if (activity) {
			var consequences = Activity.getConsequences(activity, this._world);
			this._infoMessageScene.setInfo(consequences);
		} else {
			this._parentScene.removeChild(this._infoMessageScene);
		}
	}
});