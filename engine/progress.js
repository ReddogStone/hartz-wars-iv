'use strict';

function Progress(size, texture, fillRect, frameRect) {
	Node.apply(this);

	this.size = cloneSize(size);
	var fillSpriteLeft = new Sprite(texture, 
		new Size(Math.floor(fillRect.sx / fillRect.sy * 0.5 * size.y - 0.5) + 1, size.y),
		new Rect(fillRect.x, fillRect.y, fillRect.sx * 0.5, fillRect.sy));
	var fillSpriteMiddle = new Sprite(texture, 
		new Size(Math.floor(size.x - fillRect.sx / fillRect.sy * size.y - 0.5) + 1, size.y),
		new Rect(fillRect.x + fillRect.sx * 0.5 - 1, fillRect.y, 1, fillRect.sy));
	var fillSpriteRight = new Sprite(texture, 
		new Size(Math.floor(fillRect.sx / fillRect.sy * 0.5 * size.y - 0.5) + 1, size.y),
		new Rect(fillRect.x + fillRect.sx * 0.5, fillRect.y, fillRect.sx * 0.5, fillRect.sy));
	var frameSprite = new Sprite(texture, size, frameRect);
	
	this._progress = 1;
	this._fillSpriteLeft = fillSpriteLeft;
	this._fillSpriteMiddle = fillSpriteMiddle;
	this._fillSpriteRight = fillSpriteRight;
	this._frameSprite = frameSprite;
	
	this.addChild(fillSpriteLeft);
	this.addChild(fillSpriteMiddle);
	this.addChild(fillSpriteRight);
	this.addChild(frameSprite);
}
Progress.extends(Node, {
	get frameColor() {
		return this._frameSprite.color;
	},
	set frameColor(value) {
		this._frameSprite.color = value;
	},
	get fillColor() {
		return this._frameSpriteLeft.getColor();
	},
	set fillColor(value) {
		this._fillSpriteLeft.color = value;
		this._fillSpriteMiddle.color = value;
		this._fillSpriteRight.color = value;
	},
	get progress() {
		return this._progress;
	},
	set progress(value) {
		this._progress = value;
		this._fillSpriteMiddle.scale.x = value;
		this._fillSpriteMiddle.pos.x = Math.floor(this._fillSpriteLeft.size.x);
		this._fillSpriteRight.pos.x = Math.floor(this._fillSpriteLeft.size.x + this._fillSpriteMiddle.size.x * this._fillSpriteMiddle.scale.x);
	}
});
