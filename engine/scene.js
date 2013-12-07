'use strict';

function Scene() {
	Node.apply(this);
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	
	this.pressed = null;
	this.hovered = [];
	this._renderList = [];
	this._childList = [];
	this._mouseHandlers = [];
}
Scene.extends(Node, {
	_handleMouseEvent: function(event, methodName, handleMethodName) {
		var childList = this._childList;

		for (var i = childList.length - 1; i >= 0; --i) {
			var mouseHandler = childList[i];
			if ((methodName in mouseHandler) || (handleMethodName in mouseHandler)) {
				var inverseTransform = mouseHandler.globalTransform.inverse();
				var childEvent = inverseTransform.apply(event);
				childEvent.down = event.down;

				if (mouseHandler.hoverable && !mouseHandler.hovered && mouseHandler.getLocalRect().containsPoint(childEvent)) {
					this.hovered.push(mouseHandler);
					mouseHandler.hovered = true;
					if (mouseHandler.onEnter) {
						mouseHandler.onEnter(Pos.clone(childEvent));
					}
				}
				
				if (mouseHandler == this.pressed) {
					childEvent.pressed = true;
				}
			
				if ((methodName in mouseHandler) && mouseHandler[methodName](childEvent)) {
					return true;
				}
				if ((handleMethodName in mouseHandler) && mouseHandler[handleMethodName](childEvent)) {
					if (methodName == 'mouseDown') {
						this.pressed = mouseHandler;
					}
					return true;
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
			if (pressed.handleMouseUp) {
				var inverseTransform = pressed.globalTransform.inverse();
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
			var inverseTransform = element.globalTransform.inverse();
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
	},
	getRenderList: function() {
		return this._renderList;
	},
	updateRenderList: function() {
		if (!this.visible) {
			return;
		}
	
		var renderList = this._renderList;
		var childList = this._childList;
		renderList.clear();
		childList.clear();
		
		var stack = [];
		this.children.forEach(function(child) {
			child.globalTransform = child.getLocalTransform();
			stack.push(child);
		});
		
		var result = [];
		while (stack.length > 0) {
			var node = stack.shift();
			if (node.visible) {
				var transform = node.globalTransform;
				node.children.forEach(function(child) {
					child.globalTransform = transform.combine(child.getLocalTransform());
					stack.push(child);
				});
				
				childList.push(node);
				if (node.render) {
					renderList.push(node);
				}
			}
		}
		
		childList.sort(function(a, b) {return (a.z - b.z);} );
		renderList.sort(function(a, b) {return (a.z - b.z);} );
	}
});
