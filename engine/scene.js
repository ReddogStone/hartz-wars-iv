'use strict';

function Scene() {
	Node.apply(this);
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.pos = new Pos(0.5 * w, 0.5 * h);
	this.anchor = new Size(0.5, 0.5);
	
	this.pressed = null;
	this.hovered = [];
	this._renderList = [];
	this._childList = [];
	this._mouseHandlers = [];
}
Scene.extends(Node, {
	_handleMouseEvent: function(event, handleMethodName) {
		var childList = this._childList;

		for (var i = childList.length - 1; i >= 0; --i) {
			var mouseHandler = childList[i];
			if (handleMethodName in mouseHandler) {
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
			
				if (mouseHandler[handleMethodName](childEvent)) {
					if (handleMethodName == 'handleMouseDown') {
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
		return this._handleMouseEvent(event, 'handleMouseDown');
	},
	mouseUp: function(event) {
		var pressed = this.pressed;
		if (pressed && pressed.handleMouseUp) {
			var inverseTransform = pressed.globalTransform.inverse();
			if (inverseTransform == null) {
				throw new Error('InverseTransform is null!');
			}
			var childEvent = inverseTransform.apply(event);
			childEvent.down = event.down;			
			pressed.handleMouseUp(childEvent);
			this.pressed = null;
			return true;
		}

		return this._handleMouseEvent(event, 'handleMouseUp');
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
		return this._handleMouseEvent(event, 'handleMouseMove');
	},
	getRenderList: function() {
		return this._renderList;
	},
	updateRenderList: function() {
		var renderList = this._renderList;
		var childList = this._childList;
		renderList.clear();
		childList.clear();
		
		if (!this.visible) {
			return;
		}
	
		this.globalTransform = this.getLocalTransform();
		var stack = [this];
		
		var result = [];
		while (stack.length > 0) {
			var node = stack.shift();
			if (node.visible) {
				var transform = node.globalTransform;
				node.children.forEach(function(child) {
					child.globalTransform = transform.combine(child.getLocalTransform());
					stack.push(child);
				});
				
				if (node != this) {
					childList.push(node);
				}
				if (node.render) {
					renderList.push(node);
				}
			}
		}
		
		childList.sort(function(a, b) {return (a.z - b.z);} );
		renderList.sort(function(a, b) {return (a.z - b.z);} );
	}
});
