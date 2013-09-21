'use strict';

function Sprite(size, texture, sourceRect) {
	Node.apply(this);
	
	this.size = cloneSize(size);
	this.texture = texture;
	this.sourceRect = sourceRect || new Rect(0, 0, texture.width, texture.height);
}
Sprite.extends(Node, {
	renderSelf: function(context) {
		var sRect = this.sourceRect;
		var size = this.size;
		context.drawImage(this.texture, sRect.x, sRect.y, sRect.sx, sRect.sy, 0, 0, size.x, size.y);
	}
});
