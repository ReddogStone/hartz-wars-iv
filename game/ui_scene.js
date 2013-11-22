'use strict';

var uiSceneTemplate = ( function() {
	var buttonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'white', pressed: 'red', hovered: {green: 0.47} },
	];

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
				text: 'Geld: ',
				font: font,
				color: Color.white,
				pos: {x: 380, y: 10},
				z: 1
			},
			moneyAmountLabel: {
				type: 'Label',
				text: '',
				font: font,
				color: Color.white,
				pos: {x: 480, y: 10},
				z: 1
			},
/*			workedLabel: {
				type: 'Label',
				text: 'Stunden gearbeitet',
				font: font,
				color: Color.white,
				pos: {x: 380, y: 40},
				z: 1
			},
			todayLabel: {
				type: 'Label',
				text: 'Heute:',
				font: font,
				color: Color.white,
				pos: {x: 390, y: 70},
				z: 1
			},
			thisWeekLabel: {
				type: 'Label',
				text: 'Woche:',
				font: font,
				color: Color.white,
				pos: {x: 390, y: 100},
				z: 1
			},
			todayAmountLabel: {
				type: 'Label',
				font: font,
				color: Color.white,
				pos: {x: 480, y: 70},
				z: 1
			},
			thisWeekAmountLabel: {
				type: 'Label',
				font: font,
				color: Color.white,
				pos: {x: 480, y: 100},
				z: 1
			}, */
			saturationProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 95},
				frameColor: {green: 0.56},
				fillColor: {red: 0.44, green: 0.44, blue: 0.5},
				z: 1,
				progress: 1,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Sättigung',
						font: font,
						color: 'white',
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					},
					numberLabel: {
						z: 2,
						type: 'Label',
						text: '100',
						font: font,
						color: 'white',
						pos: {x: 50, y: 15},
						anchor: {x: 0.5, y: 0.5}
					}
				}
			},
			energyProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 60},
				frameColor: {green: 0.56},
				fillColor: {red: 0.6, green: 0.6},
				z: 1,
				progress: 1,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Energie',
						font: font,
						color: 'white',
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					},
					numberLabel: {
						z: 2,
						type: 'Label',
						text: '100',
						font: font,
						color: 'white',
						pos: {x: 50, y: 15},
						anchor: {x: 0.5, y: 0.5}
					}
				}
			},
			funProgress: {
				type: 'Progress',
				size: {x: 150, y: 45},
				texture: 'data/progress.png',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 10},
				frameColor: {green: 0.56},
				fillColor: {red: 0.5},
				z: 1,
				progress: 1,
				children: {
					label: {
						z: 2,
						type: 'Label',
						text: 'Lebenslust',
						font: font,
						color: 'white',
						pos: {x: -10, y: 17},
						anchor: {x: 1, y: 0.5}
					},
					numberLabel: {
						z: 2,
						type: 'Label',
						text: '100',
						font: font,
						color: 'white',
						pos: {x: 75, y: 22.5},
						anchor: {x: 0.5, y: 0.5}
					}
				}
			},
			workInfoButton: {
				type: 'Button',
				pos: {x: 380, y: 40},
				z: 1,
				effects: buttonEffects,
				label: {
					font: font,
					color: Color.white,
					text: '*Arbeit*'
				}				
			}			
		}
	};
})();

function UIScene() {
	var self = this;
	Scene.apply(this);

	this.deserialize(uiSceneTemplate);
	this.workInfoButton.size = Size.clone(this.workInfoButton.label.size);
}
UIScene.extends(Scene, {
	set onWorkInfo(value) {
		this.workInfoButton.onClicked = value;
	}
});