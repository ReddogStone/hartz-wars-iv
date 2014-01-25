'use strict';

function updateTransformables(widget, delta) {
	for (var i = 0; i < widget._childPoints.length; ++i) {
		var childPoint = widget._childPoints[i];
		childPoint.transformable.pos = widget.transformable.pos.clone().add(childPoint.offset);
	}
	var lineBatch = widget._lineBatch;
	for (var i = 0; i < widget._lines.length; ++i) {
		var line = widget._lines[i];
		if (line._id !== undefined) {
			lineBatch.setEndPoint1(line._id, line.from.pos);
			lineBatch.setEndPoint2(line._id, line.to.pos);
		}
	}
}

function IconTextWidget(engine, scene, subtree, atlasIndex, iconSize, color, text, font, textOffset) {
	this._spriteBatch = scene.spriteBatch;
	this._lineBatch = scene.lineBatch;
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

	this.transformable = subtree.transformable;
	this._label = {
		renderable: new TextRenderable(engine, text, font, color, textOffset),
		transformable: this.transformable
	};

//	this.updateable = {update: updateTransformables};
	
	this._lines = [];
	this._childPoints = [];
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
			this._spriteBatch.setSize(this._spriteId, size);
		}
	},
	addLine: function(lineDesc) {
		this._lines.push(lineDesc);
	},
	addChildPoint: function(offset, transformable) {
		this._childPoints.push({offset: offset, transformable: transformable});
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
			this._spriteBatch.setColor(this._spriteId, color);
		}

		if (!this._attenuated) {
			this._label.renderable.material.color = color;
		}
		
		var lineBatch = this._lineBatch;
		this._lines.forEach(function(lineDesc) {
			color.alpha = lineDesc.color.alpha;
			lineBatch.setColor(lineDesc._id, color);
		});

		if (!value && this._selected) {
			this.setSelected(true);
		}
	},
	setSelected: function(value) {
		this._selected = value;

		var color = Color.clone(this._color);
		if (value) {
			color.green += 0.3;
		}

		if (this._spriteId >= 0) {
			this._spriteBatch.setColor(this._spriteId, color);
		}

		if (!this._attenuated) {
			this._label.renderable.material.color = color;
		}
		
		var lineBatch = this._lineBatch;
		this._lines.forEach(function(lineDesc) {
			color.alpha = lineDesc.color.alpha;
			lineBatch.setColor(lineDesc._id, color);
		});
	},
	setAlpha: function(value) {
		if (!this._attenuated) {
			this._color.alpha = value;
			if (this._spriteId >= 0) {
				this._spriteBatch.setColor(this._spriteId, this._color);
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
		scene.addEntity(this._label);
		this._spriteId = 
			this._spriteBatch.add(this.transformable.pos, this._iconSize, this._color, this._atlasIndex);

		var lineBatch = this._lineBatch;
		this._lines.forEach(function(lineDesc) {
			lineDesc._id = lineBatch.add(
				lineDesc.from.pos, lineDesc.to.pos, lineDesc.color, lineDesc.width, lineDesc.patternIndex);
		});
	},
	removeFromScene: function(scene) {
		scene.removeEntity(this._label);
		this._spriteBatch.remove(this._spriteId);

		var lineBatch = this._lineBatch;
		this._lines.forEach(function(lineDesc) {
			lineBatch.remove(lineDesc._id);
			delete lineDesc._id;
		});
	},
	updatePos: function() {
		this._spriteBatch.setPos(this._spriteId, this.transformable.pos);
	}
});
IconTextWidget.HIGHLIGHTED = new Color(0.2, 1.0, 0.2);
