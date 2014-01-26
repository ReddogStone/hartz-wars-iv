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
	function applyLayout(engine, scene, entity, getLayout) {
		Subtree.preOrder(entity, function(child) {
			child.transformable = new Transformable();
			child.offset = new Vecmath.Vector3();
			child.widget = child.node.createWidget(engine, scene, child);
			child.layout = getLayout(child);
		});
		Subtree.postOrder(entity, function(child) {
			child.layout.apply(child);
		});

		var root = entity;
		while (root.tree.parent) {
			root = root.tree.parent;
			root.layout.apply(root);
		}

		Subtree.preOrder(root, function(child) {
			var offset = child.offset.clone();
			if (child.tree.parent) {
				offset.add(child.tree.parent.transformable.pos);
			}
			child.transformable.pos = offset;
		});
		Subtree.preOrder(root, function(child) {
			child.layout.update(child.transformable);
			child.widget.updatePos();
		});
	}

	module.dialogTreeOverviewLayout = function(engine, scene, entity) {
		applyLayout(engine, scene, entity, function(tree) {
			if (tree.node.type == 'parallel') {
				return new Layout.HorizontalDialogTreeLayout();
			}

			return new Layout.VerticalDialogTreeLayout();
		});
	};

	module.treeOverviewLayout = function(engine, scene, entity) {
		applyLayout(engine, scene, entity, function(tree) { return new Layout.FlatTreeLayout(); });
	};

	return module;
})(Layout || {});