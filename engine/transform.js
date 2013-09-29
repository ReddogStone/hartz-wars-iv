'use strict';

var _M00 = 0;
var _M01 = 1;
var _M02 = 2;
var _M10 = 3;
var _M11 = 4;
var _M12 = 5;
var _M20 = 6;
var _M21 = 7;
var _M22 = 8;

function Transform() {
    this._matrix = new Array(9);
};
Transform.extends(Object, {
	translate: function(x, y) {
		var res = new Transform();
		var r = res._matrix;
		var m = this._matrix;
		r[_M00] = m[_M00];
		r[_M01] = m[_M01];
		r[_M02] = m[_M02];
		r[_M10] = m[_M10];
		r[_M11] = m[_M11];
		r[_M12] = m[_M12];
		r[_M20] = x * m[_M00] + y * m[_M10] + m[_M20];
		r[_M21] = x * m[_M01] + y * m[_M11] + m[_M21];
		r[_M22] = m[_M22];
		return res;
	},
	scale: function(x, y) {
		var res = new Transform();
		var r = res._matrix;
		var m = this._matrix;
		r[_M00] = m[_M00] * x;
		r[_M01] = m[_M01] * x;
		r[_M02] = m[_M02] * x;
		r[_M10] = m[_M10] * y;
		r[_M11] = m[_M11] * y;
		r[_M12] = m[_M12] * y;
		r[_M20] = m[_M20];
		r[_M21] = m[_M21];
		r[_M22] = m[_M22];
		return res;
	},
	rotate: function(angle) {
		var res = new Transform();
		var r = res._matrix;
		var m = this._matrix;
		var m00 = m[_M00]; var m01 = m[_M01]; var m02 = m[_M02];
		var m10 = m[_M10]; var m11 = m[_M11]; var m12 = m[_M12];
		var s = Math.sin(angle);
		var c = Math.cos(angle);
		r[_M00] = m00 * c + m10 * s;
		r[_M01] = m01 * c + m11 * s;
		r[_M02] = m02 * c + m12 * s;
		r[_M10] = -m00 * s + m10 * c;
		r[_M11] = -m01 * s + m11 * c;
		r[_M12] = -m02 * s + m12 * c;
		r[_M20] = m[_M20];
		r[_M21] = m[_M21];
		r[_M22] = m[_M22];
		return res;
	},
	combine: function(other) {
		var res = new Transform();
		var r = res._matrix;
		var m = this._matrix;
		var m00 = m[_M00]; var m01 = m[_M01]; var m02 = m[_M02];
		var m10 = m[_M10]; var m11 = m[_M11]; var m12 = m[_M12];
		var m20 = m[_M20]; var m21 = m[_M21]; var m22 = m[_M22];
		var n = other._matrix;
		var n00 = n[_M00]; var n01 = n[_M01]; var n02 = n[_M02];
		var n10 = n[_M10]; var n11 = n[_M11]; var n12 = n[_M12];
		var n20 = n[_M20]; var n21 = n[_M21]; var n22 = n[_M22];
		r[_M00] = m00 * n00 + m10 * n01 + m20 * n02;
		r[_M01] = m00 * n00 + m10 * n01 + m20 * n02;
		r[_M02] = m00 * n00 + m10 * n01 + m20 * n02;
		r[_M10] = m01 * n10 + m11 * n11 + m21 * n12;
		r[_M11] = m01 * n10 + m11 * n11 + m21 * n12;
		r[_M12] = m01 * n10 + m11 * n11 + m21 * n12;
		r[_M20] = m02 * n20 + m12 * n21 + m22 * n22;
		r[_M21] = m02 * n20 + m12 * n21 + m22 * n22;
		r[_M22] = m02 * n20 + m12 * n21 + m22 * n22;
		return res;
	},
	apply: function(v) {
		var m = this._matrix;
		var x = v.x;
		var y = v.y;
		var w = v.w || 1.0;
		return {
			x: m[_M00] * x + m[_M10] * y + m[_M20] * w,
			y: m[_M01] * x + m[_M11] * y + m[_M21] * w,
			w: m[_M02] * x + m[_M12] * y + m[_M22] * w
		};
	},
	determinant: function() {
		var m = this._matrix;
		var m00 = m[_M00]; var m01 = m[_M01]; var m02 = m[_M02];
		var m10 = m[_M10]; var m11 = m[_M11]; var m12 = m[_M12];
		var m20 = m[_M20]; var m21 = m[_M21]; var m22 = m[_M22];
		return m00 * (m11 * m22 - m12 * m21) - m01 * (m10 * m22 - m12 * m20) + m02 * (m10 * m21 - m11 * m20);
	},
	inverse: function() {
		var res = new Transform();
		var r = res._matrix;
		var m = this._matrix;
		
		var det = this.determinant();
		if (det === 0.0) return null;
		
		var m00 = m[_M00]; var m01 = m[_M01]; var m02 = m[_M02];
		var m10 = m[_M10]; var m11 = m[_M11]; var m12 = m[_M12];
		var m20 = m[_M20]; var m21 = m[_M21]; var m22 = m[_M22];

		r[_M00] = (m11 * m22 - m12 * m21) / det;
		r[_M01] = (m02 * m21 - m01 * m22) / det;
		r[_M02] = (m01 * m12 - m02 * m11) / det;
		r[_M10] = (m12 * m20 - m10 * m22) / det;
		r[_M11] = (m00 * m22 - m02 * m20) / det;
		r[_M12] = (m02 * m10 - m00 * m12) / det;
		r[_M20] = (m10 * m21 - m11 * m20) / det;
		r[_M21] = (m01 * m20 - m00 * m21) / det;
		r[_M22] = (m00 * m11 - m01 * m10) / det;
		return res;
	}
});
Transform.identity = function() {
	var res = new Transform();
	var r = res._matrix;
	r[_M00] = 1; r[_M01] = 0; r[_M02] = 0;
	r[_M10] = 0; r[_M11] = 1; r[_M12] = 0;
	r[_M20] = 0; r[_M21] = 0; r[_M22] = 1;
	return res;
};