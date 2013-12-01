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
	this.hovered = [];
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

					if (child.hoverable && !child.hovered && child.getLocalRect().containsPoint(childEvent)) {
						this.hovered.push(child);
						child.hovered = true;
						if (child.onEnter) {
							child.onEnter(Pos.clone(childEvent));
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
		for (var i = this.hovered.length - 1; i >= 0; --i) {
			var element = this.hovered[i];
			var inverseTransform = element.getTransform().inverse();
			var localPos = inverseTransform.apply(event);
			if (!element.getLocalRect().containsPoint(localPos)) {
				if (element.onExit) {
					element.onExit(localPos);
				}
				element.hovered = false;
				this.hovered.splice(i, 1);
			}
		}
		return this._handleMouseEvent(event, 'mouseMove', 'handleMouseMove');
	}
});
