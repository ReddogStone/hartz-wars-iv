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

function TextRenderable(engine, text, font, color) {
	this._text = text || '';
	this._font = Font.clone(font) || new Font();
	this._color = Color.clone(color) || new Color();

	var meshData = this._meshData = [
		{
			"vertices": [
				//x	   y	z	 nx   ny   nz   tu   tv
				-0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
				 0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
				-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
				 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 0 },
				"aNormal": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 3 * 4 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 6 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);

	var canvas = this._bufferCanvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 128;
	this._buffered = false;
	
	this.material = new SimpleMaterial(engine, engine.createTexture(canvas));
}
TextRenderable.extends(Object, {
	render: function(engine, globalParams) {
		var bufferCanvas = this._bufferCanvas;
		if (!this._buffered) {
			var context = bufferCanvas.getContext('2d');
			context.fillStyle = "rgba(255, 255, 255, 0)";
			context.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);			
			context.font = this._font.toString();
			context.fillStyle = this._color.toString();
			context.textAlign = 'start';
			var sy = this._font.size;
			context.fillText(this._text, 0, sy);
			engine.reloadTextureImage(this.material.texture);
		}
	
		this.material.set(engine, globalParams);
		this._mesh.render(engine);
	}
});