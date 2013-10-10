'use strict';

var globalScope = this;
Node.loadFromTemplate = ( function() {
	var module = {};
	function loadImage(srcPath) {
		var image = new Image();
		image.src = srcPath;
		return image;
	}
	
	module.loadNode = function(template, node) {
		if (template.pos) { node.pos = Pos.clone(template.pos); }
		if (template.anchor) { node.anchor = Point.clone(template.anchor); }
		if (template.size) { node.size = Size.clone(template.size); }
		if (template.visible) { node.visible = template.visible; }
		if (template.selfVisible) { node.selfVisible = template.selfVisible; }
		if (template.scale) { node.scale = Size.clone(template.scale); }
		if (template.alpha) { node.alpha = template.alpha; }
		if (template.z) { node.z = template.z; }
	}

	module.loadScene = function(template, scene) {
		module.loadNode(template, scene);
	}

	module.loadSprite = function(template, sprite) {
		module.loadNode(template, sprite);
		
		if (template.texture) { sprite.texture = loadImage(template.texture); }
		if (template.sourceRect) { sprite.sourceRect = Rect.clone(template.sourceRect); }
		if (template.color) { sprite.color = Color.clone(template.color); }
		if (template.blend)	{ sprite.blend = template.blend; }
	}
	
	module.loadLabel = function(template, label) {
		module.loadNode(template, label);
		
		if (template.text) { label.text = template.text; }
		if (template.font) { label.font = Font.clone(template.font); }
		if (template.color) { label.color = Color.clone(template.color); }
	}

	module.loadButton = function(template, button) {
		module.loadNode(template, button);
		
		if (template.texture) { button.texture = loadImage(template.texture); }
		if (template.effects) { button.addEffects(template.effects); }
		if (template.label) {
			var label = template.label;
			if (label.offset) { button.labelOffset = Point.clone(label.offset); }
			module.loadLabel(label, button.label);
		}
	}
	
	module.loadProgress = function(template, progress) {
		module.loadNode(template, progress);
		
		if (template.texture) { progress.texture = loadImage(template.texture); }
		if (template.frameRect) { progress.frameRect = Rect.clone(template.frameRect); }
		if (template.fillRect) { progress.fillRect = Rect.clone(template.fillRect); }
		if (template.frameColor) { progress.frameColor = Color.clone(template.frameColor); }
		if (template.fillColor) { progress.fillColor = Color.clone(template.fillColor); }
		if (template.progress) { progress.progress = template.progress; }
	}

	function load(template, node) {
		var type = template.type;

		var children = [];
		var templChildren = template.children || {};
		for (var childName in templChildren) {
			var childTemplate = templChildren[childName];
			var child = new globalScope[childTemplate.type]();
			load(childTemplate, child);
			children.push({name: childName, node: child});
		}
		
		module['load' + template.type](template, node);
				
		children.forEach( function(element, index, array) {
			node.addChild(element.node);
			node[element.name] = element.node;
		});
	}
	
	return load;
})();