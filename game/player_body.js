'use strict';

var playerTemplate = ( function() {
	return {
		type: 'Node',
		anchor: {x: 0, y: 1},
		size: {x: 180, y: 300},
		children: {
			colorBody: {
				type: 'Sprite',
				texture: 'data/walk_anim',
				size: {x: 180, y: 300},
				sourceRect: {x: 30, y: 30, sx: 100, sy: 200}
			},
			grayBody: {
				type: 'Sprite',
				texture: 'data/walk_anim_gray',
				size: {x: 180, y: 300},
				sourceRect: {x: 30, y: 30, sx: 100, sy: 200}
			}
		}
	};
})();

function PlayerBody() {
	var self = this;
	Node.apply(this);

	this.deserialize(playerTemplate);
	
	var animation = new FrameAnimation(0.4, function() {return self.colorBody.texture.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	this.colorBody.addAction(animation);

	animation = new FrameAnimation(0.4, function() {return self.grayBody.texture.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	this.grayBody.addAction(animation);
}
PlayerBody.extends(Node);

PlayerBody.addToScene = function(playerBody, scene, z) {
	playerBody.grayBody.z = z;
	playerBody.colorBody.z = z + 1;
	scene.addChild(playerBody);
}
	