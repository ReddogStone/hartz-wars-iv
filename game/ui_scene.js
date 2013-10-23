'use strict';

var uiSceneTemplate = ( function() {
	var font = Fonts.inGameSmall;
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Sprite',
				size: {x: 1024, y: 128},
				pos: {x: 0, y: 0},
				scale: {x: 1, y: 1},
				color: {green: 0.25},
				z: 0
			},
			moneyLabel: {
				type: 'Label',
				anchor: {x: 1, y: 0},
				text: 'Geld: ',
				font: font,
				color: Color.white,
				pos: {x: 450, y: 10},
				z: 1
			},
			moneyAmountLabel: {
				type: 'Label',
				text: '100€',
				font: font,
				color: Color.white,
				pos: {x: 450, y: 10},
				z: 1
			},
			saturationProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 10},
				frameColor: {green: 0.56},
				fillColor: {red: 0.5},
				z: 1,
				progress: 0.5,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Sättigung',
						font: font,
						color: Color.white,
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					}
				}
			},
			energyProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 50},
				frameColor: {green: 0.56},
				fillColor: {red: 1, green: 1},
				z: 1,
				progress: 0.5,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Energie',
						font: font,
						color: {red: 1, green: 1, blue: 1},
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					}
				}
			},
			funProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 90},
				frameColor: {green: 0.56},
				fillColor: {red: 0.44, green: 0.44, blue: 0.5},
				z: 1,
				progress: 0.5,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Lebenslust',
						font: font,
						color: {red: 1, green: 1, blue: 1},
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					}
				}
			}
		}
	};
})();

function UIScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(uiSceneTemplate);
	var foreground = this.foreground;
}
UIScene.extends(Scene);