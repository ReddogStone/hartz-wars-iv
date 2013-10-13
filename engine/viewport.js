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
	_gatherChildren: function(scene) {
		var stack = [[scene, scene.getTransform()]];
		var result = [];
		while (stack.length > 0) {
			var current = stack.shift();
			var node = current[0];
			if (node.visible) {
				var transform = current[1];
				var children = node.children;
				for (var childIndex = 0; childIndex < children.length; ++childIndex) {
					var child = children[childIndex];
					var childTransform = child.getTransform();
					stack.push([child, transform.combine(childTransform)]);
				}
				
				if (node.renderSelf) {
					result.push([node, transform]);
				}
			}
		}
		return result;
	},
	render: function(context, scene) {
		var flatList = this._gatherChildren(scene);
		flatList.sort(function(a, b) {return (a[0].z - b[0].z);} );
		var buffer = this._buffer;
		var bufferContext = buffer.getContext('2d');
		bufferContext.clearRect(0, 0, buffer.width, buffer.height);
		
		for (var i = 0; i < flatList.length; ++i) {
			var current = flatList[i];
			var node = current[0];
			var transform = current[1];
			transform.setToContext(bufferContext);
			bufferContext.globalAlpha = node.alpha;
			node.renderSelf(bufferContext);
		}
		var destRect = this.destRect;
		context.drawImage(buffer, destRect.x, destRect.y, destRect.sx, destRect.sy);
	}
});