'use strict';

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
					var color = this.color;
					for (var i = 0; i < pixelData.length; i += 4) {
						var sr = pixelData[i];
						var sg = pixelData[i + 1];
						var sb = pixelData[i + 2];
						var sa = pixelData[i + 3];
						pixelData[i] = 255 * (sr / 255 * color.red);
						pixelData[i + 1] = 255 * (sg / 255 * color.green);
						pixelData[i + 2] = 255 * (sb / 255 * color.blue);
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
			context.fillStyle = this.color.toString();
			context.fillRect(0, 0, size.x, size.y);
		}
		
		context.globalCompositeOperation = saveOp;
	}
});
