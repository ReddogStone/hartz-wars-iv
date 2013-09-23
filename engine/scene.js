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
			return element.mouseHandler.mouseDown(event);
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
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.anchor = new Point(0.5, 0.5);
	this.pos = new Pos(0.5 * w, 0.5 * h);
}
Scene.extends(Node);
