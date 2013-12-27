'use strict';

function SimpleMaterial(engine, texturePath) {
	if (texturePath) {
		this._texture = engine.createTexture(texturePath);
	}
	
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/simple_vs.shader'), 
		FileUtils.loadFile('data/shaders/simple_fs.shader'));
}
SimpleMaterial.extends(Object, {
	set: function(engine, globalParams) {
		globalParams.uTexture = {texture: this._texture, sampler: 0};
		engine.setProgram(this._program, globalParams);
	}
});
