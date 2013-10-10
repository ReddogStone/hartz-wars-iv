'use strict';

function Viewport(rect) {
	this.rect = Rect.clone(rect);
	this.buffer = document.createElement('canvas');
	this.buffer.width = rect.sx;
	this.buffer.height = rect.sy;
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
					stack.push([child, childTransform.combine(transform)]);
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
		flatList.sort(function(a, b) {return (a.z - b.z);} );
		for (var i = 0; i < flatList.length; ++i) {
			var current = flatList[i];
			var node = current[0];
			var transform = current[1];
			context.save();
			transform.setToContext(context);
			node.renderSelf(context);
			context.restore();
		}
	}
});