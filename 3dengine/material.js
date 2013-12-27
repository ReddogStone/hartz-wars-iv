'use strict';

function SimpleMaterial(engine, texturePath, color) {
	if (texturePath) {
		this._texture = engine.createTexture(texturePath);
	}
	
	this._color = color || Color.white;
	
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
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		globalParams.uColor = this._color.toArray3();
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});
