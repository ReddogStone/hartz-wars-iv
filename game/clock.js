'use strict';

var MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
var DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

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
	
	get day() {
		return this._date.getDay();
	},
	
	toString: function() {
		var date = this._date;
		return DAYS[date.getDay()] + ' ' +
			date.getDate() + '.' + 
			MONTHS[date.getMonth()] + ' ' + 
			date.getFullYear() + ', ' +
			padNumber(date.getHours(), 2) + ':' + 
			padNumber(date.getMinutes(), 2);
	}
};

Clock.timeDiff = function(from, to) {
	if (to < from) {
		to += 24;
	}
	return to - from;
}