var DialogOverviewLayout = (function(module) {
	'use strict';

	function DialogTreeLayout() {
		this.center = new Vecmath.Vector3();
		this.width = 0;
		this.height = 0;
		this.bottomTrans = new Transformable();
		this.parentLine = new Layout.LineDesc();
		this.bottomLine = new Layout.LineDesc();

		this._bottomOffset = null;
		this._lineBatch = null;
	}
	DialogTreeLayout.extends(Object, {
		setHighlighted: function(value) {
			if (this._lineBatch) {
				this.parentLine.highlight(this._lineBatch, value);
				this.bottomLine.highlight(this._lineBatch, value);
			}
		},
		update: function(subtreeTransformable) {
			this.bottomTrans.pos = subtreeTransformable.pos.clone().add(this._bottomOffset);
			if (this._lineBatch) {
				this.parentLine.update(this._lineBatch);
				this.bottomLine.update(this._lineBatch);
			}
		},
		addToScene: function(scene) {
			var lineBatch = scene.lineBatch;
			this.parentLine.add(lineBatch);
			this.bottomLine.add(lineBatch);
			this._lineBatch = lineBatch;
		},
		removeFromScene: function(scene) {
			this.parentLine.remove(scene.lineBatch);
			this.bottomLine.remove(scene.lineBatch);
			delete this._lineBatch;
		}
	});

	function HorizontalDialogTreeLayout() {
		DialogTreeLayout.call(this);
	}
	HorizontalDialogTreeLayout.extends(DialogTreeLayout, {
		apply: function(subtree) {
			Distribution.horizontalLinear(subtree);

			var rootTrans = subtree.transformable;
			var children = subtree.children;

			// calculate layout info
			var childRect = Layout.calculateChildRect(subtree);

			// add lines
			if (subtree.children.length > 1) {
				childRect.max.y += childRect.min.y;
			}
			this._bottomOffset = new Vecmath.Vector3(0, 0, childRect.max.y);

			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				child.layout.parentLine.set(rootTrans, child.transformable, 'horizontal');
				child.layout.bottomLine.set(this.bottomTrans, child.layout.bottomTrans, 'weak');
			}

			childRect.min.y = 0;
			var center = childRect.min.clone().add(childRect.max).scale(0.5);

			this.center = new Vecmath.Vector3(center.x, 0.0, center.y);
			this.width = childRect.max.x - childRect.min.x;
			this.height = childRect.max.y - childRect.min.y;
		}
	});

	function VerticalDialogTreeLayout() {
		DialogTreeLayout.call(this);
	}
	VerticalDialogTreeLayout.extends(DialogTreeLayout, {
		apply: function(subtree) {
			Distribution.verticalLinear(subtree);

			var childRect = Layout.calculateChildRect(subtree);

			var last = subtree;
			var children = subtree.children;
			for (var i = 0; i < children.length; ++i) {
				var child = children[i];
				var from = (last == subtree) ? last.transformable : last.layout.bottomTrans;
				var to = child.transformable;
				child.layout.parentLine.set(from, to, 'vertical');
				last = child;
			}

			if (subtree != last) {
				this._bottomOffset = last.layout._bottomOffset.clone().add(last.offset);
			} else {
				this._bottomOffset = new Vecmath.Vector3();
			}

			childRect.min.y = 0;
			var center = childRect.min.clone().add(childRect.max).scale(0.5);

			this.center = new Vecmath.Vector3(center.x, 0.0, center.y);
			this.width = childRect.max.x - childRect.min.x;
			this.height = childRect.max.y - childRect.min.y;			
		}
	});

	module.HorizontalDialogTreeLayout = HorizontalDialogTreeLayout;
	module.VerticalDialogTreeLayout = VerticalDialogTreeLayout;

	return module;
})(DialogOverviewLayout || {});