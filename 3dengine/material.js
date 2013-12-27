'use strict';

function SimpleMaterial(engine, texturePath) {
	if (texturePath) {
		this._texture = engine.createTexture(texturePath);
	}
	
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/simple_vs.shader'), 
		FileUtils.loadFile('data/shaders/simple_fs.shader'));
	
	this.blendMode = BlendMode.PREMUL_ALPHA;
}
SimpleMaterial.extends(Object, {
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		engine.setProgram(this._program, globalParams);
		engine.setBlendMode(this.blendMode);
	}
});
