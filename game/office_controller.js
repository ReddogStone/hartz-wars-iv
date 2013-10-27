'use strict';

function OfficeController(world) {
	this._world = world;
	this.scene = new OfficeScene();
}
OfficeController.extends(Object, {
	init: function() {
		var scene = this.scene;
		var world = this._world;
		var player = world.player;
		
		scene.init();
		
		scene.onEnterOffice = function() {
			player.energy -= 60;
			player.saturation -= 60;
			world.clock.advance(60 * 8.5);
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