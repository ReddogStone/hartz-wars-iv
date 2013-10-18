'use strict';

function Supermarket() {
	this.products = {};
}

Supermarket.extends(Object, {
	addProduct: function(product) {
		this.products[product.type] = product;
	}
});