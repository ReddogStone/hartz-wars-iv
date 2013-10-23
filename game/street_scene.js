'use strict';

var streetSceneTemplate = ( function() {
	var mapHomeButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'black', pressed: 'red', hovered: {green: 0.47} },
	];
		
	var doorButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
		
	var mapButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'white', pressed: 'red', hovered: {green: 0.47} },
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
						texture: 'data/street_bg.png',
						size: {x: 1024, y: 640}
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
						pos: {x: 400, y: 600},
						anchor: {x: 0, y: 1}
					},
					homeDoorButton: {
						type: 'Button',
						size: {x: 150, y: 265},
						texture: 'data/street_home_door_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 730, y: 0},
						label: {
							offset: {x: -150, y: -50},
							text: 'Reingehen',
							font: font
						}
					},
					barDoorButton: {
						type: 'Button',
						size: {x: 82, y: 150},
						texture: 'data/street_bar_door_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 82, y: 0},
						label: {
							offset: {x: 130, y: 65},
							text: 'Reingehen',
							font: font,
							z: 10
						}
					},
					toSupermarketButton: {
						type: 'Button',
						size: {x: 52, y: 640},
						texture: 'data/street_to_supermarket_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 0, y: 0},
						label: {
							offset: {x: 40, y: 100},
							anchor: {x: 0, y: 0.5},
							text: 'Zum Supermarkt',
							font: font
						}
					},
					mapButton: {
						type: 'Button',
						pos: {x: 20, y: 620},
						anchor: {x: 0, y: 1},
						effects: mapButtonEffects,
						label: {
							text: 'Karte',
							font: font
						}
					}
				}
			}
		}
	};
})();

function StreetScene() {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(streetSceneTemplate);

	// FOREGROUND
	var foreground = this.foreground;
	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	sprite.addAction(animation);
	this.playerBody = sprite;
	var button = foreground.mapButton;
	button.size = Size.clone(button.label.size);
};
StreetScene.extends(Scene, {
	enterFromRoom: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(850, 280);
		playerBody.scale = new Size(-0.5, 0.5);
	},
	enterFromBar: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(100, 170);
		playerBody.scale = new Size(0.4, 0.4);
	},
	enterFromSupermarket: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(60, 170);
		playerBody.scale = new Size(0.4, 0.4);
	},
	set onEnterHome(value) {
		this.foreground.homeDoorButton.onClicked = value;
	},
	set onEnterBar(value) {
		this.foreground.barDoorButton.onClicked = value;
	},
	set onExitToSupermarket(value) {
		this.foreground.toSupermarketButton.onClicked = value;
	},
	set onShowMap(value) {
		this.foreground.mapButton.onClicked = value;
	}
});
