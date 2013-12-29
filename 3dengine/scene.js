'use strict';

function Viewport(x, y, sx, sy) {
	this.x = x || 0;
	this.y = y || 0;
	
	if (sx) {
		this.sx = sx;
		this.sy = sy;
	} else {
		var canvas = document.getElementById('canvas');
		this.sx = canvas.width;
		this.sy = canvas.height;
	}
}
Viewport.extends(Object, {
	toVector4: function() {
		return new Vecmath.Vector4(this.x, this.y, this.sx, this.sy);
	}
});
Viewport.clone = function(value) {
	return new Viewport(value.x, value.y, value.sx, value.sy);
};

function Scene(viewport, camEntity) {
	this._viewport = Viewport.clone(viewport);
	this._camEntity = camEntity || {
		camera: new Camera(),
		transformable: new Transformable()
	};
	
	this._entities = [];
	this._pointLight1 = null;
	this._pointLight2 = null;
}
Scene.extends(Object, {
	get pointLight1() {
		return this._pointLight1;
	},
	set pointLight1(value) {
		this._pointLight1 = PointLight.clone(value);
	},
	get pointLight2() {
		return this._pointLight2;
	},
	set pointLight2(value) {
		this._pointLight2 = PointLight.clone(value);
	},
	get camEntity() {
		return this._camEntity;
	},
	set camEntity(value) {
		this._camEntity = value;
	},
	get viewport() {
		return this._viewport;
	},
	set viewport(value) {
		this._viewport = Viewport.clone(value);
	},
	addEntity: function(entity) {
		this._entities.push(entity);
	},
	render: function(engine) {
		engine.setViewport(this._viewport);
		
		var bufferSize = engine.getDrawingBufferSize();
		var camera = this._camEntity.camera;
		var view = camera.getView(this._camEntity.transformable);
		var projection = camera.getProjection();
		
		var params = {
			uView: view.val,
			uProjection: projection.val,
			uScreenSize: [bufferSize.x, bufferSize.y]
		};
		if (this._pointLight1) {
			params.uPosLight1 = this._pointLight1.pos.toArray();
			params.uColorLight1 = this._pointLight1.color.toArray3();
		}
		if (this._pointLight2) {
			params.uPosLight2 = this._pointLight2.pos.toArray();
			params.uColorLight2 = this._pointLight2.color.toArray3();
		}
		
		this._entities.forEach(function(entity) {
			if (entity.transformable) {
				entity.viewZ = entity.transformable.pos.clone().transformMat4(view).z;
			} else {
				entity.viewZ = 0.0;
			}
		});
		
		this._entities.sort(function(e1, e2) {
			return e1.viewZ - e2.viewZ;
		});
		
		this._entities.forEach(function(entity) {
			if (entity.transformable) {
				params.uWorld = entity.transformable.transform.val;
			}
			
			entity.renderable.render(engine, params);
		});
	}
});
