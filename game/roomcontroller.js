'use strict';

function RoomController(world) {
	this._world = world;
	this.scene = new RoomScene();
}
RoomController.extends(Object, {
	init: function() {
		var scene = this.scene;
		var world = this._world;
		var player = world.player;
		
		scene.init();
		
		scene.onSleep = function() {
			player.saturation -= 5;
			player.energy += 5;
		};
		
		var self = this;
		scene.onCookCheap = function() {
			var product = world.playerHome.consumeProduct('cheap_food');
			if (product) {
				player.saturation += 10;
				player.energy -= 5;
				self._updateFoodAmount();
			}
		};
		scene.onCookExpensive = function() {
			var product = world.playerHome.consumeProduct('expensive_food');
			if (product) {
				player.saturation += 5;
				player.energy -= 10;
				self._updateFoodAmount();
			}
		};
		scene.onCookHealthy = function() {
			var product = world.playerHome.consumeProduct('healthy_food');
			if (product) {
				player.saturation += 5;
				player.energy -= 10;
				self._updateFoodAmount();
			}
		};
		this._updateFoodAmount();
	},
	enter: function() {
		var world = this._world;
		var products = world.player.dropAllProducts();
		world.playerHome.storeProducts(products);
		this._updateFoodAmount();
	},
	set onExitToStreet(value) {
		this.scene.onExitToStreet = value;
	},
	_updateFoodAmount: function() {
		var home = this._world.playerHome;
		var cheap = home.findProducts('cheap_food');
		var expensive = home.findProducts('expensive_food');
		var healthy = home.findProducts('healthy_food');
		
		var scene = this.scene;
		scene.cheapAmount.text = cheap.length;
		scene.expensiveAmount.text = expensive.length;
		scene.healthyAmount.text = healthy.length;
	}
});
