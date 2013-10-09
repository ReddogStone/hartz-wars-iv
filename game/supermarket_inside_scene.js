'use strict';

var supermarketInsideTemplate = ( function() {
	var bgImg = new Image(); bgImg.src = 'data/supermarket_inside_bg.png';
	var playerImg = new Image(); playerImg.src = 'data/walk_anim.png';
	var toStreetHighlightImg = new Image();	toStreetHighlightImg.src = 'data/supermarket_to_street_highlight.png';
	var doorHighlightImg = new Image();	doorHighlightImg.src = 'data/supermarket_door_highlight.png';
	
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
					}
				}
			}
		}
	};
})();

function SupermarketInsideScene() {
	var self = this;
	Scene.apply(this);

	Node.loadFromTemplate(supermarketInsideTemplate, this);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
//	foreground.toStreetButton.onClicked = function() { if (self.onExitToStreet) self.onExitToStreet(); };
//	foreground.chestButton.onClicked = function() { if (self.onSleep) self.onSleep(); };
}
SupermarketInsideScene.extends(Scene);
	