'use strict';

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
	mouseDown: function(event) {
		this.handlers.some(function(element, index, array) {
			return !element.mouseHandler.mouseDown(event);
		});
	},
	mouseUp: function(event) {
		this.handlers.some(function(element, index, array) {
			return element.mouseHandler.mouseUp(event);
		});
	},
	mouseMove: function(event) {
		this.handlers.some(function(element, index, array) {
			return element.mouseHandler.mouseMove(event);
		});
	}
});

function Scene() {
	Node.apply(this);
	
	this.mouseHandler = new MouseDispatcher();
}
Scene.extends(Node);
