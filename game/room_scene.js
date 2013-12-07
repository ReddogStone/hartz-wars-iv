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
	var alarmButtonEffects = [
		{ type: 'ChangingSpriteColor', active: 'white', pressed: 'red', hovered: {green: 0.78} },
	];
	var font = Fonts.inGameBig;
	
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Sprite',
				texture: 'data/room_bg.png',
				size: {x: 1024, y: 640},
				z: 0
			},
			foreground: {
				type: 'Node',
				size: {x: 1024, y: 640},
				children: {
					doorButton: {
						type: 'Button',
						size: {x: 148, y: 286},
						texture: 'data/room_door_highlight.png',
						effects: highlightEffects,
						pos: {x: 630, y: 152},
						label: {
							offset: {x: 0, y: -170},
							text: 'Rausgehen',
							font: font
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
							font: font
						},
						z: 5
					},
					alarmLabel: {
						type: 'Label',
						font: font,
						text: 'Wecker',
						pos: {x: 160, y: 360},
						color: 'white',
						z: 6
					},
					alarmTimeLabel: {
						type: 'Label',
						font: font,
						text: '8:00',
						pos: {x: 160, y: 410},
						color: 'white',
						z: 6						
					},
					alarmUpButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 250, y: 425},
						anchor: {x: 0, y: 1},
						texture: 'data/arrow_buttons.png',
						sourceRect: {x: 0, y: 0, sx: 16, sy: 16},
						effects: alarmButtonEffects,
						z: 6
					},
					alarmDownButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 250, y: 425},
						texture: 'data/arrow_buttons.png',
						sourceRect: {x: 0, y: 16, sx: 16, sy: 16},
						effects: alarmButtonEffects,
						z: 6
					},
					fridge: {
						type: 'Sprite',
						size: {x: 188, y: 277},
						texture: 'data/fridge.png',
						pos: {x: 360, y: 230},
						z: 2
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
							font: font
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
							font: font
						}
					},
					fridgeCheapAmount: {
						type: 'Label',
						pos: {x: 535, y: 330},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: font
					},
					fridgeExpensiveFoodButton: {
						type: 'Button',
						effects: cookEffects,
						pos: {x: 425, y: 380},
						anchor: {x: 0.5, y: 0.5},
						z: 4,
						label: {
							text: 'Vornehm',
							font: font
						}
					},
					fridgeExpensiveAmount: {
						type: 'Label',
						pos: {x: 535, y: 380},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: font
					},
					fridgeHealthyFoodButton: {
						type: 'Button',
						effects: cookEffects,
						pos: {x: 425, y: 430},
						anchor: {x: 0.5, y: 0.5},
						z: 4,
						label: {
							text: 'Gesund',
							font: font
						}
					},
					fridgeHealthyAmount: {
						type: 'Label',
						pos: {x: 535, y: 430},
						anchor: {x: 1, y: 0.5},
						z: 4,
						text: '0',
						color: {red: 1, green: 1, blue: 1},
						font: font
					},
					phone: {
						type: 'Sprite',
						size: {x: 115, y: 96},
						pos: {x: 825, y: 305},
						texture: 'data/phone.png',
						z: 2
					},
					phoneButton: {
						type: 'Button',
						size: {x: 115, y: 96},
						effects: highlightEffects,
						texture: 'data/phone_highlight.png',
						pos: {x: 825, y: 305},
						z: 3,
						label: {
							offset: {x: 0, y: 250},
							text: 'Mutter anrufen',
							color: {r: 1, g: 1, b: 1},
							font: font
						}
					},
					books: {
						type: 'Sprite',
						size: {x: 120, y: 119},
						pos: {x: 827, y: 189},
						texture: 'data/home_books.png',
						z: 2
					},
					booksButton: {
						type: 'Button',
						size: {x: 120, y: 119},
						effects: highlightEffects,
						texture: 'data/home_books_highlight.png',
						pos: {x: 827, y: 189},
						z: 3,
						label: {
							offset: {x: 0, y: -70},
							text: 'Lesen',
							color: {r: 1, g: 1, b: 1},
							font: font
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

	this.deserialize(roomSceneTemplate);
	var foreground = this.foreground;

	var playerBody = this.playerBody = new PlayerBody();
	PlayerBody.addToScene(playerBody, this, 10);
	
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

	foreground.chestButton.onEnter = function() {
		self._setAlarmClockVisibility(true);
	};
	foreground.chestButton.onExit = function() {
		self._setAlarmClockVisibility(false);
	};
	this._setAlarmClockVisibility(false);
}
RoomScene.extends(Scene, {
	_setAlarmClockVisibility: function(value) {
		this.foreground.alarmLabel.visible = value;
		this.foreground.alarmTimeLabel.visible = value;
		this.foreground.alarmUpButton.visible = value;
		this.foreground.alarmDownButton.visible = value;
	},
	set onExitToStreet(value) {
		this.foreground.doorButton.onClicked = value;
	},
	set onPhoneCall(value) {
		this.foreground.phoneButton.onClicked = value;
	},
	set onAlarmUp(value) {
		this.foreground.alarmUpButton.onClicked = value;		
	},
	set onAlarmDown(value) {
		this.foreground.alarmDownButton.onClicked = value;		
	},
	enter: function() {
		this.playerBody.pos = new Pos(500, 600);
	},
	connectReadSlot: function(slot) {
		slot.connect(this.foreground.booksButton, Vec.create(0, 30));
	},
	connectSleepSlot: function(slot) {
		slot.connect(this.foreground.chestButton, Vec.create(0, 30));
	},
	connectCookCheapSlot: function(slot) {
		slot.connect(this.foreground.fridgeCheapFoodButton, Vec.create(0, 30));
	},
	connectCookExpensiveSlot: function(slot) {
		slot.connect(this.foreground.fridgeExpensiveFoodButton, Vec.create(0, 30));
	},
	connectCookHealthySlot: function(slot) {
		slot.connect(this.foreground.fridgeHealthyFoodButton, Vec.create(0, 30));
	}
});
	