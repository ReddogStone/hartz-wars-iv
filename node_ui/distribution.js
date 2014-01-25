var Distribution = (function(module) {
	module.horizontalLinear = function(subtree) {
		var length = 0;
		var childWidths = [];
		subtree.children.forEach(function(child) {
			var width = child.layout.width;
			childWidths.push(width);
			length += width;
		});
		var margin = Math.max(0.3 * length, 10);
		length += margin * (subtree.children.length - 1);
		
		var offset = new Vecmath.Vector3(-0.5 * length, 0, 3);
		
		var xPos = 0;
		subtree.children.forEach(function(child, index) {
			child.offset = new Vecmath.Vector3(xPos + 0.5 * childWidths[index], 0, 0).add(offset);
			xPos += margin + childWidths[index];
		});
	}

	module.verticalLinear = function(subtree) {
		var length = 0;

		var offset = new Vecmath.Vector3(0, 0, 5);
		// var last = subtree;
		subtree.children.forEach(function(child) {
			child.offset = new Vecmath.Vector3(0, 0, length).add(offset);
			length += 3 + child.layout.height;
		});
	}	

	return module;
})(Distribution || {});