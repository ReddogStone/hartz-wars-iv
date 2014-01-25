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

	function FlatTreeLayout() {
		this.center = new Vecmath.Vector3();
		this.width = 0;
		this.height = 0;

		this.line = null;
	}
	FlatTreeLayout.extends(Object, {
		apply: function(subtree) {
			Distribution.horizontalLinear(subtree);

			var rootTrans = subtree.transformable;
			var children = subtree.children;

			// calculate layout info
			var childRect = calculateChildRect(subtree);

			// add lines
			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				child.layout.line = createLine(rootTrans, child.transformable, 'horizontal');
			}

			childRect.min.y = 0;

			var center = childRect.min.clone().add(childRect.max).scale(0.5);

			this.center = new Vecmath.Vector3(center.x, 0.0, center.y);
			this.width = childRect.max.x - childRect.min.x;
			this.height = childRect.max.y - childRect.min.y;
		},
		addToScene: function(scene) {
			var line = this.line;
			if (line) {
				line._id = 
					scene.lineBatch.add(line.from.pos, line.to.pos, line.color, line.width, line.patternIndex);
			}
		},
		removeFromScene: function(scene) {
			var line = this.line;
			if (line) {
				scene.lineBatch.remove(line._id);
				delete line._id;
			}
		}
	});

	module.dialogTreeOverviewLayout = function(engine, scene, subtree, decorate) {
		subtree.forEachSubtree(function(child) {
			child.transformable = new Transformable();
			child.offset = new Vecmath.Vector3();
			child.node.createWidget(engine, scene, child);

			if (child.node.type == 'parallel') {
				child.layout = new DialogOverviewLayout.HorizontalDialogTreeLayout();
			} else {
				child.layout = new DialogOverviewLayout.VerticalDialogTreeLayout();
			}
		});
		subtree.postOrderSubtrees(function(child) {
			child.layout.apply(child);
		});

		var root = subtree;
		while (root.parent) {
			root = root.parent;
			root.layout.apply(root);
		}

/*		subtree.forEachChildSubtree(function(child) {
			if (child.parent) {
				child.transformable.translate(child.parent.transformable.pos);
			}
		}); */
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
	};

	module.treeOverviewLayout = function(engine, scene, subtree, decorate) {
		subtree.forEachSubtree(function(child) {
			child.transformable = new Transformable();
			child.node.createWidget(engine, scene, child);
			child.layout = new FlatTreeLayout();
		});
		subtree.postOrderSubtrees(function(child) {
			child.layout.apply(child);
		});
		subtree.forEachSubtree(function(child) {
			if (child.parent) {
				child.transformable.translate(child.parent.transformable.pos);
			}
		});

		var parent = subtree.parent;
		while (parent) {
			parent.layout.apply(parent);
			parent = parent.parent;
		}
	};

	return module;
})(Layout || {});