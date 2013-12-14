'use strict';

function Sprite(texture, size) {
	var self = this;
	Node.apply(this);
	
	this.size = Size.clone(size);
	this.texture = texture;
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
	render: function(context) {
		var size = this.size;
		var texture = this.texture;

		var saveOp = context.globalCompositeOperation;
		context.globalCompositeOperation = this.blend;
		
		if (texture && texture.loaded) {
			var image = texture.image;
			var width = image.width;
			var height = image.height;
			if (this.color) {
				var bufferCanvas = this._bufferCanvas;
				if (!this._buffered) {
					bufferCanvas.width = width;
					bufferCanvas.height = height;
					var buffer = bufferCanvas.getContext('2d');
					
					try {
						buffer.drawImage(image, 0, 0);
					} catch(e) {
						e.message = 'Error when rendering: "' + image.src + '"\n' + e.message;
						throw e;
					}
					var data = buffer.getImageData(0, 0, width, height);
					var pixelData = data.data;
					var color = this.color;
					var red = color.red;
					var green = color.green;
					var blue = color.blue;
					var alpha = color.alpha;
					for (var i = 0; i < pixelData.length; i += 4) {
						var sr = pixelData[i];
						var sg = pixelData[i + 1];
						var sb = pixelData[i + 2];
						var sa = pixelData[i + 3];
						pixelData[i] = 255 * sr / 255 * red;
						pixelData[i + 1] = 255 * sg / 255 * green;
						pixelData[i + 2] = 255 * sb / 255 * blue;
						pixelData[i + 3] = sa * alpha;
					}
					buffer.putImageData(data, 0, 0);
					this._buffered = true;
				}
				image = bufferCanvas;
			}
			
			var sRect = texture.sourceRect || new Rect(0, 0, width, height);
			try {
				context.drawImage(image, sRect.x, sRect.y, sRect.sx, sRect.sy, 0, 0, size.x, size.y);
			} catch(e) {
				e.message = 'Error when rendering: "' + image.src + '"\n' + e.message;
				throw e;
			}
		} else if (this.color) {
			context.fillStyle = this.color.toString();
			context.fillRect(0, 0, size.x, size.y);
		}
		
		context.globalCompositeOperation = saveOp;
	},
	deserializeSelf: function(template) {
		Node.prototype.deserializeSelf.call(this, template);
		
		if (template.texture) { 
			var texture = Engine.textureManager.get(template.texture);
			if (!texture || !texture.image) {
				throw new Error('Could not get: "' + template.texture + '"');
			}
			this.texture = Texture.clone(texture);
		}
		if (template.color) { this.color = Color.clone(template.color); }
		if (template.blend)	{ this.blend = template.blend; }
	}
});
