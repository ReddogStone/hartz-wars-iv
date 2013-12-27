'use strict';

var BlendMode = {
	SOLID: {name: 'SOLID'},
	ALPHA: {name: 'ALPHA'},
	PREMUL_ALPHA: {name: 'PREMUL_ALPHA'},
};

var Engine3D = (function() {
	var gl = null;
	var currentProgram = null;

	function init(canvas) {
		gl = WebGL.setupWebGL(canvas);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
	}

	function createVertexBuffer(data) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		return buffer;
	}
	function createIndexBuffer(data) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
		return buffer;
	}
	function createProgram(vertexShader, fragmentShader) {
		return WebGL.createProgram(gl, vertexShader, fragmentShader);
	}
	
	function createTexture(path) {
		var texture = gl.createTexture();
		texture.image = new Image();
		texture.image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
			
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			
			gl.bindTexture(gl.TEXTURE_2D, null);
		};
		texture.image.src = path;
		return texture;
	}
	
	function setViewport(value) {
		gl.viewport(value.x, value.y, value.sx, value.sy);		
	}
	
	function setMaterialParameter(location, type, value) {
		switch (type) {
			case 0x8B50: // FLOAT_VEC2
				gl.uniform2fv(location, value);
				break;
			case 0x8B51: // FLOAT_VEC3
				gl.uniform3fv(location, value);
				break;
			case 0x8B52: // FLOAT_VEC4
				gl.uniform4fv(location, value);
				break;
			case 0x8B53: // INT_VEC2
				gl.uniform2iv(location, value);
				break;
			case 0x8B54: // INT_VEC3
				gl.uniform3iv(location, value);
				break;
			case 0x8B55: // INT_VEC4
				gl.uniform4iv(location, value);
				break;
			case 0x8B56: // BOOL
				gl.uniform1iv(location, value);
				break;
			case 0x8B57: // BOOL_VEC2
				gl.uniform2iv(location, value);
				break;
			case 0x8B58: // BOOL_VEC3
				gl.uniform3iv(location, value);
				break;
			case 0x8B59: // BOOL_VEC4
				gl.uniform4iv(location, value);
				break;
			case 0x8B5A: // FLOAT_MAT2
				gl.uniformMatrix2fv(location, false, value);
				break;
			case 0x8B5B: // FLOAT_MAT3
				gl.uniformMatrix3fv(location, false, value);
				break;
			case 0x8B5C: // FLOAT_MAT4
				gl.uniformMatrix4fv(location, false, value);
				break;
			case 0x8B5E: // SAMPLER_2D
				var texture = value.texture;
				if (texture.image.complete) {
					var sampler = value.sampler;
					gl.activeTexture(gl['TEXTURE' + sampler]);
					gl.bindTexture(gl.TEXTURE_2D, texture);
					gl.uniform1i(location, sampler);
				}
				break;
			case 0x8B60: // SAMPLER_CUBE
//				gl.uniform2fv(location, value);
				break;
			case 0x1400: // BYTE
				gl.uniform1iv(location, value);
				break;
			case 0x1401: // UNSIGNED_BYTE
				gl.uniform1iv(location, value);
				break;
			case 0x1402: // SHORT
				gl.uniform1iv(location, value);
				break;
			case 0x1403: // UNSIGNED_SHORT
				gl.uniform1iv(location, value);
				break;
			case 0x1404: // INT
				gl.uniform1iv(location, value);
				break;
			case 0x1405: // UNSIGNED_INT
				gl.uniform1iv(location, value);
				break;
			case 0x1406: // FLOAT
				gl.uniform1fv(location, value);
				break;
		}
	}
	
	function setProgram(program, parameters) {
		gl.useProgram(program);
		currentProgram = program;
		
		var uniforms = currentProgram.activeUniforms;
		for (var paramName in parameters) {
			var param = parameters[paramName];
			if (paramName in uniforms) {
				var info = uniforms[paramName];
				setMaterialParameter(info.location, info.type, param);
			}
		}
	}
	
	function setBlendMode(blendmode) {
		switch (blendmode) {
			case BlendMode.SOLID:
				gl.disable(gl.BLEND);
				gl.enable(gl.DEPTH_TEST);
				break;
			case BlendMode.ALPHA:
				gl.enable(gl.BLEND);
				gl.disable(gl.DEPTH_TEST);
				gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
				break;
			case BlendMode.PREMUL_ALPHA:
				gl.enable(gl.BLEND);
				gl.disable(gl.DEPTH_TEST);
				gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				break;
		}
	}
	
	function setBuffers(vb, ib, description) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vb);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
		
		var attributes = currentProgram.activeAttributes;
		for (var name in description) {
			var desc = description[name];
			var index = attributes[name];
			gl.enableVertexAttribArray(index);
			gl.vertexAttribPointer(index, desc.components, gl[desc.type], desc.normalized, desc.stride, desc.offset);
		}		
	}
	
	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
	
	function renderTriangles(count, offset) {
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
	}
	
	return {
		init: init,
		createVertexBuffer: createVertexBuffer,
		createIndexBuffer: createIndexBuffer,
		createProgram: createProgram,
		createTexture: createTexture,
		setViewport: setViewport,
		setProgram: setProgram,
		setBlendMode: setBlendMode,
		setBuffers: setBuffers,
		clear: clear,
		renderTriangles: renderTriangles
	};
})();