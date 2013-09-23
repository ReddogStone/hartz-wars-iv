'use strict';

function parseColor(color) {
	var r, g, b, a;
	if (color.charAt(0) == '#') {
		r = color.substr(1, 2);
		g = color.substr(3, 2);
		b = color.substr(5, 2);
		r = parseInt(r, 16);
		g = parseInt(g, 16);
		b = parseInt(b, 16);
		a = 1.0;
	} else if (color.indexOf('rgba(') == 0) {
		let parts = color.slice(5).split(',');
		r = parts[0];
		g = parts[1];
		b = parts[2];
		a = parts[3];
		a = a.substr(0, a.length - 1);
		r = parseFloat(r);
		g = parseFloat(g);
		b = parseFloat(b);
		a = parseFloat(a);
	} else {
	}
	return {
		red: r,
		green: g,
		blue: b,
		alpha: a
	};
}

function Sprite(size, texture, sourceRect) {
	Node.apply(this);
	
	this.size = cloneSize(size);
	this.texture = texture;
	var width = texture ? texture.width : 0;
	var height = texture ? texture.height : 0;
	this.sourceRect = sourceRect || new Rect(0, 0, width, height);
	this._bufferCanvas = document.createElement('canvas');
	this._buffered = false;
	this._color = null;
	this.blend = 'source-over';
	Object.defineProperty(this, 'color', {enumerable: true, get: this.getColor, set: this.setColor});
}
Sprite.extends(Node, {
	getColor: function() {
		return this._color;
	},
	setColor: function(value) {
		if (this._color != value) {
			this._color = value;
			this._buffered = false;
		}
	},
	renderSelf: function(context) {
		try {
			var sRect = this.sourceRect;
			var size = this.size;
			var operation = context.globalCompositeOperation;
			var texture = this.texture;

			var saveOp = context.globalCompositeOperation;
			context.globalCompositeOperation = this.blend;
			
			if (texture) {
				if (this.color) {
					let bufferCanvas = this._bufferCanvas;
					let width = texture.width;
					let height = texture.height;
					if (!this._buffered) {
						bufferCanvas.width = width;
						bufferCanvas.height = height;
						let buffer = bufferCanvas.getContext('2d');
						
						buffer.drawImage(texture, 0, 0);
						let data = buffer.getImageData(0, 0, width, height);
						let pixelData = data.data;
						let color = parseColor(this.color);
						for (let i = 0; i < pixelData.length; i += 4) {
							let sr = pixelData[i];
							let sg = pixelData[i + 1];
							let sb = pixelData[i + 2];
							let sa = pixelData[i + 3];
							pixelData[i] = 255 * (sr / 255 * color.red / 255);
							pixelData[i + 1] = 255 * (sg / 255 * color.green / 255);
							pixelData[i + 2] = 255 * (sb / 255 * color.blue / 255);
							pixelData[i + 3] = sa * color.alpha;
						}
						buffer.putImageData(data, 0, 0);
						this._buffered = true;
					}
					texture = bufferCanvas;
				}

				context.drawImage(texture, sRect.x, sRect.y, sRect.sx, sRect.sy, 0, 0, size.x, size.y);
			} else if (this.color) {
				context.fillStyle = this.color;
				context.fillRect(0, 0, size.x, size.y);
			}
			
			context.globalCompositeOperation = saveOp;
		} catch (e) {
			throw e;
		}
	}
});
