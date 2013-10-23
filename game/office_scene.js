'use strict';

var officeTemplate = ( function() {
	var highlightEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'red', hovered: {green: 0.78} },
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
						texture: 'data/office_bg.png',
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
					doorButton: {
						type: 'Button',
						size: {x: 187, y: 72},
						texture: 'data/office_door_highlight.png',
						effects: highlightEffects,
						pos: {x: 223, y: 511},
						z: 1,
						label: {
							offset: {x: 0, y: -50},
							text: 'Arbeiten gehen',
							font: font
						}
					},
					mapButton: {
						type: 'Button',
						pos: {x: 20, y: 620},
						z: 1,
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

function OfficeScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(officeTemplate);
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
}
OfficeScene.extends(Scene, {
	enterFromBus: function() {
		var playerBody = this.playerBody;
		playerBody.pos = new Pos(900, 650);
		playerBody.scale = new Size(-0.4, 0.4);
	},
	set onEnterOffice(value) {
		this.foreground.doorButton.onClicked = value;
	},
	set onShowMap(value) {
		this.foreground.mapButton.onClicked = value;
	}	
});
	