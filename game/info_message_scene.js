'use strict';

var infoMessageTemplate = ( function() {
	var middle = 120;
	var top = 10;
	var step = 23;
	var right = middle + 50;
	var font = Fonts.inGameSmall;
	var bottomZ = 200;
	
	return {
		type: 'Scene',
		pos: {x: 0, y: 0},
		anchor: {x: 0.5, y: 0},
		size: {x: 231, y: 108},
		children: {
			background: {
				type: 'Sprite',
				texture: 'data/effect_message_bg.png',
				size: {x: 231, y: 108},
				z: bottomZ,
				alpha: 0.8
			},
			funLabel: {
				type: 'Label',
				pos: {x: middle, y: top},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: 'Lebenslust:',
				color: 'black',
				font: font
			},
			funAmountLabel: {
				type: 'Label',
				pos: {x: right, y: top},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: '-',
				color: 'black',
				font: font
			},
			energyLabel: {
				type: 'Label',
				pos: {x: middle, y: top + step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: 'Energie:',
				color: 'black',
				font: font
			},
			energyAmountLabel: {
				type: 'Label',
				pos: {x: right, y: top + step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: '-',
				color: 'black',
				font: font
			},
			saturationLabel: {
				type: 'Label',
				pos: {x: middle, y: top + 2 * step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: 'Sättigung:',
				color: 'black',
				font: font
			},
			saturationAmountLabel: {
				type: 'Label',
				pos: {x: right, y: top + 2 * step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: '-',
				color: 'black',
				font: font
			},
			moneyLabel: {
				type: 'Label',
				pos: {x: middle, y: top + 3 * step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: 'Geld:',
				color: 'black',
				font: font
			},
			moneyAmountLabel: {
				type: 'Label',
				pos: {x: right, y: top + 3 * step},
				z: bottomZ + 1,
				anchor: {x: 1, y: 0},
				text: '-',
				color: 'black',
				font: font
			}
		}
	};
})();

function InfoMessageScene(consequences) {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(infoMessageTemplate);
	
	this._setInfo(consequences);
}
InfoMessageScene.extends(Scene, {
	_setInfo: function(consequences) {
		this.funAmountLabel.text = consequences.fun ? numberToStringWithSign(consequences.fun.toFixed(0)) : '--';
		this.energyAmountLabel.text = consequences.energy ? numberToStringWithSign(consequences.energy.toFixed(0)) : '--';
		this.saturationAmountLabel.text = consequences.saturation ? numberToStringWithSign(consequences.saturation.toFixed(0)) : '--';
		this.moneyAmountLabel.text = consequences.money ? numberToStringWithSign(consequences.money.toFixed(2)) : '--';
	}
});
