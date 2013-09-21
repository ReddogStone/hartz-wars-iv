'use strict';

function Node() {
	this.pos = new Pos();
	this.size = new Size();
	this.debug = 'Node';
}
Node.prototype.getRect = function() {
	return new Rect(this.pos.x, this.pos.y, this.size.sx, this.size.sy);
};
