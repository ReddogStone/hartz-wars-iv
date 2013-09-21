'use strict';

function Pos(x, y, rot) {
	this.x = x || 0;
	this.y = y || 0;
	this.rot = rot || 0;
}
function clonePos(value) {
	return value ? new Pos(value.x, value.y, value.rot) : new Pos();
}

function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}
function clonePoint(value) {
	return value ? new Point(value.x, value.y) : new Point();
}

function Size(sx, sy) {
	this.sx = sx || 0;
	this.sy = sy || 0;
}
function cloneSize(value) {
	return value ? new Size(value.sx, value.sy) : new Size();
}

function Rect(x, y, sx, sy) {
	this.x = x || 0;
	this.y = y || 0;
	this.sx = sx || 0;
	this.sy = sy || 0;
}
Rect.prototype.fromPosSize = function(pos, size) {
	return new Rect(pos.x, pos.y, size.sx, size.sy);
};
Rect.prototype.pos = function() {
	return new Point(this.x, this.y);
};
Rect.prototype.size = function() {
	return new Size(this.sx, this.sy);
};
Rect.prototype.setPos = function(value) {
	this.x = value.x;
	this.y = value.y;
};
Rect.prototype.setSize = function(value) {
	this.sx = value.sx;
	this.sy = value.sy;
};
Rect.prototype.containsPoint = function(point) {
	var dx = point.x - this.x;
	var dy = point.y - this.y;
	
	return (dx > 0) && (dx < this.sx) && (dy > 0 && dy < this.sy);
};
function cloneRect(value) {
	return value ? new Rect(value.x, value.y, value.sx, value.sy) : new Rect();
}
