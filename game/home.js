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
	}
});