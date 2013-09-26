'use strict';

function MouseEventSink() {
}
MouseEventSink.extends(Object, {
	mouseDown: function(event) {
		return true;
	},
	mouseUp: function(event) {
		return true;
	},
	mouseMove: function(event) {
		return true;
	}
});

function MouseNonHandler() {
}
MouseNonHandler.extends(Object, {
	mouseDown: function(event) {
		return false;
	},
	mouseUp: function(event) {
		return false;
	},
	mouseMove: function(event) {
		return false;
	}
});

function MouseDispatcher() {
	this.handlers = [];
}
MouseDispatcher.extends(Object, {
	addHandler: function(handler) {
		this.handlers.unshift(handler);
	},
	removeHandler: function(handler) {
		this.handlers.remove(handler);
	},
	clear: function() {
		this.handlers.clear();
	},
	mouseDown: function(event) {
		return this.handlers.some(function(element, index, array) {
			return element.mouseHandler.mouseDown(event);
		});
	},
	mouseUp: function(event) {
		return this.handlers.some(function(element, index, array) {
			return element.mouseHandler.mouseUp(event);
		});
	},
	mouseMove: function(event) {
/*		var eventX = event.x;
		var eventY = event.y;
		var x = this.pos.x - this.size.x * this.anchor.x;
		var y = this.pos.y - this.size.y * this.anchor.y;
		eventX += x;
		eventY += y;
		event.x = eventX;
		event.y = eventY;*/
		return this.handlers.some(function(element, index, array) {
			return element.mouseHandler.mouseMove(event);
		});
	}
});
