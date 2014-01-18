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

var Layout = (function(module) {
	var module = {};

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
	}

	module.dialogTreeOverviewLayout = function(engine, scene, subtree, decorate) {
		subtree.postOrderSubtrees(function(child) {
			child.node.createWidget(engine, scene);
			if (child.node.type == 'parallel') {
				horizontalLinearLayout(child);
			} else {
				verticalLinearLayout(child);
			}
			child.layout = decorate(engine, scene, child);
		});
		subtree.forEachChildSubtree(function(child) {
			child.node.widget.transformable.translate(child.parent.node.widget.transformable.pos);
		});
	};

	module.treeOverviewLayout = function(engine, scene, subtree, decorate) {
		subtree.postOrderSubtrees(function(child) {
			child.node.createWidget(engine, scene);
			horizontalLinearLayout(child);
			child.layout = decorate(engine, scene, child);
		});
		subtree.forEachChildSubtree(function(child) {
			child.node.widget.transformable.translate(child.parent.node.widget.transformable.pos);
		});
	};

	return module;
})(Layout || {});