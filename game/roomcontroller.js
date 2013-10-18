'use strict';

function RoomController(world) {
	this._world = world;
	this.scene = new RoomScene();
}
RoomController.extends(Object, {
	init: function() {
		var scene = this.scene;
		var player = this._world.player;
		
		scene.init();
		
		scene.onSleep = function() {
			player.saturation -= 5;
			player.energy += 5;
		};
	},
	set onExitToStreet(value) {
		this.scene.onExitToStreet = value;
	},
/*	updatePlayerProductInventory: function() {
		var scene = this.scene;
		scene.clearAllPlayerInventorySlots();
		var productInventory = this._world.player.productInventory;
		productInventory.forEach(function(element, index) {
			var type;
			switch (element.type) {
				case 'cheap_food': type = 'cheap'; break;
				case 'expensive_food': type = 'expensive'; break;
				case 'healthy_food': type = 'healthy'; break;
				default: 'invalid'; break;
			}
			scene.setPlayerInventorySlot(index, type);
		}, this);
		scene.playerInventoryFill.text = productInventory.length + ' / 3';
	} */
});
