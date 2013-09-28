'use strict';

function Progress(size, texture, fillRect, frameRect) {
	Node.apply(this);

	this.size = cloneSize(size);
	var fillSpriteLeft = new Sprite(new Size(Math.floor(fillRect.sx / fillRect.sy * 0.5 * size.y - 0.5) + 1, size.y),
		texture, new Rect(fillRect.x, fillRect.y, fillRect.sx * 0.5, fillRect.sy));
	var fillSpriteMiddle = new Sprite(new Size(Math.floor(size.x - fillRect.sx / fillRect.sy * size.y - 0.5) + 1, size.y),
		texture, new Rect(fillRect.x + fillRect.sx * 0.5 - 1, fillRect.y, 1, fillRect.sy));
	var fillSpriteRight = new Sprite(new Size(Math.floor(fillRect.sx / fillRect.sy * 0.5 * size.y - 0.5) + 1, size.y),
		texture, new Rect(fillRect.x + fillRect.sx * 0.5, fillRect.y, fillRect.sx * 0.5, fillRect.sy));
	var frameSprite = new Sprite(size, texture, frameRect);
	
	this._progress = 1;
	this._fillSpriteLeft = fillSpriteLeft;
	this._fillSpriteMiddle = fillSpriteMiddle;
	this._fillSpriteRight = fillSpriteRight;
	this._frameSprite = frameSprite;
	
//	fillSpriteLeft.visible = false;
//	fillSpriteRight.visible = false;
	
	this.addChild(fillSpriteLeft);
	this.addChild(fillSpriteMiddle);
	this.addChild(fillSpriteRight);
	this.addChild(frameSprite);
}
Progress.extends(Node, {
	getFrameColor: function() {
		return this._frameSprite.getColor();
	},
	setFrameColor: function(value) {
		this._frameSprite.setColor(value);
	},
	getFillColor: function() {
		return this._frameSpriteLeft.getColor();
	},
	setFillColor: function(value) {
		this._fillSpriteLeft.setColor(value);
		this._fillSpriteMiddle.setColor(value);
		this._fillSpriteRight.setColor(value);
	},
	getProgress: function() {
		return this._progress;
	},
	setProgress: function(value) {
		this._progress = value;
		this._fillSpriteMiddle.scale.x = value;
		this._fillSpriteMiddle.pos.x = Math.floor(this._fillSpriteLeft.size.x);
		this._fillSpriteRight.pos.x = Math.floor(this._fillSpriteLeft.size.x + this._fillSpriteMiddle.size.x * this._fillSpriteMiddle.scale.x);
	}
});