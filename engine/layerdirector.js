'use strict';

var LayerType = {
	REGULAR: { name: 'Regular' },
	MODAL: { name: 'Modal' }
};

var LayerDirector = ( function() {
	function Layer(viewport, type) {
		this.scene = null;
		this.viewport = viewport;
		this.type = type || LayerType.REGULAR;
	}

	function LayerDirector() {
		this.layers = [];
	}
	LayerDirector.extends(Object, {
		createLayer: function(index, viewport, type) {
			this.layers[index] = new Layer(viewport, type);
		},
		deleteLayer: function(index) {
			delete this.layers[index];
		},
		getLayerScene: function(index) {
			return this.layers[index].scene;
		},
		setLayerScene: function(index, scene) {
			this.layers[index].scene = scene;
		},
		clearLayerScene: function(index) {
			this.layers[index].scene = null;
		},
		update: function(delta) {
			this.layers.forEach(function(layer) {
				if (layer.scene) {
					layer.scene.update(delta);
				}
			});
		},
		updateRenderList: function() {
			this.layers.forEach(function(layer) {
				if (layer.scene) {
					layer.scene.updateRenderList();
				}
			});
		},
		render: function(context) {
			this.layers.forEach(function(layer) {
				if (layer.scene) {
					layer.viewport.render(context, layer.scene);
				}
			});			
		},
		handleMouseEvent: function(type, mouse) {
			return this.layers.reverseSome(function(layer) {
				var scene = layer.scene;
				if (!scene || !scene.visible) {
					return false;
				}
			
				var destRect = layer.viewport.destRect;
				var transformedEvent = {x: mouse.x - destRect.x, y: mouse.y - destRect.y, down: mouse.down};

				if (typeof scene[type] != 'function') {
					throw new Error('Scene ' + scene.constructor.name + ' doesn\'t define "' + type + '"');
				}
				var handled = scene[type](transformedEvent);
				if (layer.type == LayerType.MODAL) {
					return true;
				}
				
				return handled;
			});
		}
	});

	return LayerDirector;
})();