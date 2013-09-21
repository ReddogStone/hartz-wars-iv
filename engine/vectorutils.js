'use strict';

var Vec = {};
Vec.make = function(v) {
    return {x: v.x, y: v.y};
};
Vec.create = function(x, y) {
    return {x: x, y: y};
};
Vec.setZero = function(v) {
	v.x = 0.0;
	v.y = 0.0;
};
Vec.set = function(v, value) {
	v.x = value.x;
	v.y = value.y;
};
Vec.add = function(v1, v2) {
	return {x: v1.x + v2.x, y: v1.y + v2.y};
};
Vec.sub = function(v1, v2) {
	return {x: v1.x - v2.x, y: v1.y - v2.y};
};
Vec.mul = function(v, s) {
	return {x: v.x * s, y: v.y * s};
};
Vec.dot = function(v1, v2) {
	return v1.x * v2.x + v1.y * v2.y;
};
Vec.length = function(v) {
	return Math.sqrt(Vec.dot(v, v));
};

Vec.squareDist = function(p1, p2) {
	var dx = p1.x - p2.x;
	var dy = p1.y - p2.y;
	return dx * dx + dy * dy;
};

Vec.dist = function(p1, p2) {
	return Math.sqrt(Vec.squareDist(p1, p2));
};

Vec.lerp = function(from, to, progress) {
    return Vec.add(Vec.mul(to, progress), Vec.mul(from, 1 - progress));
}

Vec.normal = function(v) {
	return {x: -v.y, y: v.x};
}

Vec.normalize = function(v) {
	var l = Vec.length(v);
	return {x: v.x / l, y: v.y / l};
}