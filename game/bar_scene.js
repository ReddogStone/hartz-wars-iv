'use strict';

var barSceneTemplate = ( function() {
	var roomDoorEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: 'red', hovered: {green: 0.78} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];

	var foodButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingSpriteColor', pressed: {red: 0.39, green: 1, blue: 0.39}, hovered: 'white' },
		{ type: 'ChangingLabelColor', active: {alpha: 0}, pressed: {red: 0.39, green: 1, blue: 0.39}, hovered: 'white' },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'source-over', hovered: 'source-over' }
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
						texture: 'data/bar_bg.png',
						size: {x: 1024, y: 640},
						z: 0
					}
				}
			},
			foreground: {
				type: 'Scene',
				children: {
					doorButton: {
						type: 'Button',
						size: {x: 80, y: 570},
						texture: 'data/bar_door_highlight.png',
						effects: roomDoorEffects,
						pos: {x: 0, y: 23},
						z: 1,
						label: {
							offset: {x: 50, y: 310},
							text: 'Rausgehen',
							font: font,
							z: 3
						}
					},
					doenerButton: {
						type: 'Button',
						size: {x: 160, y: 90},
						texture: 'data/doener.png',
						effects: foodButtonEffects,
						pos: {x: 205, y: 50},
						z: 1,
						label: {
							offset: {x: 0, y: 100},
							text: 'Döner - 3,20 EURO',
							font: font,
							z: 3
						}
					},
					sausageButton: {
						type: 'Button',
						size: {x: 160, y: 90},
						texture: 'data/sausage.png',
						effects: foodButtonEffects,
						pos: {x: 385, y: 50},
						z: 1,
						label: {
							offset: {x: 0, y: 100},
							text: 'Currywurst - 2,00 EURO',
							font: font,
							z: 3
						}
					},
					burgerButton: {
						type: 'Button',
						size: {x: 160, y: 90},
						texture: 'data/burger_menu.png',
						effects: foodButtonEffects,
						pos: {x: 565, y: 50},
						z: 1,
						label: {
							offset: {x: 0, y: 100},
							text: 'Burgermenü - 5,50 EURO',
							font: font,
							z: 3
						}
					},
					beerButton: {
						type: 'Button',
						size: {x: 70, y: 90},
						texture: 'data/beer_bottle.png',
						effects: foodButtonEffects,
						pos: {x: 740, y: 55},
						z: 1,
						label: {
							offset: {x: 0, y: 100},
							text: 'Bier - 1,50 EURO',
							font: font,
							z: 3
						}
					}
				}
			}
		}
	};
})();

function BarScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(barSceneTemplate);

	var playerBody = this.playerBody = new PlayerBody();
	PlayerBody.addToScene(playerBody, this, 2);
}
BarScene.extends(Scene, {
	set onExitToStreet(value) {
		this.foreground.doorButton.onClicked = value;
	},
	set onEatDoener(value) {
		this.foreground.doenerButton.onClicked = value;
	},
	set onEatSausage(value) {
		this.foreground.sausageButton.onClicked = value;
	},
	set onEatBurger(value) {
		this.foreground.burgerButton.onClicked = value;
	},
	set onDrinkBeer(value) {
		this.foreground.beerButton.onClicked = value;
	},
	enter: function() {
		this.playerBody.pos = new Pos(150, 700);
	}
});
	