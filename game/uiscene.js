'use strict';

var uiSceneTemplate = ( function() {
	var progressImg = new Image(); progressImg.src = 'data/progress.png';
	
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Sprite',
				size: {x: 1024, y: 128},
				pos: {x: 0, y: 640},
				color: {green: 0.25},
			},
			moneyLabel: {
				type: 'Label',
				anchor: {x: 1, y: 0},
				text: 'Geld: ',
				font: {family: 'Comic Sans MS', size: 14, weight: 900},
				color: Color.white,
				pos: {x: 450, y: 650}
			},
			moneyAmountLabel: {
				type: 'Label',
				text: '100€',
				font: {family: 'Comic Sans MS', size: 14, weight: 900},
				color: Color.white,
				pos: {x: 450, y: 650}
			},
			saturationProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: progressImg,
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 650},
				frameColor: {green: 0.56},
				fillColor: {red: 0.5},
				progress: 0.5,
				children: {
					label: {
						type: 'Label',
						text: 'Sättigung',
						font: {family: 'Comic Sans MS', size: 14, weight: 900},
						color: Color.white,
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					}
				}
			},
			energyProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: progressImg,
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 690},
				frameColor: {green: 0.56},
				fillColor: {red: 1, green: 1},
				progress: 0.5,
				children: {
					label: {
						type: 'Label',
						text: 'Energie',
						font: {family: 'Comic Sans MS', size: 14, weight: 900},
						color: {red: 1, green: 1, blue: 1},
						pos: {x: -10, y: 12},
						anchor: {x: 1, y: 0.5}
					}
				}
			},
			funProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: progressImg,
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: 200, y: 730},
				frameColor: {green: 0.56},
				fillColor: {red: 0.44, green: 0.44, blue: 0.5},
				progress: 0.5,
				children: {
					label: {
						type: 'Label',
						text: 'Lebenslust',
						font: {family: 'Comic Sans MS', size: 14, weight: 900},
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

	Node.loadFromTemplate(uiSceneTemplate, this);
	var foreground = this.foreground;
}
UIScene.extends(Scene);