'use strict';

function RenderList() {
	this.pos = new Pos();
	this.size = new Size();
	this.children = [];
	this.debug = 'Node';
}
RenderList.prototype.addChild = function(child) {
	this.children.push(child);
};
RenderList.prototype.removeChild = function(child) {
	this.children.remove(child);
};
RenderList.prototype.render = function(node, context) {
	var pos = node.pos;

	this.children.forEach(function(element, index, array) {
		var elementPos = element.pos;
		
		context.save();
		context.translate(elementPos.x, elementPos.y);
		context.rotate(elementPos.rot);		
		
		element.renderable.render(element, context);
		
		context.restore();
	});
}
