'use strict';

var ButtonState = {
	ACTIVE: {name: 'ACTIVE', index: 0},
	PRESSED: {name: 'PRESSED', index: 1},
	HOVERED: {name: 'HOVERED', index: 2},
	INACTIVE: {name: 'INACTIVE', index: 3},
};

function JumpingLabel(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
}
JumpingLabel.prototype.apply = function(button) {
	var state = button.state();
	var offset = button._labelOffset;
	if (state == ButtonState.PRESSED) {
		offset.x = this.offsetX;
		offset.y = this.offsetY;
	} else {
		Vec.setZero(offset);
	}
};

function ChangingColor(active, pressed, hovered, inactive) {
	this._colors = [active, pressed, hovered, inactive];
}
ChangingColor.prototype.apply = function(button) {
	var state = button.state();
	var color = this._colors[state.index];
	if (!color) {
		color = this._colors[ButtonState.ACTIVE.index];
	}
	if (color) {
		button._label.color = color;
	}
};
ChangingColor.prototype.setColor = function(state, value) {
	this._colors[state.index] = value;
};

function ChangingFrames(active, pressed, hovered, inactive) {
	this._rects = [active, pressed, hovered, inactive];
}
ChangingFrames.prototype.apply = function(button) {
	var state = button.state();
	var rect = this._rects[state.index];
	if (!rect) {
		rect = this._rects[ButtonState.ACTIVE.index];
	}
	if (rect) {
		button._sprite.sourceRect = rect;
	}
};
ChangingFrames.prototype.setRect = function(state, value) {
	this._rects[state.index] = value;
};

function Button(context, size, texture) {
	this._sprite = new Sprite(size, texture);
	var label = new Label(context);
	label.align = 'center';
	this._label = label;
	var labelSize = label.size;
	this._labelOffset = new Point();
	
	this._enabled = true;
	this._state = ButtonState.ACTIVE;
	this.effects = [];
	
	this._size = size;
	Object.defineProperty(this, 'size', {get: this._getSize, set: this._setSize});
}

// PRIVATE
Button.prototype._adjust = function() {
	this.effects.forEach(function(element, index, array) {
		element.apply(this);
	}, this);
};
Button.prototype._setState = function(value) {
	this._state = value;
	this._adjust();
};
Button.prototype._rect = function() {
	var stateIndex = this.state().index;
	if (this._rects[stateIndex]) {
		return this._rects[stateIndex];
	} else {
		return this._rects[ButtonState.ACTIVE.index];
	}
};
Button.prototype._color = function() {
	var stateIndex = this.state().index;
	if (this._colors[stateIndex]) {
		return this._colors[stateIndex];
	} else {
		return this._colors[ButtonState.ACTIVE.index];
	}
};
Button.prototype._getSize = function() {
	return this._size;
};
Button.prototype._setSize = function(value) {
	this._size = value;
	this._sprite.size = value;
};
Button.prototype._getRect = function(node) {
	var pos = node.pos;
	var size = this._size;
	return new Rect(pos.x, pos.y, size.x, size.y);
}
// GETTERS
Button.prototype.state = function() {
	if (this._enabled) {
		return this._state;
	} else {
		return ButtonState.INACTIVE;
	}
};
Button.prototype.enabled = function() {
	return this._enabled;
};
Button.prototype.pressed = function() {
	return this._pressed;
};
// SETTERS	
Button.prototype.setEnabled = function(value) {
	this._enabled = value;
	if (!value) {
		this._setState(ButtonState.INACTIVE);
	}
};
Button.prototype.addEffect = function(effect) {
	this.effects.push(effect);
	this._adjust();
};
// METHODS	
Button.prototype.mouseDown = function(node, event) {
	if (this._enabled && this._getRect(node).containsPoint(event)) {
		this._setState(ButtonState.PRESSED);
	}
};
Button.prototype.mouseUp = function(node, event) {
	if (this._enabled) {
		if (this._getRect(node).containsPoint(event)) {
			this._setState(ButtonState.HOVERED);
		} else {
			this._setState(ButtonState.ACTIVE);
		}
	}
};
Button.prototype.mouseMove = function(node, event) {
	if (this._enabled) {
		if (this._getRect(node).containsPoint(event)) {
			if (this._state == ButtonState.ACTIVE) {
				this._setState(ButtonState.HOVERED);
			}
		} else if (this._state == ButtonState.HOVERED) {
			this._setState(ButtonState.ACTIVE);
		}
	}
};
Button.prototype.render = function(node, context) {
	var sprite = this._sprite;
	var label = this._label;
	var size = this._size;
	var labelSize = label.size;
	var labelOff = this._labelOffset;
	var labelPos = Vec.add(Vec.mul(Vec.sub(size, labelSize), 0.5), labelOff);
	sprite.render(node, context);
	
	context.save();
	RenderUtils.transform(context, labelPos);

//	context.fillRect(0, 0, labelSize.x, labelSize.y);
	
	label.render(node, context);
	
	context.restore();
}

function createButtonNode(context, size, texture, effects) {
	var node = new Node();
	
	var button = new Button(context, size, texture);
	if (effects) {
		effects.forEach(function(element, index, array) {
			button.addEffect(element);
		});
	} else {
		button.addEffect(new ChangingColor('#000000', '#0000FF', '#FF0000', '#909090'));
	}
	
	node.renderable = button;
	node.mouseHandler = button;
	node.label = button._label;
	
	node.debug = 'Button';
	
	return node;
}