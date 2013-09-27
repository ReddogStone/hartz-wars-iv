'use strict';

function Scene() {
	Node.apply(this);
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.anchor = new Point(0.5, 0.5);
	this.pos = new Pos(0.5 * w, 0.5 * h);
}
Scene.extends(Node, {
	_handleMouseEvent: function(event, type) {
		var children = this.children;
		var child;
		for (var i = children.length - 1; i >= 0; --i) {
			child = children[i];
			if (child.visible && child[type]) {
				if (child[type](event)) {
					return true;
				}
			}
		}
		return false;
	},
	mouseDown: function(event) {
		return this._handleMouseEvent(event, 'mouseDown');
	},
	mouseUp: function(event) {
		return this._handleMouseEvent(event, 'mouseUp');
	},
	mouseMove: function(event) {
		return this._handleMouseEvent(event, 'mouseMove');
	}
});
