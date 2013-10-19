'use strict';

var roomSceneTemplate = ( function() {
	var highlightEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
	var fridgeEffects = [
		{ type: 'ChangingSpriteColor', pressed: {green: 0.78}, hovered: {green: 0.78} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'white', hovered: 'white' },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
	var cookEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'white', pressed: 'red', hovered: {green: 0.78} }
	];
	
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/room_bg.png',
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
						pos: {x: 500, y: 600},
						anchor: {x: 0, y: 1},
						z: 10
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
							font: {family: 'Comic Sans MS', size: 24, weight: 900},
						},
						z: 5
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
						},
						z: 5
					},
					fridge: {
						type: 'Sprite',
						size: {x: 188, y: 277},
						texture: 'data/fridge.png',
						pos: {x: 360, y: 230},
						z: 3
					},
					fridgeButton: {
						type: 'Button',
						size: {x: 188, y: 277},
						effects: fridgeEffects,
						texture: 'data/fridge_highlight.png',
						pos: {x: 360, y: 230},
						z: 3,
						label: {
							offset: {x: 0, y: -150},
							text: 'Essen kochen',
							color: {r: 1, g: 1, b: 1},
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					fridgeCheapFoodButton: {
						type: 'Button',
						effects: cookEffects,
						pos: {x: 425, y: 330},
						anchor: {x: 0.5, y: 0.5},
						z: 4,
						label: {
							text: 'Billig',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					fridgeCheapAmount: {
						type: 'Label',
						pos: {x: 535, y: 330},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: {family: 'Comic Sans MS', size: 24, weight: 900}
					},
					fridgeExpensiveFoodButton: {
						type: 'Button',
						effects: cookEffects,
						pos: {x: 425, y: 380},
						anchor: {x: 0.5, y: 0.5},
						z: 4,
						label: {
							text: 'Vornehm',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					fridgeExpensiveAmount: {
						type: 'Label',
						pos: {x: 535, y: 380},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: {family: 'Comic Sans MS', size: 24, weight: 900}
					},
					fridgeHealthyFoodButton: {
						type: 'Button',
						effects: cookEffects,
						pos: {x: 425, y: 430},
						anchor: {x: 0.5, y: 0.5},
						z: 4,
						label: {
							text: 'Gesund',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					fridgeHealthyAmount: {
						type: 'Label',
						pos: {x: 535, y: 430},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: {family: 'Comic Sans MS', size: 24, weight: 900}
					}
				}
			}
		}
	};
})();

function RoomScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(roomSceneTemplate);
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
	foreground.chestButton.onClicked = function() { if (self.onSleep) { self.onSleep(); } };
	
	var cheapButton = foreground.fridgeCheapFoodButton;
	cheapButton.size = Size.clone(cheapButton.label.size);
	var expensiveButton = foreground.fridgeExpensiveFoodButton;
	expensiveButton.size = Size.clone(expensiveButton.label.size);
	var healthyButton = foreground.fridgeHealthyFoodButton;
	healthyButton.size = Size.clone(healthyButton.label.size);
	var cheapAmount = this.cheapAmount = foreground.fridgeCheapAmount;
	var expensiveAmount = this.expensiveAmount = foreground.fridgeExpensiveAmount;
	var healthyAmount = this.healthyAmount = foreground.fridgeHealthyAmount;
	
	var setCookVisibility = function(value) {
		cheapButton.visible = value;
		expensiveButton.visible = value;
		healthyButton.visible = value;
		cheapAmount.visible = value;
		expensiveAmount.visible = value;
		healthyAmount.visible = value;
	}
	setCookVisibility(false);
	
	foreground.fridgeButton.onEnter = function() {
		setCookVisibility(true);
	};
	foreground.fridgeButton.onExit = function() {
		setCookVisibility(false);
	};
	
	cheapButton.onClicked = function() { if (self.onCookCheap) { self.onCookCheap(); } };
	expensiveButton.onClicked = function() { if (self.onCookExpensive) { self.onCookExpensive(); } };
	healthyButton.onClicked = function() { if (self.onCookHealthy) { self.onCookHealthy(); } };
}
RoomScene.extends(Scene);
	