'use strict';

function OfficeController(world) {
	this._world = world;
	this.scene = new OfficeScene();
}
OfficeController.extends(Object, {
	init: function() {
		var self = this;
		var scene = this.scene;
		var world = this._world;
		var player = world.player;
		
		scene.init();
		
		scene.onEnterOffice = function() {
			var activity = new WorkActivity(8.5 * 60);
			ControllerUtils.performActivity(world, activity, function(messages) {
					self.showPlayerTempMessages(messages);					
				},
				function(rejectionReason) {
					home.storeProduct(product);
					self.showPlayerTempMessages([rejectionReason]);
				});
		};
	},
	enterFromBus: function() {
		this.scene.enterFromBus();
	},
	set onExitToStreet(value) {
		this.scene.onExitToStreet = value;
	},
	set onShowMap(value) {
		this.scene.onShowMap = value;
	}
});
