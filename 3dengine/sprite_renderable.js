'use strict';

function SpriteRenderable(engine) {
	var meshData = [
		{
			"vertices": [
				//x	   y	z	 tu   tv
				-0.5,  0.5, 0.0, 0.0, 0.0,
				 0.5,  0.5, 0.0, 1.0, 0.0,
				-0.5, -0.5, 0.0, 0.0, 1.0,
				 0.5, -0.5, 0.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 0 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 5 * 4, "offset": 3 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this._program = engine.createProgram(
		FileUtils.loadFile('data/shaders/simple_vs.shader'), 
		FileUtils.loadFile('data/shaders/simple_fs.shader'));
}
SpriteRenderable.extends(Object, {
	render: function(engine, globalParams) {
		engine.setMaterial(this._program, globalParams);
		this._mesh.render(engine);
	}
});