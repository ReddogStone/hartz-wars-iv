'use strict';

function SimpleMaterial(engine, texturePath, color, luminosity) {
	if (texturePath) {
		this._texture = engine.createTexture(texturePath);
	}
	
	this._color = Color.clone(color) || Color.white;
	this._color.alpha = luminosity || 0;
	
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/simple_vs.shader'), 
		FileUtils.loadFile('data/shaders/simple_fs.shader'));
	
	this.blendMode = BlendMode.ALPHA;
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
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray4();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});
