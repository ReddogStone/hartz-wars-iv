'use strict';

function SimpleMaterial(engine, texture, color, luminosity) {
	this._texture = texture;
	this._color = Color.clone(color) || Color.white;
	this._color.alpha = luminosity || 0;
	
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/simple_vs.shader'), 
		FileUtils.loadFile('data/shaders/simple_fs.shader'));
	
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
	
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/screenspace_vs.shader'), 
		FileUtils.loadFile('data/shaders/screenspace_fs.shader'));
	
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

