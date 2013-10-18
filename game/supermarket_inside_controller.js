'use strict';

function buyProduct(buyer, product) {
	var price = product.price;
	if ((buyer.money >= price) && (buyer.canTakeProduct(product))) {
		buyer.money -= price;
		buyer.takeProduct(product);
	}
}

function SupermarketInsideController(world) {
	this._world = world;
	this.scene = new SupermarketInsideScene();
}
SupermarketInsideController.extends(Object, {
	init: function() {
		var scene = this.scene;
		var supermarket = this._world.supermarket;
		var player = this._world.player;

		scene.init();
		
		var buyOverlay = scene.buyOverlay;
		buyOverlay.buyCheapButton.label.text = supermarket.products['cheap_food'].label;
		buyOverlay.buyCheapButton.priceLabel.text = supermarket.products['cheap_food'].price.toFixed(2) + ' €';
		buyOverlay.buyExpensiveButton.label.text = supermarket.products['expensive_food'].label;
		buyOverlay.buyExpensiveButton.priceLabel.text = supermarket.products['expensive_food'].price.toFixed(2) + ' €';
		buyOverlay.buyHealthyButton.label.text = supermarket.products['healthy_food'].label;
		buyOverlay.buyHealthyButton.priceLabel.text = supermarket.products['healthy_food'].price.toFixed(2) + ' €';
		
		scene.onBuyCheapFood = function() {
			buyProduct(player, supermarket.products['cheap_food']);
		}
		scene.onBuyExpensiveFood = function() {
			buyProduct(player, supermarket.products['expensive_food']);
		}
		scene.onBuyHealthyFood = function() {
			buyProduct(player, supermarket.products['healthy_food']);
		}		
	},
	set onExit(value) {
		this.scene.onExit = value;
	}
});
	