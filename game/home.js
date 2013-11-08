'use strict';

function Home() {
	this.products = [];
}

Home.extends(Object, {
	storeProduct: function(product) {
		if (product.kind == 'food') {
			for (var i = 0; i < product.meals; ++i) {
				var meal = Food.clone(product);
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
	}
});