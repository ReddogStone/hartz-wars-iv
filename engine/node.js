'use strict';

function Node() {
	this.pos = new Pos();
	this.anchor = new Point();
	this.visible = true;
	this.selfVisible = true;
	this.scale = new Size(1, 1);
	this.alpha = 1.0;
	this.z = Number.NEGATIVE_INFINITY;
	
	this.children = new SortedList( function(a, b) {return a.z < b.z;} );
	this.actions = [];
}
Node.extends(Object, {
	init: function() {
		if ('initSelf' in this) {
			this.initSelf();
		}
		this.children.forEach(function(element, index, array) {
			element.init();
		});
	},
	getTransform: function() {
		var pos = this.pos;
		var scale = this.scale;
		var size = this.size;
		var anchor = this.anchor;
		
		return Transform.identity().
			translate(pos.x, pos.y).
			rotate(pos.rot).
			scale(scale.x, scale.y).
			translate(-size.x * anchor.x, - size.y * anchor.y);
	},
	getLocalRect: function() {
		var size = this.size;
		return new Rect(0, 0, size.x, size.y);
	},
	addChild: function(child) {
		this.children.add(child);
	},
	removeChild: function(child) {
		this.children.remove(child);
	},
	repositionChild: function(child) {
		
	},
	addAction: function(action) {
		if (action.start) {
			action.start();
		}
		this.actions.push(action);
	},
	removeAction: function(action) {
		if (action.stop) {
			action.stop();
		}
		this.actions.remove(action);
	},
	render: function(context) {
		if (!this.visible) {
			return;
		}
	
		var pos = this.pos;
		var scale = this.scale;
		var size = this.size;
		var anchor = this.anchor;
		
		context.save();
		context.globalAlpha = this.alpha;
		RenderUtils.transform(context, pos, scale, size, anchor);
		
		if (('renderSelf' in this) && this.selfVisible) {
			this.renderSelf(context);
		}		
		
		this.children.resort();
		this.children.forEach(function(element, index, array) {
			element.render(context);
		});
		context.restore();
	},
	update: function(deltaTime) {
		if ('updateSelf' in this) {
			this.updateSelf(deltaTime);
		}
		
		this.actions.forEach(function(element, index, array) {
			element.update(deltaTime);
			if (element.finished) {
				this.actions.splice(index, 1);
			}
		}, this);
	
		this.children.forEach(function(element, index, array) {
			element.update(deltaTime);
		});
	}
});
