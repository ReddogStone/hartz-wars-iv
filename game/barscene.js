'use strict';

var barSceneTemplate = ( function() {
	var bgImg = new Image(); bgImg.src = 'data/bar_bg.png';
	var doenerImg = new Image(); doenerImg.src = 'data/doener.png';
	var playerImg = new Image(); playerImg.src = 'data/walk_anim.png';
	var doorHighlightImg = new Image();	doorHighlightImg.src = 'data/bar_door_highlight.png';
	var progressImg = new Image(); progressImg.src = 'data/progress.png';
	
	var roomDoorEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor('rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgba(0,200,0,1)'),
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
		new ChangingColor('rgba(255,255,255,0)', 'rgba(100,255,100,1)', 'rgba(255,255,255,1)')];
		
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: bgImg,
						size: {x: 1024, y: 640}
					}
				}
			},
			foreground: {
				type: 'Scene',
				children: {
					playerBody: {
						type: 'Sprite',
						texture: playerImg,
						size: {x: 150, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 250, y: 700},
						anchor: {x: 0, y: 1}
					},
					doorButton: {
						type: 'Button',
						size: {x: 80, y: 570},
						texture: doorHighlightImg,
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
						texture: doenerImg,
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
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	foreground.doorButton.onClicked = function() { if (self.onExitToStreet) self.onExitToStreet(); };
	foreground.doenerButton.onClicked = function() { if (self.onEatDoener) self.onEatDoener(); };
}
BarScene.extends(Scene);
	