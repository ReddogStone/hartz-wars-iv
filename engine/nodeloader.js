'use strict';

var loadFromTemplate = ( function() {
	function loadNode(template, node) {
		
	}

	function loadSprite(template) {
		var texture = template.texture;
		var size = template.size;
		var sourceRect = template.sourceRect;
		var res = new Sprite(texture, size, sourceRect);
		if (template.blend)	{ res.blend = template.blend; }
		return res;
	}

	function load(template) {
		var type = template.type;

		var children = [];
		var templChildren = template.children;
		for (var child in templChildren) {
			if (prop == 'type') {
				continue;
			}

			children.push({name: prop, node: load(templChildren[prop])});
		}
		
		var res = null;
		switch (type) {
			case 'Sprite': res = loadSprite(template); break;
		}
		
		if (res) {
			children.forEach( function(element, index, array) {
				res.addChild(element);
			});
		}
		
		return res;
	}
	
	return load;
})();