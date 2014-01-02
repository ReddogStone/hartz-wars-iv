'use strict';

function SimpleMaterial(engine, texture, color, luminosity) {
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._color.alpha = luminosity || 0;
	this._program = engine.getProgram('simple');
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
SimpleMaterial.extends(Object, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get luminosity() {
		return this._color.alpha;
	},
	set luminosity(value) {
		this._color.alpha = value;
	},
	get texture() {
		return this._texture;
	},
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});

function ScreenSpaceMaterial(engine, texture, color) {
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._program = engine.getProgram('screenspace');
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
ScreenSpaceMaterial.extends(Object, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});

function TextMaterial(engine, texture, color) {
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._program = engine.getProgram('text');
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
TextMaterial.extends(Object, {
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});

function PointSpriteMaterial(engine, texture, size, color) {
	this._size = size || new Vecmath.Vector2(64, 64);
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._program = engine.getProgram('pointsprite');
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
PointSpriteMaterial.extends(Object, {
	get size() {
		return this._size;
	},
	set size(value) {
		this._size = value.clone();
	},
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		globalParams.uSize = this._size.toArray();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});

function LineMaterial(engine, patternTexture, width, color) {
	this._width = width ? width : 1.0;
	this._texture = patternTexture;
	this._color = Color.clone(color) || Color.white;
	this._program = engine.getProgram('line');
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
LineMaterial.extends(Object, {
	get width() {
		return this._width;
	},
	set width(value) {
		this._width = value;
	},
	get color() {
		return this._color;
	},
	set color(value) {
		this._color = Color.clone(value);
	},
	get texture() {
		return this._texture;
	},
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		globalParams.uWidth = [this._width];
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});

