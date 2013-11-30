'use strict';

function Scene() {
	Node.apply(this);
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.anchor = new Point(0.5, 0.5);
	this.pos = new Pos(0.5 * w, 0.5 * h);
	
	this.pressed = null;
	this.hovered = null;
}
Scene.extends(Node, {
	_handleMouseEvent: function(event, methodName, handleMethodName) {
		var children = this.children;
		for (var i = children.length - 1; i >= 0; --i) {
			var child = children[i];
			if (child.visible) {
				if ((methodName in child) || (handleMethodName in child)) {
					var inverseTransform = child.getTransform().inverse();
					var childEvent = inverseTransform.apply(event);
					childEvent.down = event.down;
					
					if (child.getLocalRect().containsPoint(childEvent) && (child != this.hovered)) {
						this.hovered = child;
						if (child.onEnter) {
							child.onEnter();
						}
					}
					
					if (child == this.pressed) {
						childEvent.pressed = true;
					}
				
					if ((methodName in child) && child[methodName](childEvent)) {
						return true;
					}
					if ((handleMethodName in child) && child[handleMethodName](childEvent)) {
						if (methodName == 'mouseDown') {
							this.pressed = child;
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
		var pressed = this.pressed;
		if (pressed) {
			if ('handleMouseUp' in pressed) {
				var inverseTransform = pressed.getTransform().inverse();
				if (inverseTransform == null) {
					throw new Error('InverseTransform is null!');
				}
				var childEvent = inverseTransform.apply(event);
				childEvent.down = event.down;			
				handled = pressed.handleMouseUp(childEvent);
				if (handled) {
					this.pressed = null;
				}
			}
		}
		if (!handled) {
			return this._handleMouseEvent(event, 'mouseUp', 'handleMouseUp');
		}
	},
	mouseMove: function(event) {
		var hovered = this.hovered;
		if (hovered) {
			var inverseTransform = hovered.getTransform().inverse();
			var localPos = inverseTransform.apply(event);
			if (!hovered.getLocalRect().containsPoint(localPos)) {
				if (hovered.onExit) {
					hovered.onExit();
				}
				this.hovered = null;
			}
		}
		return this._handleMouseEvent(event, 'mouseMove', 'handleMouseMove');
	}
});
