'use strict';

function Viewport(destRect, size) {
	this.destRect = Rect.clone(destRect);
	var size = size ? Size.clone(size) : new Size(destRect.sx, destRect.sy);
	this.size = size;
	this._buffer = document.createElement('canvas');
	this._buffer.width = size.x;
	this._buffer.height = size.y;
}

Viewport.extends(Object, {
	render: function(context, scene) {
		if (!scene) {
			return;
		}
	
		var flatList = scene.getRenderList(scene);
		var buffer = this._buffer;
		var bufferContext = buffer.getContext('2d');
		bufferContext.clearRect(0, 0, buffer.width, buffer.height);
		
		for (var i = 0; i < flatList.length; ++i) {
			var node = flatList[i];
			node.globalTransform.setToContext(bufferContext);
			bufferContext.globalAlpha = node.globalAlpha;
			node.render(bufferContext);
		}
		var destRect = this.destRect;
		context.drawImage(buffer, destRect.x, destRect.y, destRect.sx, destRect.sy);
	}
});