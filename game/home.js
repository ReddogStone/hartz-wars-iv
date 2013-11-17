'use strict';

function Home() {
	this.products = [];
	this._alarmTime = 7;
}

Home.extends(Object, {
	storeProduct: function(product) {
		if (product.kind == 'food') {
			for (var i = 0; i < product.meals; ++i) {
				var meal = FoodProduct.clone(product);
				meal.meals = 1;
				this.products.push(meal);
			}
		}
	},
	storeProducts: function(products) {
		products.forEach(function(element, index, array) {
			this.storeProduct(element);
		}, this);
	},
	findProducts: function(type) {
		var res = [];
		this.products.forEach(function(element) {
			if (element.type == type) {
				res.push(element);
			}
		}, this);
		return res;
	},
	consumeProduct: function(type) {
		var products = this.findProducts(type);
		if (products.length > 0) {
			var product = products[0];
			this.products.remove(product);
			return product;
		}
		return null;
	},
	get alarmTime() {
		return this._alarmTime;
	},
	set alarmTime(value) {
		while (value < 0) {
			value += 24;
		}
		while (value > 24) {
			value -= 24;
		}
		this._alarmTime = value;
	}
});