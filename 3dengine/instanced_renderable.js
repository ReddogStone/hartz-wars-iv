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
			componentCount += description[name].components;
		}
		this._instanceVertexCount = instanceMesh.vertices.length / componentCount;
		
		var instanceDataDesc = this._instanceDataDesc;
		var instanceDataLength = 0;
		for (var name in instanceDataDesc) {
			instanceDataLength += instanceDataDesc[name].components;
		}
		this._instanceDataLength = instanceDataLength;
	},
	_createBuffers: function(engine) {
		this._vb = engine.createVertexBuffer();
		this._ib = engine.createIndexBuffer();
		this._instanceDataBuffer = engine.createVertexBuffer();

		this._vertices._dirty = false;
		this._indices._dirty = false;
		this._instanceData._dirty = false;
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
	
	// renderable interface
	prepare: function(engine) {
		if (this._instanceData._dirty) {
			this._instanceDataBuffer = engine.createVertexBuffer(this._instanceData);
		}
		if (this._vertices._dirty) {
			this._vb = engine.createVertexBuffer(this._vertices);
//			engine.updateVertexBufferData(this._vb, this._vertices);
		}
		if (this._indices._dirty) {
			this._ib = engine.createIndexBuffer(this._indices);
			//engine.changeIndexBufferData(this._ib, this._indices);
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

function PointSpriteBatchRenderable(engine, textureId) {
	var mesh = {
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
	var instanceDataDesc = {
		"aWorldPos": { "components": 3, "type": "FLOAT", "normalized": false, "stride": 9 * 4, "offset": 0 },
		"aSize": { "components": 2, "type": "FLOAT", "normalized": false, "stride": 9 * 4, "offset": 3 * 4 },
		"aColor": { "components": 4, "type": "FLOAT", "normalized": false, "stride": 9 * 4, "offset": 5 * 4 }
	};
	
	this._instancedRenderable = new InstancedRenderable(engine, mesh, instanceDataDesc);
	this.material = new PointSpriteInstMaterial(engine, engine.getTexture(textureId));

	this._instanceData = [];
	this._instanceData._dirty = false;
	this._instanceIndices = [];
	this._instanceTransformables = [];
	
	// TEMP
	var count = 100;
	this._instancedRenderable.setInstanceCount(count);
	
	for (var i = 0; i < count; ++i) {
		this._instanceData[9 * i] = Math.random() * 10 - 5;
		this._instanceData[9 * i + 1] = Math.random() * 10 - 5;
		this._instanceData[9 * i + 2] = Math.random() * 10 - 5;
		this._instanceData[9 * i + 3] = (Math.random() > 0.5) ? 64 : 32;
		this._instanceData[9 * i + 4] = this._instanceData[9 * i + 3];
		this._instanceData[9 * i + 5] = Math.random() * 0.5 + 0.5;
		this._instanceData[9 * i + 6] = Math.random() * 0.5 + 0.5;
		this._instanceData[9 * i + 7] = Math.random() * 0.5 + 0.5;
		this._instanceData[9 * i + 8] = 1;
	}
	this._instanceData._dirty = true;
	// END OF TEMP
}
PointSpriteBatchRenderable.extends(Object, {
	

	// renderable interface
	prepare: function(engine) {
		var instancedRenderable = this._instancedRenderable;
		if (this._instanceData._dirty) {
			instancedRenderable.setInstanceData(this._instanceData);
			this._instanceData._dirty = false;
		}
		instancedRenderable.prepare(engine);
	},
	setParams: function(globalParams) {
		this.material.setParams(globalParams);
	},
	render: function(engine) {
		this._instancedRenderable.render(engine);
	}
});