'use strict';

function IconWidgetElement(engine, spriteBatch, atlasIndex, configuration) {
	this._spriteBatch = spriteBatch;
	this._id = -1;
	this._index = atlasIndex;
	this._config = configuration;
	this._size = configuration.defaultSize.clone();
	this._color = Color.clone(configuration.defaultColor);
}
IconWidgetElement.extends(Object, {
	addToScene: function(scene, entity) {
		if (entity.transformable) {
			var pos = entity.transformable.pos;
			this._id = this._spriteBatch.addSprite(pos, this._size, this._color, this._index);
		}
	},
	updateTransform: function(transformable) {
		var id = this._id;
		if (id >= 0) {
			var pos = transformable.pos;
			this._spriteBatch.setSpritePos(id, pos);
		}
	},
	setHighlighted: function(value) {
		var id = this._id;
		if (id >= 0) {
			var config = this._config;
			var color = Color.clone(value ? config.highlightedColor : config.defaultColor);
			color.alpha = this._color.alpha;
			this._spriteBatch.setSpriteColor(id, color);
			this._color = color;
		}
	}
});

function TextWidgetElement(engine, text, font, textoffset, configuration) {
	this._config = configuration;
	this._renderable = new TextRenderable(engine, text, font, color, textOffset);
}
TextWidgetElement.extends(Object, {
	addToScene: function(scene, entity) {
		scene.addEntity(entity);
	},
	updateTransform: function(transformable) {
		var id = this._id;
		if (id >= 0) {
			var pos = transformable.pos;
			this._spriteBatch.setSpritePos(id, pos);
		}
	},
	setHighlighted: function(value) {
		var id = this._id;
		if (id >= 0) {
			var config = this._config;
			var color = Color.clone(value ? config.highlightedColor : config.defaultColor);
			color.alpha = this._color.alpha;
			this._spriteBatch.setSpriteColor(id, color);
			this._color = color;
		}
	}
});

function IconTextWidget(engine, spriteBatch, atlasIndex, iconSize, color, text, font, textOffset) {
	this._spriteBatch = spriteBatch;
	this._spriteId = -1;
	
	this._atlasIndex = atlasIndex;
	this._color = color;
	
	if (typeof iconSize == 'object') {
		this._iconSize = iconSize.clone();
	} else if (iconSize) {
		this._iconSize = new Vecmath.Vector2(iconSize, iconSize);
	} else {
		this._iconSize = new Vecmath.Vector2(64, 64);
	}
	this._baseIconSize = this._iconSize.clone();

	var transformable = new Transformable();
	this.transformable = transformable;
	this._label = {
		renderable: new TextRenderable(engine, text, font, color, textOffset),
		transformable: transformable
	};
	
	this._lines = [];
}
IconTextWidget.extends(Object, {
	get iconSize() {
		return this._iconSize;
	},
	set iconSize(value) {
		var size = new Vecmath.Vector2(64, 64);
		if (typeof iconSize == 'object') {
			size = value.clone();
		} else if (value) {
			size = new Vecmath.Vector2(value, value);
		}
		this._iconSize = size;
		
		if (this._spriteId >= 0) {
			this._spriteBatch.setSpriteSize(this._spriteId, size);
		}
	},
	addLine: function(lineRenderable) {
		this._lines.push({ renderable: lineRenderable} );
	},
	setLayerIndex: function(value) {
		var newSize = this._baseIconSize.clone().scale(1.0 / (value + 1));
		this.iconSize = newSize;
	},
	setHighlighted: function(value) {
		var color = Color.clone(this._color);
		if (value) {
			color.red += 0.8;
			color.green += 0.8;
			color.blue += 0.8;
		}

		if (this._spriteId >= 0) {
			this._spriteBatch.setSpriteColor(this._spriteId, color);
		}

		if (!this._attenuated) {
			this._label.renderable.material.color = color;
		}
		
		this._lines.forEach(function(lineEntity) {
			var alpha = lineEntity.renderable.material.color.alpha;
			color.alpha = alpha; 
			lineEntity.renderable.material.color = color;
		});
	},
	setAlpha: function(value) {
		if (!this._attenuated) {
			this._color.alpha = value;
			if (this._spriteId >= 0) {
				this._spriteBatch.setSpriteColor(this._spriteId, this._color);
			}
			this._label.renderable.material.color.alpha = value;
		}
	},
	setAttenuated: function(value) {
		this._attenuated = value;
		if (value) {
//			this._sprite.renderable.material.color.alpha = 0.4;
			this._label.renderable.invisible = true;
		} else {
			this._label.renderable.invisible = false;
			this.setAlpha(1);
		}
	},
	addToScene: function(scene) {
		this._spriteId = this._spriteBatch.addSprite(this.transformable.pos, this._iconSize, this._color, this._atlasIndex);
		scene.addEntity(this._label);
		this._lines.forEach(function(lineEntity) {
			scene.addEntity(lineEntity);
		});
	},
	removeFromScene: function(scene) {
//		scene.removeEntity(this._sprite);
		scene.removeEntity(this._label);
		this._lines.forEach(function(lineEntity) {
			scene.removeEntity(lineEntity);
		});
	}
});
IconTextWidget.HIGHLIGHTED = new Color(0.2, 1.0, 0.2);
