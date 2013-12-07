'use strict';

function ActivitySlot(world, createActivityFunc, onSucceeed, onReject, tempMessageFunc, showInfoFunc) {
	this._world = world;
	this._createActivity = createActivityFunc;
	this._showTempMessages = tempMessageFunc;
	this._showInfo = showInfoFunc;
	this._succeed = onSucceeed;
	this._reject = onReject;
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
					if (self._reject) {
						self._reject([rejectionReason]);
					}
				} else {
					var messages = Activity.perform(activity, world);
					if (self._showTempMessages) {
						self._showTempMessages(messages);
					}
					if (self._succeed) {
						self._succeed(messages);
					}
				}
			}
		};
		
		var showInfo = this._showInfo;
		if (showInfo) {
			var oldOnEnter = button.onEnter;
			var oldOnExit = button.onExit;
			var oldOnMouseMove = button.onMouseMove;
			
			button.onEnter = function(pos) {
				var activity = self._createActivity();
				if (activity) {
					var consequences = Activity.getConsequences(activity, world);
					
					var transform = button.globalTransform;
					pos = Vec.add(transform.apply(pos), offset);
					
					showInfo('show', consequences, pos);
				}
				
				if (oldOnEnter) {
					oldOnEnter(pos);
				}
			};
			button.onExit = function(pos) {
				showInfo('hide');
				
				if (oldOnExit) {
					oldOnExit(pos);
				}
			};
			button.onMouseMove = function(pos) {
				var transform = button.globalTransform;
				pos = Vec.add(transform.apply(pos), offset);
				showInfo('update', null, pos);

				if (oldOnMouseMove) {
					oldOnMouseMove(pos);
				}
			};
		}
	}
});