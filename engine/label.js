'use strict';

function Font(family, size, weight, style) {
	this._family = family || 'Georgia';
	this._size = size || 12;
	this._weight = weight || '100';
	this._style = style || 'normal';
	this.onChanged = null;
}
Font.extends(Object, {
	get family() {
		return this._family;
	},
	set family(value) {
		this._family = value;
		if (this.onChanged) {
			this.onChanged();
		}
	},
	get size() {
		return this._size;
	},
	set size(value) {
		this._size = value;
		if (this.onChanged) {
			this.onChanged();
		}
	},
	get weight() {
		return this._weight;
	},
	set weight(value) {
		this._weight = value;
		if (this.onChanged) {
			this.onChanged();
		}
	},
	get style() {
		return this._style;
	},
	set style(value) {
		this._style = value;
		if (this.onChanged) {
			this.onChanged();
		}
	},
	toString: function() {
		return this.style + ' ' + this.weight + ' ' + this.size + 'pt ' + this.family;
	}
});
Font.clone = function(value) {
	return value ? new Font(value.family, value.size, value.weight, value.style) : new Font();
}

function Label(text, font, color) {
	Node.apply(this);
	
	var canvas = document.createElement('canvas');
	this._context = canvas.getContext('2d');
	this._text = text || '';
	
	this._font = Font.clone(font) || new Font();
	var self = this;
	this._font.onChanged = function() {
		self._adjustSize();
	}
	
	this.color = Color.clone(color) || new Color();
	
	this._adjustSize();
}
Label.extends(Node, {
	_adjustSize: function() {
		this._context.font = this._font.toString();
		var sx = this._context.measureText(this.text).width;
		var sy = this.font.size;
		this.size = new Size(sx, sy);
	},
	get font() {
		return this._font;
	},
	set font(value) {
		this._font = value;
		this._adjustSize();
	},
	get text() {
		return this._text;
	},
	set text(value) {
		this._text = value;
		this._adjustSize();
	},
	renderSelf: function(context) {
		context.font = this._font.toString();
		context.fillStyle = this.color.toString();
		context.textAlign = 'start';
		var sy = this._font.size;
		context.fillText(this.text, 0, sy);
	},
	deserializeSelf: function(template) {
		Node.prototype.deserializeSelf.call(this, template);
		
		if (template.text) { this.text = template.text; }
		if (template.font) { this.font = Font.clone(template.font); }
		if (template.color) { this.color = Color.clone(template.color); }
	}
});
