'use strict';

function AssetManager() {
};
AssetManager.extends(Object, {
	load: function(assets, progressCallback) {
		var loadCount = 0;
		assets.images.forEach(function(path) {
			Engine.textureManager.loadImage(path, function() {
				loadCount++;
				progressCallback(loadCount);
			});
		});
		for (var id in assets.textures) {
			var description = assets.textures[id];
			Engine.textureManager.create(id, description.image, description.sourceRect);
		}
	}
});