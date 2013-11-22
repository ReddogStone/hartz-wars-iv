'use strict';

var buttonEffects = [
	{ 
		type: 'ChangingFrames', 
		active: {x: 0, y: 0, sx: 64, sy: 64},
		hovered: {x: 64, y: 0, sx: 64, sy: 64},
		pressed: {x: 128, y: 0, sx: 64, sy: 64}
	},
];
var font = Fonts.inGameMiddle;

var workInfoSceneTemplate = ( function() {
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
						text: 'Stunden gearbeitet',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 50},
						z: 101
					},
					workedLabel: {
						type: 'Label',
						text: 'Stunden gearbeitet',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 150},
						z: 101
					},
					todayLabel: {
						type: 'Label',
						text: 'Heute:',
						font: font,
						color: Color.black,
						pos: {x: 100, y: 190},
						z: 101
					},
					thisWeekLabel: {
						type: 'Label',
						text: 'Woche:',
						font: font,
						color: Color.black,
						pos: {x: 100, y: 220},
						z: 101
					},
					todayAmountLabel: {
						type: 'Label',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 190},
						z: 101
					},
					thisWeekAmountLabel: {
						type: 'Label',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 220},
						z: 101
					},
					nextSalaryLabel: {
						type: 'Label',
						text: 'Nächstes Gehalt',
						font: font,
						color: Color.black,
						pos: {x: 50, y: 280},
						z: 101
					},
					nextSalaryAmountLabel: {
						type: 'Label',
						font: font,
						color: Color.black,
						pos: {x: 250, y: 280},
						z: 101
					}
				}
			}
		}
	};
})();

function WorkInfoScene() {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(workInfoSceneTemplate);
	
	this.handleMouseDown = this.handleMouseUp = this.handleMouseMove = function(event) {
		return true;
	};
}
WorkInfoScene.extends(Scene, {
	set onClose(value) {
		this.background.okButton.onClicked = value;
	},
	setInfo: function(description, workedToday, workedThisWeek, nextSalary) {
		var background = this.background;
		background.descriptionLabel.text = description;
		background.todayAmountLabel.text = workedToday.toFixed(1) + ' Std.';
		background.thisWeekAmountLabel.text = workedThisWeek.toFixed(1) + ' Std.';
		background.nextSalaryAmountLabel.text = nextSalary.toFixed(2) + ' EURO';
	}
});
