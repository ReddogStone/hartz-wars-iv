'use strict';

var Decorator = (function(module) {
	function calculateChildRect(subtree) {
		if (subtree.children.length == 0) {
			return {
				min: new Vecmath.Vector2(0, 0),
				max: new Vecmath.Vector2(0, 0)
			};
		}

		var minZ = 10000;
		var maxZ = -10000;
		var minX = 10000;
		var maxX = -10000;
		for (var i = 0; i < subtree.children.length; ++i) {
			var child = subtree.children[i];
			var childLayout = child.layout;
			var childPos = child.node.widget.transformable.pos;
			var center = childPos.clone().add(childLayout.center);
			var childMinX = center.x - 0.5 * childLayout.width;
			var childMaxX = center.x + 0.5 * childLayout.width;
			var childMinZ = center.z - 0.5 * childLayout.height;
			var childMaxZ = center.z + 0.5 * childLayout.height;
			
			minX = Math.min(minX, childMinX);
			maxX = Math.max(maxX, childMaxX);
			minZ = Math.min(minZ, childMinZ);
			maxZ = Math.max(maxZ, childMaxZ);
		}

		return {
			min: new Vecmath.Vector2(minX, minZ),
			max: new Vecmath.Vector2(maxX, maxZ)
		};
	};

	function createLine(from, to, type) {
		var pattern;
		var alpha;
		var width;
		var color = Color.clone(BLUE);

		if (type == 'horizontal') {
			pattern = 0;
			color.alpha = 0.8;
			width = 10;
		} else if (type == 'vertical') {
			pattern = 1;
			color.alpha = 0.3;
			width = 5;
		} else if (type == 'weak') {
			pattern = 0;
			color.alpha = 0.3;
			width = 10;
		}

		var result = {};
		result.from = from;
		result.to = to;
		result.color = color;
		result.width = width;
		result.patternIndex = pattern;
		return result;
	}

	module.decorateOverview = function(engine, scene, subtree) {
		var rootTrans = subtree.node.widget.transformable;
		var children = subtree.children;

		var bottomPos;
		var bottomTrans;

		// calculate layout info
		var childRect = calculateChildRect(subtree);

		// add lines
		if (subtree.node.type == 'parallel') {
			if (subtree.children.length > 1) {
				childRect.max.y += childRect.min.y;
			}
			bottomPos = new Vecmath.Vector3(0, 0, childRect.max.y);
			bottomTrans = new Transformable();
			subtree.node.widget.addChildPoint(bottomPos, bottomTrans);

			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				var widget = child.node.widget;
				widget.addLine(createLine(rootTrans, widget.transformable, 'horizontal'));
				widget.addLine(createLine(bottomTrans, child.layout.bottomTrans, 'weak'));
			}
		} else {
			var last = subtree;
			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				var widget = child.node.widget;
				var from = (last.layout && last.layout.bottomTrans) ?
					last.layout.bottomTrans :
					last.node.widget.transformable;
				var to = widget.transformable;
				widget.addLine(createLine(from, to, 'vertical'));
				last = child;
			}
			bottomTrans = (last.layout && last.layout.bottomTrans) ?
					last.layout.bottomTrans :
					last.node.widget.transformable;
			bottomPos = bottomTrans.pos;
		}

		childRect.min.y = 0;
		var center = childRect.min.clone().add(childRect.max).scale(0.5);

		return {
			center: new Vecmath.Vector3(center.x, 0.0, center.y),
			width: childRect.max.x - childRect.min.x,
			height: childRect.max.y - childRect.min.y,
			bottomPos: bottomPos,
			bottomTrans: bottomTrans
		};
	}

	return module;
})(Decorator || {});