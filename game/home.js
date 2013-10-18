'use strict';

function Home() {
	this.products = [];
}

Home.extends(Object, {
	storeProduct: function(product) {
		this.products.push(product);
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