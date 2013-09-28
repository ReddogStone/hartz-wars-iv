'use strict';

function SortedList(compare) {
	this._list = [];
	this.compare = compare;
}
SortedList.extends(Object, {
	get length() { return this._list.length; },
	_bound: function(element, compare, begin, end) {
		var list = this._list;
		begin = begin || 0;
		end = end || list.length;
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
	_lowerBound: function(element, begin, end) {
		return this._bound(element, this.compare, begin, end);
	},
	_upperBound: function(element, begin, end) {
		var compare = this.compare;
		return this._bound(element, function(a, b) { return !compare(b, a); }, begin, end);
	},
	add: function(element) {
		var list = this._list;
		list.splice(this._upperBound(element), 0, element);
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
		var begin = this._lowerBound(element);
		var end = this._upperBound(element, begin);
		var count = end - begin
		list.splice(begin, count);
		for (var i = 0; i < count; ++i) {
			delete this[list.length + i];
		}
	},
	resort: function() {
		// insertion sort costs only O(n) in the sorted case
		var list = this._list;
		for (var i = 0; i < list.length - 1; ++i) {
			var current = list[i];
			var next = list[i + 1];
			if (this.compare(next, current)) {
				var correctIndex = this._upperBound(next, 0, i + 1);
				for (var j = i; j >= correctIndex; --j) {
					list[j + 1] = list[j];
				}
				list[correctIndex] = next;
			}
		}
	},
	toString: function() {
		return this._list.toString();
	},
	forEach: function(callback, thisArg) {
		this._list.forEach(callback, thisArg);
	}
});