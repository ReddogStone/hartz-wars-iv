var DialogOverviewLayout = (function(module) {
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
			var center = child.offset.clone().add(childLayout.center);
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

	function LineDesc() {
		this.from = null;
		this.to = null;
		this.color = null;
		this.width = null;
		this.patternIndex = null;
		this._id = null;
		this._active = false;
	}
	LineDesc.extends(Object, {
		get active() {
			return this._active;
		},
		set: function(from, to, type) {
			this._active = true;

			this.from = from;
			this.to = to;
			this.color = Color.clone(BLUE);

			if (type == 'horizontal') {
				this.patternIndex = 0;
				this.color.alpha = 0.8;
				this.width = 10;
			} else if (type == 'vertical') {
				this.patternIndex = 1;
				this.color.alpha = 0.3;
				this.width = 5;
			} else if (type == 'weak') {
				this.patternIndex = 0;
				this.color.alpha = 0.3;
				this.width = 10;
			}
		},
		highlight: function(batch, highlightValue) {
			if (!this._active) { return; }

			var color = Color.clone(this.color);
			if (highlightValue) {
				color.red += 0.8;
				color.green += 0.8;
				color.blue += 0.8;
			}
			color.alpha = this.color.alpha;
			batch.setColor(this._id, color);			
		},
		update: function(batch) {
			if (!this._active) { return; }

			batch.setEndPoints(this._id, this.from.pos, this.to.pos);			
		},
		add: function(batch) {
			if (!this._active) { return; }

			this._id = batch.add(this.from.pos, this.to.pos, this.color, this.width, this.patternIndex);
		},
		remove: function(batch) {
			if (!this._active) { return; }

			batch.remove(this._id);
			delete this._id;
		}
	});

	function DialogTreeLayout() {
		this.center = new Vecmath.Vector3();
		this.width = 0;
		this.height = 0;
		this.bottomTrans = new Transformable();
		this.parentLine = new LineDesc();
		this.bottomLine = new LineDesc();

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
			var childRect = calculateChildRect(subtree);

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

			var childRect = calculateChildRect(subtree);

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