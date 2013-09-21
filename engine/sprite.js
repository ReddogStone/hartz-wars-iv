'use strict';

function Sprite(size, texture, sourceRect) {
	this.size = cloneSize(size);
	this.texture = texture;
	this.sourceRect = sourceRect || new Rect(0, 0, texture.width, texture.height);
}

Sprite.prototype.render = function(node, context) {
	var sRect = this.sourceRect;
	var size = this.size;
	context.drawImage(this.texture, sRect.x, sRect.y, sRect.sx, sRect.sy, 0, 0, size.x, size.y);
}

function createSpriteNode(sourceRect, size, texture) {
	var node = new Node();
	node.renderable = new Sprite(sourceRect, size, texture);
	node.debug = 'Sprite';	
	return node;
}