'use strict';

function IconTextWidget(engine, icon, iconSize, color, text, font, textOffset) {
	var transformable = this.transformable = new Transformable();
	
	this._sprite = {
		renderable: new PointSpriteRenderable(engine, icon),
		transformable: transformable
	};
	
	this._color = color;
	var mat = this._sprite.renderable.material;
	mat.color = color;
	if (typeof iconSize == 'object') {
		mat.size = iconSize.clone();
	} else if (iconSize) {
		mat.size = new Vecmath.Vector2(iconSize, iconSize);
	} else {
		mat.size = new Vecmath.Vector2(64, 64);
	}
	this._baseIconSize = mat.size.clone();

	this._label = {
		renderable: new TextRenderable(engine, text, font, color, textOffset),
		transformable: transformable
	};
}
IconTextWidget.extends(Object, {
	get iconSize() {
		return this._sprite.renderable.material.size;
	},
	set iconSize(value) {
		var size = new Vecmath.Vector2(64, 64);
		if (typeof iconSize == 'object') {
			size = value.clone();
		} else if (value) {
			size = new Vecmath.Vector2(value, value);
		}
		this._sprite.renderable.material.size = size;
	},
	setLayerIndex: function(value) {
		var newSize = this._baseIconSize.clone().scale(1.0 / (value + 1));
		this.iconSize = newSize;
	},
	setHighlighted: function(value) {
		var color = Color.clone(this._color);
		if (value) {
			color.red += 0.3;
			color.green += 0.3;
			color.blue += 0.3;
		}
		color.alpha = this._sprite.renderable.material.color.alpha;
		this._sprite.renderable.material.color = color;

		if (!this._attenuated) {
			this._label.renderable.material.color = color;		
		}
	},
	setAlpha: function(value) {
		if (!this._attenuated) {
			this._sprite.renderable.material.color.alpha = value;
			this._label.renderable.material.color.alpha = value;
		}
	},
	setAttenuated: function(value) {
		this._attenuated = value;
		if (value) {
//			this._sprite.renderable.material.color.alpha = 0.4;
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
IconTextWidget.HIGHLIGHTED = new Color(0.2, 1.0, 0.2);
