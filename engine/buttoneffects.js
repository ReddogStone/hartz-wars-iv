'use strict';

function GenericButtonEffect(callback) {
	this.apply = callback;
}

function JumpingLabel(offsetX, offsetY) {
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this._applied = false;
}
JumpingLabel.extends(Object, {
	apply: function(button) {
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
	},
	deserialize: function(template) {
		if (template.offsetX) { this.offsetX = template.offsetX; }
		if (template.offsetY) { this.offsetY = template.offsetY; }
	}
});

function initChangingValueEffect(effect, active, pressed, hovered, inactive, valueClass) {
	if (valueClass) {
		effect._values = [];
		effect._values[ButtonState.ACTIVE.index] = valueClass.clone(active);
		effect._values[ButtonState.PRESSED.index] = valueClass.clone(pressed);
		effect._values[ButtonState.HOVERED.index] = valueClass.clone(hovered);
		effect._values[ButtonState.INACTIVE.index] = valueClass.clone(inactive);
	} else {
		effect._values = [];
		effect._values[ButtonState.ACTIVE.index] = active;
		effect._values[ButtonState.PRESSED.index] = pressed;
		effect._values[ButtonState.HOVERED.index] = hovered;
		effect._values[ButtonState.INACTIVE.index] = inactive;
	}
}
function makeChangingValueEffect(effectConstructor, applyFunc, valueClass) {
	effectConstructor.prototype.apply= function(button) {
		var state = button.getState();
		var value = this._values[state.index];
		if (!value) {
			value = this._values[ButtonState.ACTIVE.index];
		}
		if (value) {
			applyFunc(button, value);
		}			
	}
	if (valueClass) {
		effectConstructor.prototype.deserialize = function(template) {
			this._values = [];
			this._values[ButtonState.ACTIVE.index] = valueClass.clone(template.active);
			this._values[ButtonState.PRESSED.index] = valueClass.clone(template.pressed);
			this._values[ButtonState.HOVERED.index] = valueClass.clone(template.hovered);
			this._values[ButtonState.INACTIVE.index] = valueClass.clone(template.inactive);
		}
	} else {
		effectConstructor.prototype.deserialize = function(template) {
			this._values = [];
			this._values[ButtonState.ACTIVE.index] = template.active;
			this._values[ButtonState.PRESSED.index] = template.pressed;
			this._values[ButtonState.HOVERED.index] = template.hovered;
			this._values[ButtonState.INACTIVE.index] = template.inactive;
		}
	}
}

function ChangingSpriteColor(active, pressed, hovered, inactive) {
	initChangingValueEffect(this, active, pressed, hovered, inactive, Color);
}
makeChangingValueEffect(ChangingSpriteColor, function(button, value) { button.sprite.color = value; }, Color);

function ChangingLabelColor(active, pressed, hovered, inactive) {
	initChangingValueEffect(this, active, pressed, hovered, inactive, Color);
}
makeChangingValueEffect(ChangingLabelColor, function(button, value) { button.label.color = value; }, Color);

function ChangingFrames(active, pressed, hovered, inactive) {
	initChangingValueEffect(this, active, pressed, hovered, inactive, Rect);
}
makeChangingValueEffect(ChangingFrames, function(button, value) { button.sprite.sourceRect = value; }, Rect);

function ChangingSpriteBlendMode(active, pressed, hovered, inactive) {
	initChangingValueEffect(this, active, pressed, hovered, inactive);
}
makeChangingValueEffect(ChangingSpriteBlendMode, function(button, value) { button.sprite.blend = value; });
