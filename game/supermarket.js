'use strict';

function Supermarket() {
	this.products = {};
}

Supermarket.extends(Object, {
	addProduct: function(name, product) {
		this.products[name] = product;
	}
});