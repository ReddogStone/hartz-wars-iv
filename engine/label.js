'use strict';

function Font(family, size, weight, style) {
	this.family = family || 'Georgia';
	this.size = size || 12;
	this.weight = weight || '100';
	this.style = style || 'normal';
}
Font.prototype.toString = function() {
	return this.style + ' ' + this.weight + ' ' + this.size + 'pt ' + this.family;
};

function Label(context, text, font, color) {
	this._context = context;
	this.text = text || '';
	
	this.font = font || new Font();
	this.color = color || '#000000';
	
	Object.defineProperty(this, 'size', {get: this._getSize});
}
Label.prototype._getSize = function() {
	this._context.font = this.font.toString();
	var sx = this._context.measureText(this.text).width;
	var sy = this.font.size;
	return new Size(sx, sy);
};
Label.prototype.render = function(node, context) {
	context.font = this.font.toString();
	context.fillStyle = this.color;
	context.textAlign = 'start';
	var sy = this.font.size;
	context.fillText(this.text, 0, sy);
};

function createLabelNode(text, font, color) {
	var node = new Node();
	node.renderable = new Label(text, font, color);
	node.debug = 'Label';
	return node;
}