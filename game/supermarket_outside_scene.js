'use strict';

var supermarketOutsideTemplate = ( function() {
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
						texture: 'data/supermarket_outside_bg.png',
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
						pos: {x: 250, y: 700},
						anchor: {x: 0, y: 1}
					},
					toStreetButton: {
						type: 'Button',
						size: {x: 119, y: 516},
						texture: 'data/supermarket_to_street_highlight.png',
						effects: highlightEffects,
						pos: {x: 1024, y: 640},
						anchor: {x: 1, y: 1},
						label: {
							offset: {x: -40, y: -320},
							text: 'Zur Straße',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					doorButton: {
						type: 'Button',
						size: {x: 173, y: 275},
						texture: 'data/supermarket_door_highlight.png',
						effects: highlightEffects,
						pos: {x: 630, y: 285},
						label: {
							offset: {x: 0, y: 150},
							text: 'Reingehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
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

	Node.loadFromTemplate(supermarketOutsideTemplate, this);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	foreground.toStreetButton.onClicked = function() { if (self.onExitToStreet) self.onExitToStreet(); };
	foreground.doorButton.onClicked = function() { if (self.onEnterSupermarket) self.onEnterSupermarket(); };
}
SupermarketOutsideScene.extends(Scene);
	