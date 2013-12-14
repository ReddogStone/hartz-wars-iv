'use strict';

var okButtonEffects = [
	{ 
		type: 'ChangingFrames', 
		active: {x: 0, y: 0, sx: 64, sy: 64},
		hovered: {x: 64, y: 0, sx: 64, sy: 64},
		pressed: {x: 128, y: 0, sx: 64, sy: 64}
	},
];
var cancelButtonEffects = [
	{ 
		type: 'ChangingFrames', 
		active: {x: 0, y: 64, sx: 64, sy: 128},
		hovered: {x: 64, y: 64, sx: 64, sy: 128},
		pressed: {x: 128, y: 64, sx: 64, sy: 128}
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
						texture: 'data/dialog_bg',
						size: {x: 824, y: 440},
						pos: {x: 0, y: 0},
						alpha: 0.8,
						z: 100
					},
					okButton: {
						type: 'Button',
						texture: 'data/buttons',
						effects: okButtonEffects,
						pos: {x: 800, y: 416},
						size: {x: 64, y: 64},
						anchor: {x: 1, y: 1},
						z: 101
					},
					cancelButton: {
						type: 'Button',
						texture: 'data/buttons',
						effects: cancelButtonEffects,
						pos: {x: 720, y: 416},
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
						pos: {x: 50, y: 140},
						z: 101
					},
					upButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 200, y: 100},
						anchor: {x: 0, y: 1},
						texture: 'data/arrow_up',
						sourceRect: {x: 0, y: 0, sx: 16, sy: 16},
						effects: selectionButtonEffects,
						z: 101
					},
					downButton: {
						type: 'Button',
						size: {x: 16, y: 16},
						pos: {x: 200, y: 100},
						texture: 'data/arrow_down',
						sourceRect: {x: 0, y: 16, sx: 16, sy: 16},
						effects: selectionButtonEffects,
						z: 101
					},
					funLabel: {
						type: 'Label',
						text: 'Lebenslust:',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 200},
						z: 101
					},
					energyLabel: {
						type: 'Label',
						text: 'Energie:',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 240},
						z: 101
					},
					saturationLabel: {
						type: 'Label',
						text: 'Sättigung:',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 280},
						z: 101
					},
					additionalEffectLabel: {
						type: 'Label',
						text: '',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 320},
						z: 101
					},
					funAmountLabel: {
						type: 'Label',
						text: 'Lebenslust:',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 200},
						anchor: {x: 1, y: 0},
						z: 101
					},
					energyAmountLabel: {
						type: 'Label',
						text: 'Energie:',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 240},
						anchor: {x: 1, y: 0},
						z: 101
					},
					saturationAmountLabel: {
						type: 'Label',
						text: 'Sättigung:',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 280},
						anchor: {x: 1, y: 0},
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
	
	this.handleMouseDown = this.handleMouseUp = this.handleMouseMove = function(event) {
		return true;
	};
	
	this._workAmount = 1;
	this._updateWorkAmount();
}
WorkSelectScene.extends(Scene, {
	_updateWorkAmount: function() {
		var workAmount = this._workAmount;
		this.background.workAmountLabel.text = workAmount.toFixed(1) + ' Std.';
	},
	setInfo: function(consequences) {
		var background = this.background;
		background.funAmountLabel.text = consequences.fun ? numberToStringWithSign(consequences.fun.toFixed(0)) : '--';
		background.energyAmountLabel.text = consequences.energy ? numberToStringWithSign(consequences.energy.toFixed(0)) : '--';
		background.saturationAmountLabel.text = consequences.saturation ? numberToStringWithSign(consequences.saturation.toFixed(0)) : '--';
		background.additionalEffectLabel.text = consequences.messages.join(',');
	},
	get workAmount() {
		return this._workAmount;
	},
	set workAmount(value) {
		this._workAmount = value;
		this._updateWorkAmount();
	},
	set additionalInformation(value) {
		this.background.additionalInfoLabel.text = value;
	},
	set onConfirm(value) {
		this.background.okButton.onClicked = value;
	},
	set onCancel(value) {
		this.background.cancelButton.onClicked = value;
	},
	set onIncreaseWorkAmount(value) {
		this.background.upButton.onClicked = value;
	},
	set onDecreaseWorkAmount(value) {
		this.background.downButton.onClicked = value;
	}
});
