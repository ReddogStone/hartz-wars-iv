'use strict';

function Scene() {
	Node.apply(this);
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.anchor = new Point(0.5, 0.5);
	this.pos = new Pos(0.5 * w, 0.5 * h);
	
	this.focussed = null;
}
Scene.extends(Node, {
	_handleMouseEvent: function(event, methodName, handleMethodName) {
		var children = this.children;
		for (var i = children.length - 1; i >= 0; --i) {
			var child = children[i];
			if (child.visible) {
				if ((methodName in child) || (handleMethodName in child)) {
					var pos = child.pos;
					var scale = child.scale;
					var size = child.size;
					var anchor = child.anchor;
					
					var inverseTransform = Transform.identity().
						translate(pos.x, pos.y).
						rotate(pos.rot).
						scale(scale.x, scale.y).
						translate(-size.x * anchor.x, - size.y * anchor.y).
						inverse();
					var childEvent = inverseTransform.apply(event);
					childEvent.down = event.down;
					
					if (child == this.focussed) {
						childEvent.focussed = true;
					}
				
					if ((methodName in child) && child[methodName](childEvent)) {
						return true;
					}
					if ((handleMethodName in child) && child[handleMethodName](childEvent)) {
						if (methodName == 'mouseDown') {
							this.focussed = child;
						}
						return true;
					}
				}
			}
		}
		
		if (handleMethodName in this) {
			if (this[handleMethodName](event)) {
				return true;
			}
		}
		
		return false;
	},
	mouseDown: function(event) {
		return this._handleMouseEvent(event, 'mouseDown', 'handleMouseDown');
	},
	mouseUp: function(event) {
		var handled = false;
		var focussed = this.focussed;
		if (focussed) {
			if ('handleMouseUp' in focussed) {
				var inverseTransform = focussed.getTransform().inverse();
				if (inverseTransform == null) {
					throw new Error('InverseTransform is null!');
				}
				var childEvent = inverseTransform.apply(event);
				childEvent.down = event.down;			
				handled = focussed.handleMouseUp(childEvent);
				if (handled) {
					this.focussed = null;
				}
			}
		}
		if (!handled) {
			return this._handleMouseEvent(event, 'mouseUp', 'handleMouseUp');
		}
	},
	mouseMove: function(event) {
		return this._handleMouseEvent(event, 'mouseMove', 'handleMouseMove');
	}
});
