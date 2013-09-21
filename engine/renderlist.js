'use strict';

function RenderList(ownRenderable) {
	this.own = ownRenderable;
	this.children = [];
}
RenderList.prototype.addChild = function(child) {
	this.children.push(child);
};
RenderList.prototype.removeChild = function(child) {
	this.children.remove(child);
};
RenderList.prototype.render = function(node, context) {
	var pos = node.pos;

	if (this.own) {
		this.own.render(node, context);
	}
	
	this.children.forEach(function(element, index, array) {
		RenderUtils.renderNode(element, context);
	});
}
