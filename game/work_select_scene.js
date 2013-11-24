'use strict';

var buttonEffects = [
	{ 
		type: 'ChangingFrames', 
		active: {x: 0, y: 0, sx: 64, sy: 64},
		hovered: {x: 64, y: 0, sx: 64, sy: 64},
		pressed: {x: 128, y: 0, sx: 64, sy: 64}
	},
];
var selectionButtonEffects = [
	{ type: 'ChangingSpriteColor', active: 'black', pressed: 'red', hovered: {green: 0.78} },
];

var font = Fonts.inGameMiddle;

var workSelectSceneTemplate = ( function() {
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				size: {x: 824, y: 440},
				anchor: {x: 0, y: 0},
				pos: {x: 100, y: 100},
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/dialog_bg.png',
						size: {x: 824, y: 440},
						pos: {x: 0, y: 0},
						alpha: 0.8,
						z: 100
					},
					okButton: {
						type: 'Button',
						texture: 'data/buttons.png',
						effects: buttonEffects,
						pos: {x: 800, y: 416},
						size: {x: 64, y: 64},
						anchor: {x: 1, y: 1},
						z: 101
					},
					descriptionLabel: {
						type: 'Label',
						text: 'Wie lange willst Du arbeiten?',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 50},
						z: 101
					},
					workAmountLabel: {
						type: 'Label',
						text: '',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 100},
						anchor: {x: 0, y: 0.5},
						z: 101
					},
					additionalInfoLabel: {
						type: 'Label',
						text: '',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 160},
						z: 101
					},
					upButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 200, y: 100},
						anchor: {x: 0, y: 1},
						texture: 'data/arrow_buttons.png',
						sourceRect: {x: 0, y: 0, sx: 16, sy: 16},
						effects: selectionButtonEffects,
						z: 101
					},
					downButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 200, y: 100},
						texture: 'data/arrow_buttons.png',
						sourceRect: {x: 0, y: 16, sx: 16, sy: 16},
						effects: selectionButtonEffects,
						z: 101
					}
				}
			}
		}
	};
})();

function WorkSelectScene() {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(workSelectSceneTemplate);
	
	var background = this.background;
	background.upButton.onClicked = function() {
		self._workAmount += 0.5;
		self._updateWorkAmount();
	};
	background.downButton.onClicked = function() {
		self._workAmount -= 0.5;
		self._updateWorkAmount();
	};
	
	this.handleMouseDown = this.handleMouseUp = this.handleMouseMove = function(event) {
		return true;
	};
	
	this._workAmount = 1;
	this._updateWorkAmount();
}
WorkSelectScene.extends(Scene, {
	_updateWorkAmount: function() {
		var workAmount = this._workAmount;
		if (workAmount > 6) {
			this.background.additionalInfoLabel.text = 'Maximal 6 Std. ohne Pause';
			this._workAmount = workAmount = 6;
		} else if (workAmount < 1) {
			this.background.additionalInfoLabel.text = 'Du musst schon mindestens eine Stunde arbeiten.';
			this._workAmount = workAmount = 1;
		} else {
			this.background.additionalInfoLabel.text = '';
		}
		
		this.background.workAmountLabel.text = workAmount.toFixed(1) + ' Std.';
	},
	get workAmount() {
		return this._workAmount;
	},
	set workAmount(value) {
		this._workAmount = value;
		this._updateWorkAmount();
	},
	set onClose(value) {
		this.background.okButton.onClicked = value;
	}
});
