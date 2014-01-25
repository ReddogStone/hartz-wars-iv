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
	function FlatTreeLayout() {
		this.center = new Vecmath.Vector3();
		this.width = 0;
		this.height = 0;
		this.line = new Layout.LineDesc();
	}
	FlatTreeLayout.extends(Object, {
		setHighlighted: function(value) {
			if (this._lineBatch) {
				this.line.highlight(this._lineBatch, value);
			}
		},
		update: function(subtreeTransformable) {
			if (this._lineBatch) {
				this.line.update(this._lineBatch);
			}
		},
		apply: function(subtree) {
			Distribution.horizontalLinear(subtree);

			var rootTrans = subtree.transformable;
			var children = subtree.children;

			// calculate layout info
			var childRect = Layout.calculateChildRect(subtree);

			// add lines
			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				child.layout.line.set(rootTrans, child.transformable, 'horizontal');
			}

			childRect.min.y = 0;

			var center = childRect.min.clone().add(childRect.max).scale(0.5);

			this.center = new Vecmath.Vector3(center.x, 0.0, center.y);
			this.width = childRect.max.x - childRect.min.x;
			this.height = childRect.max.y - childRect.min.y;
		},
		addToScene: function(scene) {
			var lineBatch = scene.lineBatch;
			this.line.add(lineBatch);
			this._lineBatch = lineBatch;
		},
		removeFromScene: function(scene) {
			this.line.remove(this._lineBatch);
			delete this._lineBatch;
		}
	});

	function applyLayout(engine, scene, subtree, getSubtreeLayout) {
		subtree.forEachSubtree(function(child) {
			child.transformable = new Transformable();
			child.offset = new Vecmath.Vector3();
			child.node.createWidget(engine, scene, child);
			child.layout = getSubtreeLayout(child);
		});
		subtree.postOrderSubtrees(function(child) {
			child.layout.apply(child);
		});

		var root = subtree;
		while (root.parent) {
			root = root.parent;
			root.layout.apply(root);
		}

		root.forEachSubtree(function(child) {
			var offset = child.offset.clone();
			if (child.parent) {
				offset.add(child.parent.transformable.pos);
			}
			child.transformable.pos = offset;
		});
		root.forEachSubtree(function(child) {
			child.layout.update(child.transformable);
			child.node.widget.updatePos();
		});
	}

	module.dialogTreeOverviewLayout = function(engine, scene, subtree) {
		applyLayout(engine, scene, subtree, function(tree) {
			if (tree.node.type == 'parallel') {
				return new DialogOverviewLayout.HorizontalDialogTreeLayout();
			}

			return new DialogOverviewLayout.VerticalDialogTreeLayout();
		});
	};

	module.treeOverviewLayout = function(engine, scene, subtree) {
		applyLayout(engine, scene, subtree, function(tree) { return new FlatTreeLayout(); });
	};

	return module;
})(Layout || {});