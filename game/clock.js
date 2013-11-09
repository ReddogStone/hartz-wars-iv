'use strict';

var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function Clock(initialDate) {
	this._date = initialDate;
}

Clock.prototype = {
	advance: function(minutes) {
		var time = this._date.getTime();
		time += minutes * 60 * 1000;
		this._date = new Date(time);
	},
	
	get time() {
		return this._date.getHours() + (this._date.getMinutes() / 60.0);
	},
	
	toString: function() {
		return this._date.getDate() + '.' + 
			MONTHS[this._date.getMonth()] + ' ' + 
			this._date.getFullYear() + ', ' +
			padNumber(this._date.getHours(), 2) + ':' + 
			padNumber(this._date.getMinutes(), 2);
	}
};

Clock.timeDiff = function(from, to) {
	if (to < from) {
		to += 24;
	}
	return to - from;
}