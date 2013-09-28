'use strict';

function SortedList(compare) {
	this._list = [];
	this.compare = compare;
}
SortedList.extends(Object, {
	get length() { return this._list.length; },
	_bound: function(element, compare) {
		var list = this._list;
		var begin = 0;
		var end = list.length;
		while (begin < end) {
			var index = Math.floor((begin + end) / 2);
			if (compare(list[index], element)) {
				begin = index + 1;
			} else {
				end = index;
			}
		}
		return begin;
	},
	_lowerBound: function(element) {
		return this._bound(element, this.compare);
	},
	_upperBound: function(element) {
		var compare = this.compare;
		return this._bound(element, function(a, b) { return !compare(b, a); });
	},
	add: function(element) {
		var list = this._list;
		var index = this._upperBound(element);
		if (index > -1) {
			list.splice(index, 0, element);
		}
		var newIndex = list.length - 1;
		Object.defineProperty(this, newIndex.toString(), {
			enumerable: true,
			configurable: true,
			get: function() { return this._list[newIndex]; },
			set: function(value) { this._list[newIndex] = value; }
		});
	},
	remove: function(element) {
		var list = this._list;
		var index = this._lowerBound(element);
		if ((index > -1) && (!this.compare(element, list[index]))) {
			list.splice(index, 1);
		}
		delete this[list.length];
	},
	toString: function() {
		return this._list.toString();
	}
});