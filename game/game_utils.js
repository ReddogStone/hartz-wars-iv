'use strict';

var GameUtils = {
	randomSelect: function() {
		var l = arguments.length;
		var index = Math.floor(Math.random() * l);
		return arguments[index];
	}
};