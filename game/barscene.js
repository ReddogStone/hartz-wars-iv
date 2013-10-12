'use strict';

var barSceneTemplate = ( function() {
	var roomDoorEffects = [
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

	var foodButtonEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor(Color.transparentBlack, new Color(0.39, 1, 0.39), Color.white)];
		
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/bar_bg.png',
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
						pos: {x: 250, y: 700},
						anchor: {x: 0, y: 1}
					},
					doorButton: {
						type: 'Button',
						size: {x: 80, y: 570},
						texture: 'data/bar_door_highlight.png',
						effects: roomDoorEffects,
						pos: {x: 0, y: 23},
						label: {
							offset: {x: 50, y: 310},
							text: 'Rausgehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					doenerButton: {
						type: 'Button',
						size: {x: 160, y: 90},
						texture: 'data/doener.png',
						effects: foodButtonEffects,
						pos: {x: 205, y: 50},
						label: {
							offset: {x: 0, y: 100},
							text: 'Döner - 3,20€',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
				}
			}
		}
	};
})();

function BarScene() {
	var self = this;
	Scene.apply(this);

	Node.loadFromTemplate(barSceneTemplate, this);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	foreground.doorButton.onClicked = function() { if (self.onExitToStreet) { self.onExitToStreet(); } };
	foreground.doenerButton.onClicked = function() { if (self.onEatDoener) { self.onEatDoener(); } };
}
BarScene.extends(Scene);
	