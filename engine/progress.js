'use strict';

function Progress(size, texture, fillRect, frameRect) {
	Node.apply(this);

	this._progress = 1;
	this._fillSpriteLeft = new Sprite();
	this._fillSpriteMiddle = new Sprite();
	this._fillSpriteRight = new Sprite();
	this._frameSprite = new Sprite();
	this._fillRect = new Rect();

	if (texture) { this.texture = texture; }
	if (size) { this.size = size; }
	if (fillRect) { this.fillRect = fillRect; }
	if (frameRect) { this.frameRect = frameRect; }
	
	this.addChild(this._fillSpriteLeft);
	this.addChild(this._fillSpriteMiddle);
	this.addChild(this._fillSpriteRight);
	this.addChild(this._frameSprite);
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
	get texture() {
		return this._frameSprite.texture;
	},
	set texture(value) {
		this._frameSprite.texture = value;
		this._fillSpriteLeft.texture = value;
		this._fillSpriteMiddle.texture = value;
		this._fillSpriteRight.texture = value;
	},
	get size() {
		return this._frameSprite.size;
	},
	set size(value) {
		this._frameSprite.size = value;
	},
	get frameRect() {
		return this._frameSprite.sourceRect;
	},
	set frameRect(value) {
		this._frameSprite.sourceRect = value;
	},
	get fillRect() {
		return this._fillRect;
	},
	set fillRect(value) {
		this._fillRect = value;
		var fillSpriteLeft = this._fillSpriteLeft;
		var fillSpriteMiddle = this._fillSpriteMiddle;
		var fillSpriteRight = this._fillSpriteRight;
		var size = this.size;
		
		fillSpriteLeft.size = new Size(Math.floor(value.sx / value.sy * 0.5 * size.y - 0.5) + 1, size.y);
		fillSpriteMiddle.size = new Size(Math.floor(size.x - value.sx / value.sy * size.y - 0.5) + 1, size.y);
		fillSpriteRight.size = new Size(Math.floor(value.sx / value.sy * 0.5 * size.y - 0.5) + 1, size.y);

		fillSpriteLeft.sourceRect = new Rect(value.x, value.y, value.sx * 0.5, value.sy);
		fillSpriteMiddle.sourceRect = new Rect(value.x + value.sx * 0.5 - 1, value.y, 1, value.sy);
		fillSpriteRight.sourceRect = new Rect(value.x + value.sx * 0.5, value.y, value.sx * 0.5, value.sy);
	},
	set progress(value) {
		this._progress = value;
		this._fillSpriteMiddle.scale.x = value;
		this._fillSpriteMiddle.pos.x = Math.floor(this._fillSpriteLeft.size.x);
		this._fillSpriteRight.pos.x = Math.floor(this._fillSpriteLeft.size.x + this._fillSpriteMiddle.size.x * this._fillSpriteMiddle.scale.x);
	}
});
