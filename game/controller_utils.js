'use strict';

var ControllerUtils = {
	performActivity: function(world, activity, onSuccess, onReject) {
		var rejectionReason = activity.reject(world);
		if (rejectionReason) {
			if (onReject) {
				onReject(rejectionReason);
			}
		} else {
			var messages = Activity.perform(activity, world);
			if (onSuccess) {
				onSuccess(messages);
			}
		}
	},
	createActivitySlot: function(world, scene, messenger, createActivity, onSucceed, onReject) {
		var infoMessageScene = null;
		return new ActivitySlot(world, createActivity, onSucceed, onReject,	messenger ? messenger.showPlayerTempMessages : null,
			function(type, consequences, where) {
				switch (type) {
					case 'show':
						infoMessageScene = new InfoMessageScene(consequences);
						infoMessageScene.pos = Pos.clone(where);
						scene.addChild(infoMessageScene);
						break;
					case 'update':
						if (infoMessageScene) {
							infoMessageScene.pos = Pos.clone(where);
						}
						break;
					case 'hide':
						if (infoMessageScene) {
							scene.removeChild(infoMessageScene);
						}
						break;
				}
			});
	}
};