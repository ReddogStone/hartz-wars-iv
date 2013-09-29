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
		var parts = color.slice(5).split(',');
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

function Sprite(texture, size, sourceRect) {
	var self = this;
	Node.apply(this);
	
	this.size = Size.clone(size);
	this.texture = texture;
	this.sourceRect = sourceRect;
	this._bufferCanvas = document.createElement('canvas');
	this._buffered = false;
	this._color = null;
	this.blend = 'source-over';
}
Sprite.extends(Node, {
	get color() {
		return this._color;
	},
	set color(value) {
		if (this._color != value) {
			this._color = value;
			this._buffered = false;
		}
	},
	renderSelf: function(context) {
		var sRect = this.sourceRect;
		var size = this.size;
		var texture = this.texture;

		var saveOp = context.globalCompositeOperation;
		context.globalCompositeOperation = this.blend;
		
		if (texture && texture.complete) {
			var width = texture.width;
			var height = texture.height;
			if (this.color) {
				var bufferCanvas = this._bufferCanvas;
				if (!this._buffered) {
					bufferCanvas.width = width;
					bufferCanvas.height = height;
					var buffer = bufferCanvas.getContext('2d');
					
					buffer.drawImage(texture, 0, 0);
					var data = buffer.getImageData(0, 0, width, height);
					var pixelData = data.data;
					var color = parseColor(this.color);
					for (var i = 0; i < pixelData.length; i += 4) {
						var sr = pixelData[i];
						var sg = pixelData[i + 1];
						var sb = pixelData[i + 2];
						var sa = pixelData[i + 3];
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
			
			sRect = sRect || new Rect(0, 0, width, height);
			context.drawImage(texture, sRect.x, sRect.y, sRect.sx, sRect.sy, 0, 0, size.x, size.y);
		} else if (this.color) {
			context.fillStyle = this.color;
			context.fillRect(0, 0, size.x, size.y);
		}
		
		context.globalCompositeOperation = saveOp;
	}
});
