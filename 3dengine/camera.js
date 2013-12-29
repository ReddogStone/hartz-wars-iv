'use strict';

function Camera(fov, aspect, nearPlane, farPlane) {
	this._fov = fov || 0.5 * Math.PI;
	if (aspect) {
		this._aspect = aspect;
	} else {
		var canvas = document.getElementById('canvas');
		this._aspect = canvas.width / canvas.height;
	}
	this._near = nearPlane;
	this._far = farPlane;
	
	this.target = null;
	
	this._projection = null;
	this._createProjection();
}
Camera.extends(Object, {
	_createProjection: function() {
		this._projection = new Vecmath.Matrix4().perspective(this._fov, this._aspect, this._near, this._far);
	},
	getView: function(transformable) {
		if (this.target) {
			var target = this.target;
			var targetPos = target;
			if (!(target instanceof Vecmath.Vector3)) {
				targetPos = target.pos;
			}
			return new Vecmath.Matrix4().lookAt(transformable.pos, targetPos, transformable.up);
		} else {
			return new Vecmath.Matrix4().fromRotationTranslation(transformable.rot, transformable.pos).invert();
		}
	},
	getProjection: function() {
		return this._projection;
	},
	rotateAroundTarget: function(transformable) {
		
	}
});