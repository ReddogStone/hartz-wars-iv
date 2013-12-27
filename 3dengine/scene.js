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
	this._dirLight1 = null;
}
Scene.extends(Object, {
	addEntity: function(entity) {
		this._entities.push(entity);
	},
	setDirLight1: function(value) {
		this._dirLight1 = value.clone();
	},
	render: function(engine) {
		engine.setViewport(this._viewport);
		
		var params = {
			uView: this._view.val,
			uProjection: this._projection.val
		};
		if (this._dirLight1) {
			params.uDirLight1 = this._dirLight1.toArray();
		}
		
		scene._entities.forEach(function(entity) {
			params.uWorld = entity.position.globalTransform.val;
			
			entity.renderable.render(engine, params);
		});
	}
});
