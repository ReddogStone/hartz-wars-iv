'use strict';

function CircleLayout(axis) {
	this._axis = axis ? axis.clone() : new Vecmath.Vector3(0, -1, 0);
}
CircleLayout.extends(Object, {
	apply: function(root, children, radius, offset) {
		var rootPos = root.pos.clone().add(this._axis.clone().scale(offset));
		var rotation = new Vecmath.Quaternion().rotationTo(new Vecmath.Vector3(0, 1, 0), this._axis);
		var childCount = children.length;
		children.forEach(function(child, index) {
			var angle = (index / childCount - 0.5) * Math.PI * 2;
			var pos = new Vecmath.Vector3(radius * Math.sin(angle), 0, radius * Math.cos(angle));
			pos.transformQuat(rotation).add(rootPos);
			child.pos = pos;
		});
		
		return rootPos;
	}
});

function HalfCircleLayout(axis) {
	this._axis = axis ? axis.clone() : new Vecmath.Vector3(0, -1, 0);
}
HalfCircleLayout.extends(Object, {
	apply: function(root, children, radius, offset) {
		var rootPos = root.pos.clone().add(this._axis.clone().scale(offset));
		var rotation = new Vecmath.Quaternion().rotationTo(new Vecmath.Vector3(0, 1, 0), this._axis);
		var childCount = children.length;
		children.forEach(function(child, index) {
			var angle = (childCount > 1) ? (index / (childCount - 1) - 0.5) * Math.PI : 0;
			var pos = new Vecmath.Vector3(radius * Math.sin(angle), 0, radius * Math.cos(angle));
			pos.transformQuat(rotation).add(rootPos);
			child.pos = pos;
		});
		
		return rootPos;
	}
});

var Layout = (function() {
	var module = {};

	function calculateLayoutInfo(subtree) {
		// own position is (0, 0, 0) at this point
		var minZ = 0;
		var maxZ = 0;
		var minX = 0;
		var maxX = 0;
		subtree.children.forEach(function(child) {
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
		});
		return {
			center: new Vecmath.Vector3(0.5 * (minX + maxX), 0.0, 0.5 * (minZ + maxZ)),
			width: maxX - minX,
			height: maxZ - minZ
		};
	};

	function horizontalLinearLayout(subtree) {
		var rootNode = subtree.node;
		var rootTransformable = rootNode.widget.transformable;
		
		var length = 0;
		var childWidths = [];
		subtree.children.forEach(function(child) {
			var width = child.layout.width;
			childWidths.push(width);
			length += width;
		});
		var margin = Math.max(0.3 * length, 10);
		length += margin * (subtree.children.length - 1);
		
		var offset = new Vecmath.Vector3((subtree.children.length == 1) ? 0 : -0.5 * length, 0, 3);
		
		var xPos = 0;
		subtree.children.forEach(function(child, index) {
			var widget = child.node.widget;
			widget.transformable.pos = 
				rootTransformable.pos.clone().add(new Vecmath.Vector3(xPos + 0.5 * childWidths[index], 0, 0).add(offset));
			xPos += margin + childWidths[index];
		});
		
		var layout = calculateLayoutInfo(subtree);
		var oldHeight = layout.height;
		var newHeight = oldHeight + offset.z;
		layout.center.z += 0.5 * (newHeight - oldHeight);
		layout.height = newHeight;
		subtree.layout = layout;
	}

	function verticalLinearLayout(subtree) {
		var rootNode = subtree.node;
		var rootTransformable = rootNode.widget.transformable;
		
		var length = 0;

		var offset = new Vecmath.Vector3(0, 0, 5);
		// var last = subtree;
		subtree.children.forEach(function(child) {
			var widget = child.node.widget;
			widget.transformable.pos = rootTransformable.pos.clone().add(new Vecmath.Vector3(0, 0, length).add(offset));
			length += 3 + child.layout.height;
		});

		subtree.layout = calculateLayoutInfo(subtree);
	}

	module.dialogTreeOverviewLayout = function(subtree) {
		subtree.postOrderSubtrees(function(child) {
			if (child.node.data.type == 'parallel') {
				horizontalLinearLayout(child);
			} else {
				verticalLinearLayout(child);
			}
		});
		subtree.forEachChildSubtree(function(child) {
			child.node.widget.transformable.translate(child.parent.node.widget.transformable.pos);
		});
	};

	module.treeOverviewLayout = function(subtree) {
		subtree.postOrderSubtrees(function(child) {
			horizontalLinearLayout(child);
		});
		subtree.forEachChildSubtree(function(child) {
			child.node.widget.transformable.translate(child.parent.node.widget.transformable.pos);
		});
	};

	return module;
})();