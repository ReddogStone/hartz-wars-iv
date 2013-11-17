'use strict';

var ControllerUtils = {
	performActivity: function(world, activity, onSuccess, onReject) {
		var rejectionReason = activity.reject(world);
		if (rejectionReason) {
			if (onReject) {
				onReject(rejectionReason);
			}
		} else {
			var messages = world.performActivity(activity);
			if (onSuccess) {
				onSuccess(messages);
			}
		}
	},
};