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
	var state = button.getState();
	var offset = button.getLabelOffset();
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
	var state = button.getState();
	var color = this._colors[state.index];
	if (!color) {
		color = this._colors[ButtonState.ACTIVE.index];
	}
	if (color) {
		button.label.color = color;
	}
};
ChangingColor.prototype.setColor = function(state, value) {
	this._colors[state.index] = value;
};

function ChangingFrames(active, pressed, hovered, inactive) {
	this._rects = [active, pressed, hovered, inactive];
}
ChangingFrames.prototype.apply = function(button) {
	var state = button.getState();
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

function Button(context, size, texture, effects) {
	Node.apply(this);
	
	var sprite = new Sprite(size, texture);
	
	var label = new Label(context);
	label.anchor = new Point(0.5, 0.5);
	label.pos = new Pos(0.5 * size.x, 0.5 * size.y);
	
	var labelOffsetter = new Node();
	labelOffsetter.addChild(label);
	
	this._enabled = true;
	this._state = ButtonState.ACTIVE;
	
	this.parent.size = size;
	Object.defineProperty(this, 'size', {enumerable: true, get: this.getSize, set: this.setSize});
	
	this.mouseHandler = this;
	this.addChild(sprite);
	this.addChild(labelOffsetter);
	
	this.label = label;
	this._sprite = sprite;
	this._labelOffsetter = labelOffsetter;
	
	this._effects = [];
	if (effects) {
		effects.forEach(function(element, index, array) {
			this.addEffect(element);
		}, this);
	} else {
		this.addEffect(new ChangingColor('#000000', '#0000FF', '#FF0000', '#909090'));
	}
	
	this.onPressed = null;
	this.onReleased = null;
}
Button.extends(Node, {
	_adjust: function() {
		this._effects.forEach(function(element, index, array) {
			element.apply(this);
		}, this);
	},
	_setState: function(value) {
		this._state = value;
		this._adjust();
	},
	getState: function() {
		if (this._enabled) {
			return this._state;
		} else {
			return ButtonState.INACTIVE;
		}
	},
	isEnabled: function() {
		return this._enabled;
	},
	getSize: function() {
		return this.parent.size;
	},
	getLabelOffset: function() {
		return this._labelOffsetter.pos;
	},
	setSize: function(value) {
		this.parent.size = value;
		this._sprite.setSize(value);
	},
	setEnabled: function(value) {
		this._enabled = value;
	},
	setLabelOffset: function(value) {
		this._labelOffsetter.pos = clonePos(value);
	},
	addEffect: function(effect) {
		this._effects.push(effect);
		this._adjust();
	},
	mouseDown: function(event) {
		if (this._enabled && this.getRect().containsPoint(event)) {
			this._setState(ButtonState.PRESSED);
			if (this.onPressed) {
				this.onPressed();
			}
		}
	},
	mouseUp: function(event) {
		if (this._enabled) {
			if (this.getRect().containsPoint(event)) {
				this._setState(ButtonState.HOVERED);
			} else {
				this._setState(ButtonState.ACTIVE);
			}
			if (this.onReleased) {
				this.onReleased();
			}
		}
	},
	mouseMove: function(event) {
		if (this._enabled) {
			if (this.getRect().containsPoint(event)) {
				if (this._state == ButtonState.ACTIVE) {
					this._setState(ButtonState.HOVERED);
				}
			} else if (this._state == ButtonState.HOVERED) {
				this._setState(ButtonState.ACTIVE);
			}
		}
	},
});
