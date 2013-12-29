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
	this.targetTransformable = null;
	
	this._projection = null;
	this._createProjection();
}
Camera.extends(Object, {
	_createProjection: function() {
		this._projection = new Vecmath.Matrix4().perspective(this._fov, this._aspect, this._near, this._far);
	},
	getTargetPos: function() {
		if (this.target) {
			return this.target;
		} else if (this.targetTransformable) {
			return this.targetTransformable.pos;
		}
		return null;
	},
	getView: function(transformable) {
		var targetPos = this.getTargetPos();
		if (targetPos) {
			return new Vecmath.Matrix4().lookAt(transformable.pos, targetPos, transformable.up);
		}
		return new Vecmath.Matrix4().fromRotationTranslation(transformable.rot, transformable.pos).invert();
	},
	getProjection: function() {
		return this._projection;
	},
	rotateAroundTargetVert: function(transformable, angle) {
		var targetPos = this.getTargetPos().clone();
		if (targetPos) {
			var targetToPos = transformable.pos.clone().sub(targetPos);
			var up = transformable.up;
			var right = up.clone().cross(targetToPos).normalize();
			var rotation = new Vecmath.Quaternion().setAxisAngle(right, angle);
			transformable.pos = targetPos.add(targetToPos.transformQuat(rotation));
		}
	},
	rotateAroundTargetHoriz: function(transformable, angle) {
		var targetPos = this.getTargetPos().clone();
		if (targetPos) {
			var targetToPos = transformable.pos.clone().sub(targetPos);
			var up = transformable.up;
			var right = up.clone().cross(targetToPos).normalize();
			up = targetToPos.clone().cross(right).normalize();
			var rotation = new Vecmath.Quaternion().setAxisAngle(up, angle);
			transformable.pos = targetPos.add(targetToPos.transformQuat(rotation));
		}
	}
});