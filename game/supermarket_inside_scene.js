'use strict';

var supermarketInsideTemplate = ( function() {
	var exitButtonEffects = [
		new JumpingLabel(2, 2),		
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			var color = Color.black;
			switch (state) {
				case ButtonState.ACTIVE:
					color = Color.black;
					break;
				case ButtonState.HOVERED:
					color = Color.red;
					break;
				case ButtonState.PRESSED:
					color = new Color(0, 0.8, 0);
					break;
			}
			button.label.color = color;
		})];
	var darkButtonEffects = [
		new JumpingLabel(2, 2),		
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			var color = Color.black;
			switch (state) {
				case ButtonState.ACTIVE:
					color = Color.white;
					break;
				case ButtonState.HOVERED:
					color = Color.red;
					break;
				case ButtonState.PRESSED:
					color = new Color(0, 0.8, 0);
					break;
			}
			button.label.color = color;
		})];
	var lightButtonEffects = [
		new JumpingLabel(2, 2),		
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			var color = Color.black;
			switch (state) {
				case ButtonState.ACTIVE:
					color = Color.black;
					break;
				case ButtonState.HOVERED:
					color = Color.red;
					break;
				case ButtonState.PRESSED:
					color = new Color(0, 0.3, 0);
					break;
			}
			button.label.color = color;
		})];
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
						texture: 'data/supermarket_inside_bg.png',
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
					}
				}
			},
			buyOverlay: {
				type: 'Scene',				
				size: {x: 592, y: 424},
				pos: {x: 512, y: 212},
				children: {
					background: {
						type: 'Sprite',
						alpha: 0.7,
						texture: 'data/supermarket_buy_bg.png',
						size: {x: 592, y: 424}
					},
					exitButton: {
						type: 'Button',
						size: {x: 170, y: 80},
						pos: {x: 575, y: 424},
						effects: exitButtonEffects,
						anchor: {x: 1, y: 1},
						label: {
							text: 'Rausgehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}							
						}
					},
					buyCheapButton: {
						type: 'Button',
						size: {x: 200, y: 125},
						texture: 'data/supermarket_cheap_food.png',
						pos: {x: 9, y: 70},
						effects: darkButtonEffects,
						label: {
							text: 'Billigessen',
							offset: {x: 0, y: -30},
							font: {family: 'Comic Sans MS', size: 24, weight: 900}							
						}
					},
					buyExpensiveButton: {
						type: 'Button',
						size: {x: 200, y: 125},
						texture: 'data/supermarket_expensive_food.png',
						pos: {x: 209, y: 70},
						effects: lightButtonEffects,
						label: {
							text: 'Gutes Essen',
							offset: {x: 0, y: -30},
							font: {family: 'Comic Sans MS', size: 24, weight: 900}							
						}
					},
					buyHealthyButton: {
						type: 'Button',
						size: {x: 200, y: 125},
						texture: 'data/supermarket_healthy_food.png',
						pos: {x: 9, y: 202},
						effects: darkButtonEffects,
						label: {
							text: 'Bio-Essen',
							offset: {x: 0, y: -30},
							font: {family: 'Comic Sans MS', size: 24, weight: 900}							
						}
					}
				}
			}
		}
	};
})();

function SupermarketInsideScene() {
	Scene.apply(this);
}
SupermarketInsideScene.extends(Scene, {
	init: function() {
		var self = this;
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
		
		var buyOverlay = this.buyOverlay;
		buyOverlay.exitButton.onClicked = function() { if (self.onExit) self.onExit(); };		
	}
});
	