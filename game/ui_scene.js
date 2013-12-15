'use strict';

var uiSceneTemplate = ( function() {
	var buttonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'white', pressed: 'red', hovered: {green: 0.47} },
	];

	var font = Fonts.inGameSmall;
	
	var left = 10;
	var progressLeft = left + 120;
	var secondColumn = progressLeft + 170;
	
	return {
		type: 'Scene',
		anchor: {x: 0, y: 0},
		pos: {x: 0, y: 640},
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
				pos: {x: secondColumn, y: 10},
				z: 1
			},
			moneyAmountLabel: {
				type: 'Label',
				text: '',
				font: font,
				color: Color.white,
				pos: {x: secondColumn + 70, y: 10},
				z: 1
			},
			saturationProgress: {
				type: 'Progress',
				size: {x: 100, y: 30},
				texture: 'data/progress',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: progressLeft, y: 95},
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
				texture: 'data/progress',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: progressLeft, y: 60},
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
				texture: 'data/progress',
				fillRect: {x: 0, y: 72, sx: 30, sy: 72},
				frameRect: {x: 0, y: 0, sx: 215, sy: 72},
				pos: {x: progressLeft, y: 10},
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
				pos: {x: secondColumn, y: 40},
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

var perkDescriptionTemplate = ( function() {
	var bottomZ = 10;

	return {
		type: 'Node',
		children: {
			background: {
				type: 'Sprite',
				texture: 'data/effect_message_bg',
				size: {x: 231, y: 108},
				z: bottomZ,
				alpha: 0.8
			},
			titleLabel: {
				type: 'Label',
				pos: {x: middle, y: top},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: 'Title',
				color: 'black',
				font: font
			},
		}
	};
});

var PERK_SIZE = 50;
var PERK_TITLE_OFFSET = -10;

function UIScene() {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(uiSceneTemplate);
	this.workInfoButton.size = Size.clone(this.workInfoButton.label.size);
	
	this.perks = {};
}
UIScene.extends(Scene, {
	_adjustPerkPositions: function() {
		var index = 0;
		var left = 520;
		var top = 30;
		var border = 50;
		
		var perks = this.perks;
		for (var perkTypes in perks) {
			var perk = perks[perkTypes];
			perk.pos = new Pos(left + (PERK_SIZE + border) * index, top);
			++index;
		}
	},
	set onWorkInfo(value) {
		this.workInfoButton.onClicked = value;
	},
	addPerk: function(perk) {
		this.removePerk(perk.type);
		
		var perkElement = new Button(new Size(PERK_SIZE, PERK_SIZE));
		var texture = Engine.textureManager.get(perk.textureId);
		if (texture) {
			perkElement.texture = Texture.clone(texture);
		}
		perkElement.label.text = perk.title;
		perkElement.label.font = Fonts.inGameSmall;
		perkElement.label.color = 'white';
		perkElement.label.anchor = new Size(0.5, 1);
		perkElement.labelOffset = new Pos(0, -0.5 * PERK_SIZE + PERK_TITLE_OFFSET);
		perkElement.z = 1;
		perkElement.addEffect(createFromTemplate({ type: 'ChangingLabelColor', active: 'white', hovered: {green: 1.0} }));
		this.perks[perk.type.name] = perkElement;
		
		this.background.addChild(perkElement);
		
		this._adjustPerkPositions();
	},
	removePerk: function(perkType) {
		this.background.removeChild(this.perks[perkType.name]);
		delete this.perks[perkType.name];
	}
});