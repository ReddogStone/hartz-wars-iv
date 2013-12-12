'use strict';

function Progress(size, texture, fillRect, frameRect) {
	Node.apply(this);

	this._progress = 1;
	this._fillSpriteLeft = new Sprite();
	this._fillSpriteMiddle = new Sprite();
	this._fillSpriteRight = new Sprite();
	this._frameSprite = new Sprite();
	this._fillRect = new Rect();

	if (size) { this.size = size; }
	if (fillRect) { this.fillRect = fillRect; }
	if (frameRect) { this.frameRect = frameRect; }
	
	this.addChild(this._fillSpriteLeft);
	this.addChild(this._fillSpriteMiddle);
	this.addChild(this._fillSpriteRight);
	this.addChild(this._frameSprite);

	this.texture = texture;
}
Progress.extends(Node, {
	get z() {
		return this._z;
	},
	set z(value) {
		this._z = value;
		if (this._fillSpriteLeft) { this._fillSpriteLeft.z = value; }
		if (this._fillSpriteMiddle) { this._fillSpriteMiddle.z = value; }
		if (this._fillSpriteRight) { this._fillSpriteRight.z = value; }
		if (this._frameSprite) { this._frameSprite.z = value + 1; }
	},
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
	},
	deserializeSelf: function(template) {
		Node.prototype.deserializeSelf.call(this, template);
		
		if (template.texture) { this.texture = Texture.clone(Engine.textureManager.get(template.texture)); }
		if (template.frameRect) { this.frameRect = Rect.clone(template.frameRect); }
		if (template.fillRect) { this.fillRect = Rect.clone(template.fillRect); }
		if (template.frameColor) { this.frameColor = Color.clone(template.frameColor); }
		if (template.fillColor) { this.fillColor = Color.clone(template.fillColor); }
		if (template.progress) { this.progress = template.progress; }
	}
});
