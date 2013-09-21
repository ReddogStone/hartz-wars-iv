'use strict';

Array.prototype.remove = function(element) {
	var index = this.indexOf(element);
	if (index > -1) {
		this.splice(index, 1);
	}
}
Array.prototype.clear = function() {
	this.splice(0, this.length);
}

Function.prototype.extends = function(parent, methods) {
    this.prototype = Object.create(parent.prototype);
    Object.defineProperty(this.prototype, 'parent', {value: this.prototype.constructor});
    Object.defineProperty(this.prototype, 'constructor', {value: this});
	
	for (let method in methods) {
		this.prototype[method] = methods[method];
	}
}
