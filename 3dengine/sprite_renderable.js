'use strict';

function SpriteRenderable(engine, texturePath) {
	var meshData = [
		{
			"vertices": [
				//x	   y	z	 nx   ny   nz   tu   tv
				-0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0,
				 0.5,  0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0,
				-0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0,
				 0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 0 },
				"aNormal": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 3 * 4 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 8 * 4, "offset": 6 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this.material = new SimpleMaterial(engine, engine.createTextureFromFile(texturePath));
}
SpriteRenderable.extends(Object, {
	render: function(engine, globalParams) {
		this.material.set(engine, globalParams);
		this._mesh.render(engine);
	}
});

function PointSpriteRenderable(engine, texturePath) {
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
	this.material = new PointSpriteMaterial(engine, engine.createTextureFromFile(texturePath));
}
PointSpriteRenderable.extends(Object, {
	render: function(engine, globalParams) {
		this.material.set(engine, globalParams);
		this._mesh.render(engine);
	}
});

function LineRenderable(engine, texturePath, endPoint1, endPoint2) {
	this._endPoint1 = endPoint1;
	this._endPoint2 = endPoint2;
	var meshData = [
		{
			"vertices": [
				//x	 y	  tu   tv
				0.0, -1.0, 0.0, 0.0,
				1.0, -1.0, 1.0, 0.0,
				0.0,  1.0, 0.0, 1.0,
				1.0,  1.0, 1.0, 1.0],
			"indices": [0, 1, 2, 2, 1, 3],
			"description": {
				"aPosition": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 0 },
				"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 4 * 4, "offset": 2 * 4 }
			}
		}
	];
	
	this._mesh = Mesh.loadFromJson(engine, meshData);
	this.material = new LineMaterial(engine, engine.createTextureFromFile(texturePath));
}
LineRenderable.extends(Object, {
	get endPoint1() {
		return this._endPoint1;
	},
	set endPoint1(value) {
		this._endPoint1 = value;
	},
	get endPoint2() {
		return this._endPoint2;
	},
	set endPoint2(value) {
		this._endPoint2 = value;
	},
	render: function(engine, globalParams) {
		globalParams.uEndPoint1 = this._endPoint1.pos.toArray();
		globalParams.uEndPoint2 = this._endPoint2.pos.toArray();
		this.material.set(engine, globalParams);
		this._mesh.render(engine);
	}
});
