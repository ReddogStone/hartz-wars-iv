'use strict';

var roomSceneTemplate = ( function() {
	var highlightEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor(Color.transparentBlack, Color.red, new Color(0, 0.78, 0)),
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state != ButtonState.ACTIVE) {
				button.sprite.blend = 'lighter';
			} else {
				button.sprite.blend = 'source-over';
			}
		})];

	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/room_bg.png',
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
						size: {x: 150, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 400, y: 600},
						anchor: {x: 0, y: 1}
					},
					doorButton: {
						type: 'Button',
						size: {x: 148, y: 286},
						texture: 'data/room_door_highlight.png',
						effects: highlightEffects,
						pos: {x: 630, y: 152},
						label: {
							offset: {x: 0, y: -170},
							text: 'Rausgehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					chestButton: {
						type: 'Button',
						size: {x: 205, y: 164},
						texture: 'data/room_chest_highlight.png',
						effects: highlightEffects,
						pos: {x: 139, y: 342},
						label: {
							offset: {x: 0, y: -100},
							text: 'Schlafen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					}
				}
			}
		}
	};
})();

function RoomScene() {
	var self = this;
	Scene.apply(this);

	Node.loadFromTemplate(roomSceneTemplate, this);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	foreground.doorButton.onClicked = function() { if (self.onExitToStreet) { self.onExitToStreet(); } };
	foreground.chestButton.onClicked = function() { if (self.onSleep) { self.onSleep(); } };
}
RoomScene.extends(Scene);
	