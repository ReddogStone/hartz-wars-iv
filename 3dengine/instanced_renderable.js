'use strict';

function copyArray(source, sourceOffset, addToSource, dest, destOffset, count) {
	for (var i = 0; i < count; ++i) {
		dest[i + destOffset] = source[i + sourceOffset] + addToSource;
	}
}

function InstancedRenderable(engine, instanceMesh, instanceDataDesc) {
	this._vertices = [];
	this._indices = [];
	this._instanceData = [];
	this._instanceDataDesc = instanceDataDesc;
	this._instanceCount = 0;
	
	this._instanceMesh = instanceMesh;
	this._instanceVertexCount = 0;
	this._instanceDataLength = 0;
	this._calcMeshData();
	this._createBuffers(engine);
}
InstancedRenderable.extends(Object, {
	_calcMeshData: function() {
		var instanceMesh = this._instanceMesh;
		var description = instanceMesh.description;
		var componentCount = 0;
		for (var name in description) {
			var attributeDesc = description[name];
			attributeDesc.offset = componentCount * 4;
			componentCount += attributeDesc.components;
		}
		for (var name in description) {
			description[name].stride = componentCount * 4;
		}
		this._instanceVertexCount = instanceMesh.vertices.length / componentCount;
		this._instanceIndexCount = instanceMesh.indices.length;
		
		var instanceDataDesc = this._instanceDataDesc;
		var instanceDataLength = 0;
		for (var name in instanceDataDesc) {
			var attributeDesc = instanceDataDesc[name];
			attributeDesc.offset = instanceDataLength * 4;
			instanceDataLength += attributeDesc.components;
		}
		for (var name in instanceDataDesc) {
			instanceDataDesc[name].stride = instanceDataLength * 4;
		}
		this._instanceDataLength = instanceDataLength;
	},
	_createBuffers: function(engine) {
		this._vb = engine.createVertexBufferWithSize(2 << 18);
		this._ib = engine.createIndexBufferWithSize(2 << 18);
		this._instanceDataBuffer = engine.createVertexBufferWithSize(2 << 18, true);

		this._vertices._dirty = false;
		this._indices._dirty = false;
		this._instanceData._dirty = false;
	},
	get instanceDataLength() {
		return this._instanceDataLength;
	},
	getInstanceCount: function() {
		return this._instanceCount;
	},
	setInstanceCount: function(value) {
		if (this._instanceCount != value) {
			var instanceMesh = this._instanceMesh;
			var instanceVertices = instanceMesh.vertices;
			var instanceIndices = instanceMesh.indices;
			var vLength = instanceVertices.length;
			var iLength = instanceIndices.length;
			var instanceVertexCount = this._instanceVertexCount;
			
			this._vertices.length = value * vLength;
			this._indices.length = value * iLength;
			for (var i = 0; i < value; ++i) {
				copyArray(instanceVertices, 0, 0, this._vertices, i * vLength, vLength);
				copyArray(instanceIndices, 0, i * instanceVertexCount, this._indices, i * iLength, iLength);
			}

			this._vertices._dirty = true;
			this._indices._dirty = true;
			
			this._instanceCount = value;
		}
	},
	setInstanceData: function(data) {
		var instanceDataLength = this._instanceDataLength;
		var l = data.length;
		var instanceVertexCount = this._instanceVertexCount;
		var instanceData = this._instanceData;
		var instanceCount = this._instanceCount;
		
		instanceData.length = l * instanceVertexCount;
		for (var i = 0; i < instanceCount; ++i) {
			for (var j = 0; j < instanceVertexCount; ++j) {
				copyArray(data, i * instanceDataLength, 0, instanceData, (i * instanceVertexCount + j) * instanceDataLength, instanceDataLength);
			}
		}
		
		instanceData._dirty = true;
	},
	addSingleInstance: function(data) {
		var instanceDataLength = this._instanceDataLength;
		var instanceVertexCount = this._instanceVertexCount;
		var instanceData = this._instanceData;
		var offset = instanceData.length;
		
		instanceData.length += instanceDataLength * instanceVertexCount;
		for (var i = 0; i < instanceVertexCount; ++i) {
			copyArray(data, 0, 0, instanceData, offset + i * instanceDataLength, instanceDataLength);
		}
		
		instanceData._dirty = true;
		this.setInstanceCount(this._instanceCount + 1);
	},
	getSingleInstance: function(index) {
		var instanceDataLength = this._instanceDataLength;
		var instanceVertexCount = this._instanceVertexCount;
		var instanceData = this._instanceData;
		
		var result = new Array(instanceDataLength);
		copyArray(instanceData, index * instanceDataLength * instanceVertexCount, 0, result, 0, instanceDataLength);
		return result;
	},
	setSingleInstance: function(index, data) {
		var instanceDataLength = this._instanceDataLength;
		var instanceVertexCount = this._instanceVertexCount;
		var instanceData = this._instanceData;
		var offset = index * instanceDataLength * instanceVertexCount;
		
		for (var i = 0; i < instanceVertexCount; ++i) {
			copyArray(data, 0, 0, instanceData, offset + i * instanceDataLength, instanceDataLength);
		}
		
		instanceData._dirty = true;
	},
	
	// renderable interface
	prepare: function(engine) {
		if (this._instanceData._dirty) {
			engine.updateVertexBufferData(this._instanceDataBuffer, this._instanceData);
		}
		if (this._vertices._dirty) {
			engine.updateVertexBufferData(this._vb, this._vertices);
		}
		if (this._indices._dirty) {
			engine.updateIndexBufferData(this._ib, this._indices);
		}
		
		this._vertices._dirty = false;
		this._indices._dirty = false;
		this._instanceData._dirty = false;
	},
	setParams: function(globalParams) {
	},
	render: function(engine) {
		engine.setBuffers(this._vb, this._ib, this._instanceMesh.description);
		engine.setVertexBuffer(this._instanceDataBuffer, this._instanceDataDesc);
		engine.renderTriangles(this._indices.length, 0);
	}
});

function PointSpriteBatchRenderable(engine, textureId, atlasSize) {
	var cols = atlasSize.columns;
	var rows = atlasSize.rows;
	var mesh = {
		"vertices": [
			//x	y z tu tv
			-0.5,  0.5, 0.0, 0.0       , 0.0,
			 0.5,  0.5, 0.0, 1.0 / cols, 0.0,
			-0.5, -0.5, 0.0, 0.0       , 1.0 / rows,
			 0.5, -0.5, 0.0, 1.0 / cols, 1.0 / rows],
		"indices": [0, 1, 2, 2, 1, 3],
		"description": {
			"aPosition": { "components": 3, "type": "FLOAT", "normalized": false},
			"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false}
		}
	}
	var instanceDataDesc = {
		"aWorldPos": { "components": 3, "type": "FLOAT", "normalized": false },
		"aSize": { "components": 2, "type": "FLOAT", "normalized": false },
		"aColor": { "components": 4, "type": "FLOAT", "normalized": false },
		"aAtlasIndex": { "components": 1, "type": "FLOAT", "normalized": false }
	};
	
	this._instancedRenderable = new InstancedRenderable(engine, mesh, instanceDataDesc);
	this.material = new PointSpriteInstMaterial(engine, engine.getTexture(textureId));
	this._atlasSize = AtlasDesc.clone(atlasSize);

	this._instanceData = [];
	this._instanceData._dirty = false;
	this._instanceIndices = [];
}
PointSpriteBatchRenderable.extends(Object, {
	_setSpriteComponent: function(id, setter) {
		var instancedRenderable = this._instancedRenderable;
		var data = instancedRenderable.getSingleInstance(id);
		setter(data);
		instancedRenderable.setSingleInstance(id, data);		
	},
	addSprite: function(pos, size, color, atlasIndex) {
		var instancedRenderable = this._instancedRenderable;
		var data = pos.toArray().concat(size.toArray()).concat(color.toArray4()).concat([atlasIndex]);
		instancedRenderable.addSingleInstance(data);
		return instancedRenderable.getInstanceCount() - 1;
	},
	getSpriteData: function(id) {
		var data = this._instancedRenderable.getSingleInstance(id);
		return {
			pos: new Vecmath.Vector3(data[0], data[1], data[2]),
			size: new Vecmath.Vector2(data[3], data[4]),
			color: new Color(data[5], data[6], data[7], data[8]),
			atlasIndex: data[9]
		};
	},
	setSpriteData: function(id, pos, size, color, atlasIndex) {
		var data = pos.toArray().concat(size.toArray()).concat(color.toArray4()).concat([atlasIndex]);
		this._instancedRenderable.setSingleInstance(id, data);
	},
	setSpritePos: function(id, value) {
		this._setSpriteComponent(id, function(data) { data[0] = value.x; data[1] = value.y; data[2] = value.z; });
	},
	setSpriteSize: function(id, value) {
		this._setSpriteComponent(id, function(data) { data[3] = value.x; data[4] = value.y; });
	},
	setSpriteColor: function(id, value) {
		this._setSpriteComponent(id, function(data) { 
			data[5] = value.red; data[6] = value.green; data[7] = value.blue; data[8] = value.alpha;
		});
	},
	setSpriteAtlasIndex: function(id, value) {
		this._setSpriteComponent(id, function(data) { data[9] = value; });
	},

	// renderable interface
	prepare: function(engine) {
		this._instancedRenderable.prepare(engine);
	},
	setParams: function(globalParams) {
		globalParams.uTextureAtlasSize = this._atlasSize.toArray();
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		this._instancedRenderable.render(engine);
	}
});

function LineBatchRenderable(engine, textureId, patternCount) {
	var mesh = {
		"vertices": [
			//x	 y	  tu   tv
			0.0, -1.0, 0.0, 0.0,
			1.0, -1.0, 1.0, 0.0,
			0.0,  1.0, 0.0, 1.0 / patternCount,
			1.0,  1.0, 1.0, 1.0 / patternCount],
		"indices": [0, 1, 2, 2, 1, 3],
		"description": {
			"aPosition": { "components": 2, "type": "FLOAT", "normalized": false},
			"aTexCoord": { "components": 2, "type": "FLOAT", "normalized": false}
		}
	}
	var instanceDataDesc = {
		"aEndPoint1": { "components": 3, "type": "FLOAT", "normalized": false },
		"aEndPoint2": { "components": 3, "type": "FLOAT", "normalized": false },
		"aColor": { "components": 4, "type": "FLOAT", "normalized": false },
		"aWidth": { "components": 1, "type": "FLOAT", "normalized": false },
		"aPatternIndex": { "components": 1, "type": "FLOAT", "normalized": false }
	};

	this._patternCount = patternCount;
	this._instancedRenderable = new InstancedRenderable(engine, mesh, instanceDataDesc);
	this.material = new LineInstMaterial(engine, engine.getTexture(textureId));

	this._instanceData = [];
	this._instanceData._dirty = false;
	this._instanceIndices = [];
}
LineBatchRenderable.extends(Object, {
	_setComponent: function(id, setter) {
		var instancedRenderable = this._instancedRenderable;
		var data = instancedRenderable.getSingleInstance(id);
		setter(data);
		instancedRenderable.setSingleInstance(id, data);		
	},
	addLine: function(endPoint1, endPoint2, color, width, patternIndex) {
		var instancedRenderable = this._instancedRenderable;
		var data = endPoint1.toArray().
			concat(endPoint2.toArray()).
			concat(color.toArray4()).
			concat([width]).
			concat([patternIndex]);
		instancedRenderable.addSingleInstance(data);
		return instancedRenderable.getInstanceCount() - 1;
	},
	getLineData: function(id) {
		var data = this._instancedRenderable.getSingleInstance(id);
		return {
			endPoint1: new Vecmath.Vector3(data[0], data[1], data[2]),
			endPoint2: new Vecmath.Vector3(data[3], data[4], data[5]),
			color: new Color(data[6], data[7], data[8], data[9]),
			width: data[10],
			patternIndex: data[11]
		};
	},
	setLineData: function(id, endPoint1, endPoint2, color, width, patternIndex) {
		var data = endPoint1.toArray().
			concat(endPoint2.toArray()).
			concat(color.toArray4()).
			concat([width]).
			concat([patternIndex]);
		this._instancedRenderable.setSingleInstance(id, data);
	},
	setEndPoint1: function(id, value) {
		this._setComponent(id, function(data) { data[0] = value.x; data[1] = value.y; data[2] = value.z; });
	},
	setEndPoint2: function(id, value) {
		this._setComponent(id, function(data) { data[3] = value.x; data[4] = value.y; data[5] = value.z; });
	},
	setColor: function(id, value) {
		this._setComponent(id, function(data) { 
			data[6] = value.red; data[7] = value.green; data[8] = value.blue; data[9] = value.alpha;
		});
	},
	setWidth: function(id, value) {
		this._setComponent(id, function(data) { data[10] = value; });
	},
	setPatternIndex: function(id, value) {
		this._setComponent(id, function(data) { data[11] = value; });
	},

	// renderable interface
	prepare: function(engine) {
		this._instancedRenderable.prepare(engine);
	},
	setParams: function(globalParams) {
		globalParams.uPatternCount = this._patternCount;
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		this._instancedRenderable.render(engine);
	}
});
