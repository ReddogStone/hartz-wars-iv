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

function Label(text, font, color) {
	Node.apply(this);
	
	var canvas = document.createElement('canvas');
	this._context = canvas.getContext('2d');
	this.text = text || '';
	
	this.font = font || new Font();
	this.color = color || '#000000';
	
	Object.defineProperty(this, 'size', {enumerable: true, get: this.getSize});
}
Label.extends(Node, {
	getSize: function() {
		this._context.font = this.font.toString();
		var sx = this._context.measureText(this.text).width;
		var sy = this.font.size;
		return new Size(sx, sy);
	},
	renderSelf: function(context) {
		context.font = this.font.toString();
		context.fillStyle = this.color;
		context.textAlign = 'start';
		var sy = this.font.size;
		context.fillText(this.text, 0, sy);
	}
});
