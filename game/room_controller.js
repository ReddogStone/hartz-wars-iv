'use strict';

function RoomController(world) {
	this._world = world;
	this.scene = new RoomScene();
}
RoomController.extends(Object, {
	_consumeFood: function(type) {
		var world = this._world;
		var player = world.player;
		var home = world.playerHome;
		var product = home.consumeProduct(type);
		if (product) {
			if (product.condition(world, player)) {
				product.consequence(world, player);
			} else {
				home.storeProduct(product);
			}
		}
		this._updateFoodAmount();
	},	
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
			self._consumeFood('cheap_food');
		};
		scene.onCookExpensive = function() {
			self._consumeFood('expensive_food');
		};
		scene.onCookHealthy = function() {
			self._consumeFood('healthy_food');
		};
		scene.onPhoneCall = function() {
			var dialogController = new MotherDialogController(world);
			scene.addChild(dialogController.scene);
			dialogController.onExit = function() {
				scene.removeChild(dialogController.scene);
			}
			dialogController.init();
		};
		scene.onReadBook = function() {
			player.fun += 15;
			world.advanceGameTime(60);
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
