'use strict';

function IconTextWidget(engine, icon, iconSize, color, text, font, textOffset) {
	var transformable = this.transformable = new Transformable();
	
	this._sprite = {
		renderable: new PointSpriteRenderable(engine, icon),
		transformable: transformable
	};
	var mat = this._sprite.renderable.material;
	mat.color = Color.clone(color) || Color.black;
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
	get color() {
		return this._sprite.renderable.material.color;
	},
	set color(value) {
		this._sprite.renderable.material.color = value;
		this._label.renderable.material.color = value;
	},
	addToScene: function(scene) {
		scene.addEntity(this._sprite);
		scene.addEntity(this._label);
	},
	femoveFromScene: function(scene) {
		scene.removeEntity(this._sprite);
		scene.removeEntity(this._label);
	}
});