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
    Object.defineProperty(this.prototype, 'parent', {value: parent.prototype});
    Object.defineProperty(this.prototype, 'constructor', {value: this});
	
	var names = Object.keys(methods);
	for (var i = 0; i < names.length; ++i) {
		var method = names[i];
		var descriptor = Object.getOwnPropertyDescriptor(methods, method);
		Object.defineProperty(this.prototype, method, descriptor);
		if (typeof descriptor.value === 'function') {
			this.prototype['_super_' + method] = function() {
				return this.parent[method].apply(this, arguments);
			}
		}
	}
}
