'use strict';

function Product(type, price, label) {
	this.type = type;
	this.price = price;
	this.label = label;
}

Product.extends(Object);

Product.clone = function(value) {
	return new Product(value.type, value.price, value.label);
}