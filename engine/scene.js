'use strict';

function MouseDispatcher() {
	this.handlers = [];
}
MouseDispatcher.prototype.addHandler = function(handler) {
	this.handlers.unshift(handler);
};
MouseDispatcher.prototype.removeHandler = function(handler) {
	this.handlers.remove(handler);
};
MouseDispatcher.prototype.mouseDown = function(node, event) {
	this.handlers.every(function(element, index, array) {
		return !element.mouseHandler.mouseDown(element, event);
	});
};
MouseDispatcher.prototype.mouseUp = function(node, event) {
	this.handlers.every(function(element, index, array) {
		return !element.mouseHandler.mouseUp(element, event);
	});
};
MouseDispatcher.prototype.mouseMove = function(node, event) {
	this.handlers.every(function(element, index, array) {
		return !element.mouseHandler.mouseMove(element, event);
	});
};

function createSceneNode() {
	var node = new Node();
	node.debug = 'Scene';
	node.mouseHandler = new MouseDispatcher();
	node.renderable = new RenderList();
	return node;
}
