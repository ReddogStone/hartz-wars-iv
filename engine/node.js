'use strict';

var globalScope = this;

function Node() {
	this.id = Node.createNewId();
	this.pos = new Pos();
	this.globalTransform = Transform.identity();
	this.anchor = new Point();
	this.visible = true;
	this.selfVisible = true;
	this.scale = new Size(1, 1);
	this.alpha = 1.0;
	this.globalAlpha = 1.0;
	this.z = Number.NEGATIVE_INFINITY;
	if (!('size' in this)) {
		this.size = new Size(0, 0);
	}
	
	this.children = [];
	this.actions = [];
}
Node.extends(Object, {
	get hoverable() {
		return false;
	},
	init: function() {
		if ('initSelf' in this) {
			this.initSelf();
		}
		this.children.forEach(function(element, index, array) {
			element.init();
		});
	},
	getLocalTransform: function() {
		var pos = this.pos;
		var scale = this.scale;
		var size = this.size;
		var anchor = this.anchor;
		
		if (!size) {
			debugger;
		}
		
		return Transform.identity().
			translate(pos.x, pos.y).
			rotate(pos.rot).
			scale(scale.x, scale.y).
			translate(-size.x * anchor.x, - size.y * anchor.y);
	},
	getBoundingBox: function() {
		var transform = this.globalTransform;
		var size = this.size;
		var points = [
			transform.apply(Vec.create(0, 0)),
			transform.apply(Vec.create(size.x, 0)),
			transform.apply(Vec.create(0, size.y)),
			transform.apply(Vec.create(size.x, size.y))
		];
		var left = points[0].x;
		var top = points[0].y;
		var right = left;
		var bottom = top;
		for (var i = 1; i < points.length; ++i) {
			var point = points[i];
			if (point.x < left) { left = point.x; }
			if (point.y < top) { top = point.y;	}
			if (point.x > right) { right = point.x; }
			if (point.y > bottom) { bottom = point.y; }
		}
		return new Rect(left, top, right - left, bottom - top);
	},
	getLocalRect: function() {
		var size = this.size;
		return new Rect(0, 0, size.x, size.y);
	},
	addChild: function(child) {
		this.children.push(child);
	},
	removeChild: function(child) {
		this.children.remove(child);
	},
	clearChildren: function() {
		this.children.clear();
	},
	addAction: function(action) {
		if (action.start) {
			action.start();
		}
		if (!action.finished) {
			this.actions.push(action);
		}
	},
	cancelAction: function(action) {
		this.actions.remove(action);
	},
	cancelAllActions: function() {
		this.actions.clear();
	},
	update: function(deltaTime) {
		if (this.updateSelf) {
			this.updateSelf(deltaTime);
		}

		this.actions.reverseForEach(function(action, index) {
			action.update(deltaTime);
			if (action.finished) {
				this.actions.splice(index, 1);
			}
		}, this);
	
		this.children.forEach(function(element, index, array) {
			element.update(deltaTime);
		});
	},
	deserializeSelf: function(template) {
		if (template.pos) { this.pos = Pos.clone(template.pos); }
		if (template.anchor) { this.anchor = Point.clone(template.anchor); }
		if (template.size) { this.size = Size.clone(template.size); }
		if (template.visible !== undefined) { this.visible = template.visible; }
		if (template.selfVisible !== undefined) { this.selfVisible = template.selfVisible; }
		if (template.scale) { this.scale = Size.clone(template.scale); }
		if (template.alpha !== undefined) { this.alpha = template.alpha; }
		if (template.z !== undefined) { this.z = template.z; }		
	},
	deserialize: function(template) {
		var children = [];
		var templChildren = template.children || {};
		for (var childName in templChildren) {
			var childTemplate = templChildren[childName];
			var child = createFromTemplate(childTemplate);
			children.push({name: childName, node: child});
		}
		
		this.deserializeSelf(template);
				
		children.forEach( function(element, index, array) {
			this.addChild(element.node);
			this[element.name] = element.node;
		}, this);
	}
});

Node._currentId = 0;
Node.createNewId = function () {
	return Node._currentId++;
};
