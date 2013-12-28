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
Viewport.clone = function(value) {
	return new Viewport(value.x, value.y, value.sx, value.sy);
};

function Scene(viewport, view, projection) {
	this._viewport = Viewport.clone(viewport);
	this._view = view ? view.clone() : new Vecmath.Matrix4().lookAt(new Vecmath.Vector3(0, 0, 10), 
		new Vecmath.Vector3(0, 0, 0), new Vecmath.Vector3(0, 1, 0));
	if (projection) {
		this._projection = projection.clone();
	} else {
		var canvas = document.getElementById('canvas');
		this._projection = new Vecmath.Matrix4().perspective(0.5 * Math.PI, canvas.width / canvas.height, 0.1, 1000);
	}
	
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
	addEntity: function(entity) {
		this._entities.push(entity);
	},
	render: function(engine) {
		engine.setViewport(this._viewport);
		
		var bufferSize = engine.getDrawingBufferSize();
		
		var params = {
			uView: this._view.val,
			uProjection: this._projection.val,
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
		
		var view = this._view;
		scene._entities.forEach(function(entity) {
			entity.viewZ = entity.transformable.pos.clone().transformMat4(view).z;
		});
		
		scene._entities.sort(function(e1, e2) {
			return e1.viewZ - e2.viewZ;
		});
		
		scene._entities.forEach(function(entity) {
			params.uWorld = entity.transformable.globalTransform.val;
			
			entity.renderable.render(engine, params);
		});
	}
});
