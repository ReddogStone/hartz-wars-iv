'use strict';

var globalScope = this;

function loadImage(srcPath) {
	var image = new Image();
	image.src = srcPath;
	return image;
}

function createFromTemplate(template) {
	var result = new globalScope[template.type]();
	if (result.deserialize) {
		result.deserialize(template);
	}
	return result;
}