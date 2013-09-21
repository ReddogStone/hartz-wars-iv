'use strict';

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

function pad(number, width) {
	return ('00000000' + number).slice(-width);
}

function Clock(initialDate) {
	this._date = initialDate;
}

Clock.prototype = {
	advance: function(minutes) {
		var time = this._date.getTime();
		time += minutes * 60 * 1000;
		this._date = new Date(time);
	},
	
	toString: function() {
		return pad(this._date.getDate(), 2) + '.' + 
			MONTHS[this._date.getMonth()] + ' ' + 
			pad(this._date.getFullYear(), 4) + ', ' +
			pad(this._date.getHours(), 2) + ':' + 
			pad(this._date.getMinutes(), 2);
	}
};
