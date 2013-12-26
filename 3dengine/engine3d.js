'use strict';

var Engine3D = (function() {
	var gl = null;
	var currentProgram = null;

	function init(canvas) {
		gl = WebGL.setupWebGL(canvas);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
	}

	function clear() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	function renderFrame(viewport) {
		gl.viewport(viewport.x, viewport.y, viewport.sx, viewport.sy);
		
		clear();
		
		viewport.nodes.forEach(function(node) {
			var pos = node.position;
			
			node.renderable.render(this, {
				uPos: [pos.x, pos.y, pos.z]
			});
		}, this);
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
//				gl.uniform2fv(location, value);
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
	
	function setMaterial(program, parameters) {
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
	
	function renderTriangles(count, offset) {
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
	}
	
	return {
		init: init,
		renderFrame: renderFrame,
		createVertexBuffer: createVertexBuffer,
		createIndexBuffer: createIndexBuffer,
		createProgram: createProgram,
		setMaterial: setMaterial,
		setBuffers: setBuffers,
		renderTriangles: renderTriangles
	};
})();