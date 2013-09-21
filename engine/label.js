'use strict';

function Font(family, size, weight, style) {
	this.family = family || 'Georgia';
	this.size = size || '12pt';
	this.weight = weight || '100';
	this.style = style || 'normal';
}
Font.prototype.toString = function() {
	return this.style + ' ' + this.weight + ' ' + this.size + ' ' + this.family;
};

function Label(text, font, color, align) {
	this.text = text || '';
	this.font = font || new Font();
	this.color = color || '#000000';
	this.align = align || 'start';
}
Label.prototype.render = function(node, context) {
	context.font = this.font.toString();
	context.fillStyle = this.color;
	context.textAlign = this.align;
	context.fillText(this.text, 0, 0);
}

function createLabelNode(text, font, color, align) {
	var node = new Node();
	node.renderable = new Label(text, font, color, align);
	node.debug = 'Label';
	return node;
}