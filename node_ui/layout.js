'use strict';

function CircleLayout(radius, axis, offset) {
	this._radius = radius || 5;
	this._axis = axis ? axis.clone() : new Vecmath.Vector3(0, -1, 0);
	this._offset = offset ? offset.clone() : new Vecmath.Vector3(0, -2, 0);
}
CircleLayout.extends(Object, {
	apply: function(root, children) {
		var radius = this._radius;
		var rootPos = root.pos.clone().add(this._offset);
		var rotation = new Vecmath.Quaternion().rotationTo(new Vecmath.Vector3(0, 1, 0), this._axis);
		var childCount = children.length;
		children.forEach(function(child, index) {
			var angle = (index / childCount - 0.5) * Math.PI * 2;
			var pos = new Vecmath.Vector3(radius * Math.sin(angle), 0, radius * Math.cos(angle));
			pos.transformQuat(rotation).add(rootPos);
			child.pos = pos;
		});
	}
});