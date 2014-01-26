var Distribution = (function(module) {
	module.horizontalLinear = function(entity) {
		var length = 0;
		var childWidths = [];
		var children = entity.tree.children;
		for (var i = 0; i < children.length; ++i) {
			var width = children[i].layout.width;
			childWidths.push(width);
			length += width;
		}
		var margin = Math.max(0.3 * length, 10);
		length += margin * (children.length - 1);
		
		var offset = new Vecmath.Vector3(-0.5 * length, 0, 3);
		
		var xPos = 0;
		for (var i = 0; i < children.length; ++i) {
			children[i].offset = new Vecmath.Vector3(xPos + 0.5 * childWidths[i], 0, 0).add(offset);
			xPos += margin + childWidths[i];
		}
	}

	module.verticalLinear = function(entity) {
		var length = 0;

		var offset = new Vecmath.Vector3(0, 0, 5);
		var children = entity.tree.children;
		for (var i = 0; i < children.length; ++i) {
			var child = children[i];
			child.offset = new Vecmath.Vector3(0, 0, length).add(offset);
			length += 3 + child.layout.height;
		}
	}	

	return module;
})(Distribution || {});