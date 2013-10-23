'use strict';

var supermarketOutsideTemplate = ( function() {
	var highlightEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
	var font = Fonts.inGameBig;

	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/supermarket_outside_bg.png',
						size: {x: 1024, y: 640},
						z: 0
					}
				}
			},
			foreground: {
				type: 'Scene',
				children: {
					playerBody: {
						type: 'Sprite',
						texture: 'data/walk_anim.png',
						size: {x: 180, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 250, y: 700},
						anchor: {x: 0, y: 1},
						z: 2
					},
					toStreetButton: {
						type: 'Button',
						size: {x: 119, y: 516},
						texture: 'data/supermarket_to_street_highlight.png',
						effects: highlightEffects,
						pos: {x: 1024, y: 640},
						anchor: {x: 1, y: 1},
						z: 1,
						label: {
							offset: {x: -40, y: -320},
							text: 'Zur Straße',
							font: font,
							z: 3
						}
					},
					doorButton: {
						type: 'Button',
						size: {x: 173, y: 275},
						texture: 'data/supermarket_door_highlight.png',
						effects: highlightEffects,
						pos: {x: 630, y: 285},
						z: 1,
						label: {
							offset: {x: 0, y: 150},
							text: 'Reingehen',
							font: font,
							z: 3
						}
					},
				}
			}
		}
	};
})();

function SupermarketOutsideScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(supermarketOutsideTemplate);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	foreground.toStreetButton.onClicked = function() { if (self.onExitToStreet) self.onExitToStreet(); };
	foreground.doorButton.onClicked = function() { if (self.onEnterSupermarket) self.onEnterSupermarket(); };
}
SupermarketOutsideScene.extends(Scene, {
	enterFromStreet: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(1000, 700);
		playerBody.scale = new Size(-1, 1);
	},
	enterFromSupermarket: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(700, 570);
		playerBody.scale = new Size(-0.7, 0.7);
	}
});
	