var Layout = (function(module) {
	'use strict';

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

	module.FlatTreeLayout = FlatTreeLayout;
	return module;
})(Layout || {});
