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
	this._selectedProduct = null;
}
SupermarketInsideController.extends(Object, {
	init: function() {
		var scene = this.scene;
		var supermarket = this._world.supermarket;
		var player = this._world.player;

		scene.init();
		
		var self = this;
		scene.onBuyCheapFood = function() {
			buyProduct(player, supermarket.products['cheap_food']);
			self._updatePlayerProductInventory();
		};
		scene.onBuyExpensiveFood = function() {
			buyProduct(player, supermarket.products['expensive_food']);
			self._updatePlayerProductInventory();
		};
		scene.onBuyHealthyFood = function() {
			buyProduct(player, supermarket.products['healthy_food']);
			self._updatePlayerProductInventory();
		};
		scene.onSelectProduct = function(productType) {
			switch (productType) {
				case 'cheap': self._selectedProduct = supermarket.products['cheap_food']; break;
				case 'expensive': self._selectedProduct = supermarket.products['expensive_food']; break;
				case 'healthy': self._selectedProduct = supermarket.products['healthy_food']; break;
				default: self._selectedProduct = null; break;
			}
			self._updateProductDescription();
		};
		this._updatePlayerProductInventory();
		this._updateProductDescription();
	},
	set onExit(value) {
		this.scene.onExit = value;
	},
	_updatePlayerProductInventory: function() {
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
	},
	_updateProductDescription: function() {
		var scene = this.scene;
		var buyOverlay = scene.buyOverlay;
		if (this._selectedProduct) {
			var product = this._selectedProduct;
			buyOverlay.productKindLabel.visible = true;
			buyOverlay.productTypeLabel.visible = true;
			buyOverlay.productPriceLabel.visible = true;
			buyOverlay.productMealsLabel.visible = true;

			buyOverlay.productKindLabel.text = 'Essen';
			buyOverlay.productTypeLabel.text = product.label;
			buyOverlay.productPriceLabel.text = product.price.toFixed(2) + ' EURO';
			buyOverlay.productMealsLabel.text = product.meals + ' Mahlzeiten';
		} else {
			buyOverlay.productKindLabel.visible = false;
			buyOverlay.productTypeLabel.visible = false;
			buyOverlay.productPriceLabel.visible = false;
			buyOverlay.productMealsLabel.visible = false;
		}
	},
	enter: function() {
		this.scene.enter();
	}
});
