'use strict';

function Texture(image, sourceRect) {
	var self = this;
	this._image = image;
	if (!sourceRect) {
		if (image.complete) {
			this._sourceRect = new Rect(0, 0, image.width, image.height);
		} else {
			var oldOnLoad = image.onload;
			image.onload = function() {
				if (!self._sourceRect) {
					self._sourceRect = new Rect(0, 0, image.width, image.height);
				}
				oldOnLoad.apply(undefined, arguments);
			}
		}
	} else {
		this.sourceRect = Rect.clone(sourceRect);
	}
}
Texture.extends(Object, {
	get sourceRect() {
		return this._sourceRect;
	},
	set sourceRect(value) {
		this._sourceRect = Rect.clone(value);
	},
	get loaded() {
		return this._image.complete;
	},
	get image() {
		return this._image;
	}
});
Texture.clone = function(value) {
	return new Texture(value._image, value._sourceRect);
}

function TextureManager() {
	this._images = {};
	this._textures = {};
}
TextureManager.extends(Object, {
	_finishedLoading: function(path) {
		var images = this._images;
		var allLoaded = true;
		for (var path in images) {
			if (!images[path].complete) {
				allLoaded = false;
				break;
			}
		}
		if (this.onAllLoaded && allLoaded) {
			this.onAllLoaded();
		}
	},
	loadImage: function(path) {
		var self = this;
		var image = new Image();
		image.onload = function() {
			self._finishedLoading(path);
		};
		image.src = path;
		this._images[path] = image;
		return image;
	},
	getImage: function(path) {
		var image = this._images[path];
		if (!image) {
			image = this.loadImage(path);
		}
		return image;
	},
	createTexture: function(id, path, sourceRect) {
		var texture = new Texture(this.getImage(path), sourceRect);
		this._textures[id] = texture;
		return texture;
	},
	get: function(id) {
		var texture = this._textures[id];
		if (!texture) {
			texture = this.createTexture(id, id);
		}
		return texture;
	}
});