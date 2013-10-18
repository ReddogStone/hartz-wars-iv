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
		
		var self = this;
		scene.onBuyCheapFood = function() {
			buyProduct(player, supermarket.products['cheap_food']);
			self.updatePlayerProductInventory();
		};
		scene.onBuyExpensiveFood = function() {
			buyProduct(player, supermarket.products['expensive_food']);
			self.updatePlayerProductInventory();
		};
		scene.onBuyHealthyFood = function() {
			buyProduct(player, supermarket.products['healthy_food']);
			self.updatePlayerProductInventory();
		};
		this.updatePlayerProductInventory();
	},
	set onExit(value) {
		this.scene.onExit = value;
	},
	updatePlayerProductInventory: function() {
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
	}
});
