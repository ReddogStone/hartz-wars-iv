'use strict';

function ChangingPriceLabelColor(active, pressed, hovered, inactive) {
	initChangingValueEffect(this, active, pressed, hovered, inactive, Color);
}
makeChangingValueEffect(ChangingPriceLabelColor, function(button, value) {
	if (button.priceLabel) {
		button.priceLabel.color = value;
	}
}, Color);

var supermarketInsideTemplate = ( function() {
	var exitButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'black', pressed: {green: 0.8}, hovered: 'red' },
	];
	var cheapButtonEffects = [
		{ type: 'ChangingSpriteColor', active: 'white', pressed: 'red', hovered: {green: 0.8} },
	];
	var font = Fonts.inGameBig;

	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				z: 0,
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
						size: {x: 180, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 250, y: 700},
						anchor: {x: 0, y: 1},
						z: 10
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
							font: font
						}
					},
					buyCheapButton: {
						type: 'Button',
						size: {x: 200, y: 125},
						texture: 'data/supermarket_food.png',
						sourceRect: {x: 0, y: 0, sx: 200, sy: 125},
						pos: {x: 9, y: 70},
						effects: cheapButtonEffects
					},
					buyExpensiveButton: {
						type: 'Button',
						size: {x: 193, y: 125},
						texture: 'data/supermarket_food.png',
						sourceRect: {x: 200, y: 0, sx: 200, sy: 125},
						pos: {x: 214, y: 70},
						effects: cheapButtonEffects
					},
					buyHealthyButton: {
						type: 'Button',
						size: {x: 200, y: 131},
						texture: 'data/supermarket_food.png',
						sourceRect: {x: 0, y: 125, sx: 200, sy: 125},
						pos: {x: 9, y: 200},
						effects: cheapButtonEffects
					},
					productKindLabel: {
						type: 'Label',
						pos: {x: 240, y: 210},
						font: Fonts.inGameMiddle,
						text: 'Essen',
						z: 1
					},
					productTypeLabel: {
						type: 'Label',
						pos: {x: 240, y: 240},
						font: Fonts.inGameMiddle,
						text: 'Typ',
						z: 1
					},
					productPriceLabel: {
						type: 'Label',
						pos: {x: 240, y: 270},
						font: Fonts.inGameMiddle,
						text: 'Preis',
						z: 1
					},
					productMealsLabel: {
						type: 'Label',
						pos: {x: 240, y: 300},
						font: Fonts.inGameMiddle,
						text: 'Mahlzeiten',
						z: 1
					},
					playerInventory1: {
						type: 'Sprite',
						texture: 'data/supermarket_food.png',
						z: 1,
						anchor: {x: 0.5, y: 0},
						pos: {x: 495, y: 75},
						size: {x: 100, y: 67.5}
					},
					playerInventory2: {
						type: 'Sprite',
						texture: 'data/supermarket_food.png',
						z: 1,
						anchor: {x: 0.5, y: 0},
						pos: {x: 495, y: 150},
						size: {x: 100, y: 67.5}
					},
					playerInventory3: {
						type: 'Sprite',
						texture: 'data/supermarket_food.png',
						z: 1,
						anchor: {x: 0.5, y: 0},
						pos: {x: 495, y: 225},
						size: {x: 100, y: 67.5}
					},
					playerInventoryFill: {
						type: 'Label',
						z: 1,
						anchor: {x: 0.5, y: 0},
						pos: {x: 495, y: 300},
						color: {r: 0, g: 0, b: 0},
						font: font
					}
				}
			}
		}
	};
})();

function SupermarketInsideScene() {
	Scene.apply(this);
	var self = this;
	this.children.clear();
	this.deserialize(supermarketInsideTemplate);
	var foreground = this.foreground;

	var sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	sprite.addAction(animation);
	this.playerBody = sprite;
	
	var buyOverlay = this.buyOverlay;
	
	this._playerInventorySlots = [buyOverlay.playerInventory1, buyOverlay.playerInventory2, buyOverlay.playerInventory3];
	this.clearAllPlayerInventorySlots();
	this.playerInventoryFill = buyOverlay.playerInventoryFill;
}
SupermarketInsideScene.extends(Scene, {
	clearPlayerInventorySlot: function(index) {
		this._playerInventorySlots[index].visible = false;
	},
	clearAllPlayerInventorySlots: function() {
		this._playerInventorySlots.forEach(function(element, index) {
			this.clearPlayerInventorySlot(index);
		}, this);
	},
	setPlayerInventorySlot: function(index, type) {
		var sourceRect;
		switch (type) {
			case 'cheap':
				sourceRect = new Rect(0, 0, 200, 125);
				break;
			case 'expensive':
				sourceRect = new Rect(200, 0, 200, 125);
				break;
			case 'healthy':
				sourceRect = new Rect(0, 125, 200, 125);
				break;
			default:
				throw new Error('Slot type should be: "cheap", "expensive" or "healthy", but was "' + type + '"');
		}
		var slotSprite = this._playerInventorySlots[index];
		slotSprite.visible = true;
		slotSprite.sourceRect = sourceRect;
	},
	set onExit(value) {
		this.buyOverlay.exitButton.onClicked = value;
	},
	set onBuyCheapFood(value) {
		this.buyOverlay.buyCheapButton.onClicked = value;
	},
	set onBuyExpensiveFood(value) {
		this.buyOverlay.buyExpensiveButton.onClicked = value;
	},
	set onBuyHealthyFood(value) {
		this.buyOverlay.buyHealthyButton.onClicked = value;
	},
	set onSelectProduct(value) {
		var buyCheapButton = this.buyOverlay.buyCheapButton;
		var buyExpensiveButton = this.buyOverlay.buyExpensiveButton;
		var buyHealthyButton = this.buyOverlay.buyHealthyButton;
		
		buyCheapButton.onEnter = function() { value('cheap'); };
		buyExpensiveButton.onEnter = function() { value('expensive'); };
		buyHealthyButton.onEnter = function() { value('healthy'); };
		buyCheapButton.onExit = buyExpensiveButton.onExit = buyHealthyButton.onExit = function() { value(null); };
	}
});
	