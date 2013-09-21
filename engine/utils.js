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