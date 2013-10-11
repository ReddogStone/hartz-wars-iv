'use strict';

var ButtonState = {
	ACTIVE: {name: 'ACTIVE', index: 0},
	PRESSED: {name: 'PRESSED', index: 1},
	HOVERED: {name: 'HOVERED', index: 2},
	INACTIVE: {name: 'INACTIVE', index: 3},
};

function GenericButtonEffect(callback) {
	this.apply = callback;
}

function JumpingLabel(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this._applied = false;
}
JumpingLabel.prototype.apply = function(button) {
	var state = button.getState();
	var offset = button.labelOffset;
	if (state == ButtonState.PRESSED) {
		offset.x += this.offsetX;
		offset.y += this.offsetY;
		this._applied = true;
	} else if (this._applied) {
		offset.x -= this.offsetX;
		offset.y -= this.offsetY;
		this._applied = false;
	}
};

function ChangingColor(active, pressed, hovered, inactive) {
	this._colors = [Color.clone(active), Color.clone(pressed), Color.clone(hovered), Color.clone(inactive)];
}
ChangingColor.prototype.apply = function(button) {
	var state = button.getState();
	var color = this._colors[state.index];
	if (!color) {
		color = this._colors[ButtonState.ACTIVE.index];
	}
	if (color) {
		button.label.color = color;
		button.sprite.color = color;
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
		button.sprite.sourceRect = rect;
	}
};
ChangingFrames.prototype.setRect = function(state, value) {
	this._rects[state.index] = value;
};

function Button(size, texture, effects) {
	Node.apply(this);
	
	var sprite = new Sprite(texture, size);
	
	var label = new Label();
	label.anchor = new Point(0.5, 0.5);
	if (size) {
		label.pos = new Pos(0.5 * size.x, 0.5 * size.y);
	}
	
	var labelOffsetter = new Node();
	labelOffsetter.addChild(label);
	
	this._enabled = true;
	this._state = ButtonState.ACTIVE;
	
	this._size = Size.clone(size);
	
	this.addChild(sprite);
	this.addChild(labelOffsetter);
	
	this.label = label;
	this.sprite = sprite;
	this._labelOffsetter = labelOffsetter;
	
	this._effects = [];
	if (effects) {
		effects.forEach(function(element, index, array) {
			this.addEffect(element);
		}, this);
	}/* else {
		this.addEffect(new ChangingColor('#000000', '#0000FF', '#FF0000', '#909090'));
	}*/
	this._z;
	
	this.onPressed = null;
	this.onClicked = null;
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
	init: function() {
		this._setState(ButtonState.ACTIVE);
		this.parent.init.call(this);
	},
	getState: function() {
		if (this._enabled) {
			return this._state;
		} else {
			return ButtonState.INACTIVE;
		}
	},
	get z() {
		return this._z;
	},
	set z(value) {
		this._z = value;
		if (this.sprite) { this.sprite.z = value; }
		if (this.label) { this.label.z = value; }
	},
	get size() {
		return this._size;
	},
	set size(value) {
		this._size = value;
		if (this.sprite) { this.sprite.size = value; }
		if (this.label) { this.label.pos = new Pos(0.5 * value.x, 0.5 * value.y); }
	},
	get labelOffset() {
		return this._labelOffsetter.pos;
	},
	set labelOffset(value) {
		var pos = this._labelOffsetter.pos;
		pos.x = value.x;
		pos.y = value.y;
	},
	get enabled() {
		return this._enabled;
	},
	set enabled(value) {
		this._enabled = value;
	},
	get texture() {
		return this.sprite.texture;
	},
	set texture(value) {
		this.sprite.texture = value;
	},
	addEffect: function(effect) {
		this._effects.push(effect);
		this._adjust();
	},
	addEffects: function(effects) {
		effects.forEach(function(element, index, array) {
			this._effects.push(element);
		}, this);
		this._adjust();
	},
	handleMouseDown: function(event) {
		if (this._enabled && this.getLocalRect().containsPoint(event)) {
			this._setState(ButtonState.PRESSED);
			if (this.onPressed) {
				this.onPressed();
			}
			return true;
		}
	},
	handleMouseUp: function(event) {
		if (this._enabled) {
			if (this.getLocalRect().containsPoint(event)) {
				this._setState(ButtonState.HOVERED);
				if (this.onClicked) {
					this.onClicked();
				}
				return true;
			} else {
				this._setState(ButtonState.ACTIVE);
			}
		}
	},
	handleMouseMove: function(event) {
		if (this._enabled) {
			if (this.getLocalRect().containsPoint(event)) {
				if (this._state == ButtonState.ACTIVE) {
					if (event.down) {
						this._setState(ButtonState.PRESSED);
					} else {
						this._setState(ButtonState.HOVERED);
					}
				}
			} else {
				this._setState(ButtonState.ACTIVE);
			}
		}
	},
});
