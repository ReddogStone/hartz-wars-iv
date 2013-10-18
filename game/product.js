'use strict';

function Product(price, label) {
	this.price = price;
	this.label = label;
}

Product.extends(Object, {
	
});

Product.clone = function(value) {
	return new Product(value.price, value.label);
}