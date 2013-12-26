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
		
		// setup shader
		var program = WebGL.createProgramFromFiles(gl, 'data/shaders/simple_vs.shader', 'data/shaders/simple_fs.shader');
		this.setMaterial(program);

		viewport.renderables.forEach(function(renderable) {
			renderable.render(this);
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
	
	function setMaterial(program) {
		gl.useProgram(program);
		currentProgram = program;
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
		setMaterial: setMaterial,
		setBuffers: setBuffers,
		renderTriangles: renderTriangles
	};
})();