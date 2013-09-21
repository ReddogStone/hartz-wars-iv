'use strict';

function Camera(x, y, rot, scaleX, scaleY) {
	this.pos = new Point(x, y, rot);
	this.scaleX = scaleX ? scaleX : 1.0;
	this.scaleY = scaleY ? scaleY : 1.0;
}

Camera.prototype.getTransform = function() {
	return {x: -this.pos.x, y: -this.pos.y, rot: -this.pos.rot, scaleX: this.scaleX, scaleY: this.scaleY};
};

Camera.prototype.screenToWorld = function(screenPoint) {
	var cos = Math.cos(this.pos.rot);
	var sin = Math.sin(this.pos.rot);
	var x = screenPoint.x + this.pos.x;
	var y = screenPoint.y + this.pos.y;
    var sx = this.scaleX;
    var sy = this.scaleY;
    return {
		x: (cos * x - sin * y) / sx,
        y: (sin * x + cos * y) / sy
    };
};