'use strict';

function Node() {
	this.pos = new Pos();
	this.anchor = new Point();
	this.size = new Size();
	
	this.children = [];
	this.actions = [];
}
Node.extends(Object, {
	init: function() {
		this.children.forEach(function(element, index, array) {
			element.init();
		});
	},
	getRect: function() {
		var pos = this.pos;
		var size = this.size;
		return new Rect(pos.x, pos.y, size.x, size.y);
	},
	addChild: function(child) {
		if (child.init) {
			child.init();
		}
		this.children.push(child);
	},
	removeChild: function(child) {
		this.children.remove(child);
	},
	addAction: function(action) {
		if (action.init) {	
			action.init();
		}
		this.actions.push(action);
	},
	removeAction: function(action) {
		this.actions.remove(action);
	},
	render: function(context) {
		var pos = this.pos;
		var anchor = this.anchor;
		var size = this.size;
		if (size) {
			pos = new Pos(pos.x - anchor.x * size.x, pos.y - anchor.y * size.y);
		}
		
		context.save();
		RenderUtils.transform(context, pos);
		
		if (this.renderSelf) {
			this.renderSelf(context);
		}		
		
		this.children.forEach(function(element, index, array) {
			element.render(context);
		});
		context.restore();
	},
	update: function(deltaTime) {
		if (this.updateSelf) {
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
})