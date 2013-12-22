'use strict';

var ButtonState = {
	ACTIVE: {name: 'ACTIVE', index: 0},
	PRESSED: {name: 'PRESSED', index: 1},
	HOVERED: {name: 'HOVERED', index: 2},
	INACTIVE: {name: 'INACTIVE', index: 3},
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
	}
	this._z;
	
	this.onPressed = null;
	this.onClicked = null;
	
	this.click = new Event();
	this.press = new Event();
	this.enter = new Event();
	this.exit = new Event();
	this.mouseMove = new Event();
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
	get hoverable() {
		return true;
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
	clearEffects: function() {
		this._effects.clear();
	},
	handleMouseDown: function(event) {
		if (this._enabled && this.getLocalRect().containsPoint(event)) {
			this._setState(ButtonState.PRESSED);
			if (this.onPressed) {
				this.onPressed();
			}
			this.press.raise();
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
				this.click.raise();
			} else {
				this._setState(ButtonState.ACTIVE);
			}
		}
	},
	handleMouseMove: function(event) {
		if (this._enabled) {
			if (this.getLocalRect().containsPoint(event)) {
				if (this._state == ButtonState.ACTIVE) {
					if (event.focussed) {
						this._setState(ButtonState.PRESSED);
					} else {
						this._setState(ButtonState.HOVERED);
					}
				}
				if (this.onMouseMove) {
					this.onMouseMove(event);
				}
				this.mouseMove.raise(event);
			} else if ((this._state == ButtonState.PRESSED) || (this._state == ButtonState.HOVERED)) {
				this._setState(ButtonState.ACTIVE);
			}
		}
	},
	deserializeSelf: function(template) {
		Node.prototype.deserializeSelf.call(this, template);
		
		if (template.texture) {
			var texture = Engine.textureManager.get(template.texture);
			if (!texture || !texture.image) {
				throw new Error('Could not get: "' + template.texture + '"');
			}
			this.texture = Texture.clone(texture);
		}
		if (template.effects) { 
			template.effects.forEach(function(element) {
				var effect = createFromTemplate(element);
				this.addEffect(effect);
			}, this);
		}
		if (template.label) {
			var label = template.label;
			if (label.offset) { this.labelOffset = Point.clone(label.offset); }
			this.label.deserialize(template.label);
		}
	}	
});
