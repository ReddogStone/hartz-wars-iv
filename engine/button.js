'use strict';

var ButtonState = {
	ACTIVE: {name: 'ACTIVE', index: 0},
	PRESSED: {name: 'PRESSED', index: 1},
	HOVERED: {name: 'HOVERED', index: 2},
	INACTIVE: {name: 'INACTIVE', index: 3},
};

function Button(sprite) {
	this._enabled = true;
	this._state = ButtonState.ACTIVE;
	
	var activeRect = sprite.sourceRect;
	this._rects = new Array(activeRect, null, null, null);
	this._colors = new Array('#FFFFFF', null, null, null);
	
	this._adjust(sprite);
}

// PRIVATE
Button.prototype._adjust = function(node) {
	var state = this.state();
	if (node.sprite) {
		node.sprite.sourceRect = this._rect();
	}
	if (node.label) {
		node.label.color = this._color();
	}
};
Button.prototype._setState = function(value, node) {
	this._state = value;
	this._adjust(node);
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
Button.prototype.setRect = function(state, value) {
	this._rects[state.index] = value;
};
Button.prototype.setLabelColor = function(state, value) {
	this._colors[state.index] = value;
};
Button.prototype.setEnabled = function(value) {
	this._enabled = value;
};
// METHODS	
Button.prototype.mouseDown = function(node, event) {
	if (this._enabled && node.getRect().containsPoint(event)) {
		this._setState(ButtonState.PRESSED, node);
		if (node.label) {
			node.renderable.children[1].pos.x += 2;
			node.renderable.children[1].pos.y += 2;
		}
	}
};
Button.prototype.mouseUp = function(node, event) {
	if (this._enabled) {
		if (node.getRect().containsPoint(event)) {
			this._setState(ButtonState.HOVERED, node);
		} else {
			this._setState(ButtonState.ACTIVE, node);
		}
		if (node.label) {
			node.renderable.children[1].pos.x -= 2;
			node.renderable.children[1].pos.y -= 2;
		}			
	}
};
Button.prototype.mouseMove = function(node, event) {
	if (this._enabled) {
		if (node.getRect().containsPoint(event)) {
			if (this._state == ButtonState.ACTIVE) {
				this._setState(ButtonState.HOVERED, node);
			}
		} else if (this._state == ButtonState.HOVERED) {
			this._setState(ButtonState.ACTIVE, node);
		}
	}
};

function createButtonNode(size, texture) {
	var node = new Node();
	
	var renderList = new RenderList;
	
	var spriteNode = createSpriteNode(size, texture);
	var sprite = spriteNode.renderable;
	renderList.addChild(spriteNode);
	node.sprite = sprite;

	var labelNode = createLabelNode();
	var label = labelNode.renderable;
	labelNode.pos = new Pos(0.5 * size.sx, 0.5 * size.sy + 10);
	label.align = 'center';
	renderList.addChild(labelNode);
	node.label = label;
	
	var button = new Button(sprite);
	node.mouseHandler = button;
	node.size = cloneSize(size);
	node.renderable = renderList;
	
	node.debug = 'Button';	
	
	return node;
}