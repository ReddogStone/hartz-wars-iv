'use strict';

function IconTextWidget(engine, icon, iconSize, text, font, textOffset) {
	var transformable = this.transformable = new Transformable();
	
	this._sprite = {
		renderable: new PointSpriteRenderable(engine, icon),
		transformable: transformable
	};
	
	var color = BLUE;
	
	var mat = this._sprite.renderable.material;
	mat.color = color;
	if (typeof iconSize == 'object') {
		mat.size = iconSize.clone();
	} else if (iconSize) {
		mat.size = new Vecmath.Vector2(iconSize, iconSize);
	} else {
		mat.size = new Vecmath.Vector2(64, 64);
	}

	this._label = {
		renderable: new TextRenderable(engine, text, font, color, textOffset),
		transformable: transformable
	};
}
IconTextWidget.extends(Object, {
	setHighlighted: function(value) {
		var color = value ? HIGHLIGHTED : BLUE;
		color.alpha = this._sprite.renderable.material.color.alpha;
		this._sprite.renderable.material.color = color;
		this._label.renderable.material.color = color;		
	},
	setAlpha: function(value) {
		this._sprite.renderable.material.color.alpha = value;
		this._label.renderable.material.color.alpha = value;
	},
	setAttenuated: function(value) {
		if (value) {
			this._sprite.renderable.material.color.alpha = 0.4;
			this._label.renderable.material.color.alpha = 0;
		} else {
			this.setAlpha(1);
		}
	},
	addToScene: function(scene) {
		scene.addEntity(this._sprite);
		scene.addEntity(this._label);
	},
	removeFromScene: function(scene) {
		scene.removeEntity(this._sprite);
		scene.removeEntity(this._label);
	}
});