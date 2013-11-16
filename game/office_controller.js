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
			player.energy -= 60;
			player.saturation -= 60;
			player.fun -= 25;
			world.jumpGameTime(60 * 8.5);
			
			if (player.fun <= 0) {
				self.showMessage('Du hast verloren!\n\n' +
					'Du bist nur noch ein graues Rädchen in einer grauen Welt\n' +
					'und deine Existenz ist nicht mehr von Belang.', 
				function() {
					self.restartGame();
				});
			}
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
