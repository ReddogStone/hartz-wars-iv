'use strict';

function Product(price) {
	this.price = price;
}

Product.extends(Object, {
	
});

Product.clone = function(value) {
	return new Product(value.price);
}