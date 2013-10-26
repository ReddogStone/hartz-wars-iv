'use strict';

var dialogSceneTemplate = ( function() {
	var highlightEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'black', pressed: 'red', hovered: {green: 0.78} },
	];
	var font = Fonts.inGameMiddle;
	
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Sprite',
				texture: 'data/dialog_bg.png',
				size: {x: 824, y: 440},
				pos: {x: 100, y: 100},
				alpha: 0.8,
				z: 100
			},
			mainText: {
				type: 'Label',
				pos: {x: 50, y: 50},
				z: 101,
				font: font
			},
			exitButton: {
				type: 'Button',
				effects: highlightEffects,
				pos: {x: 904, y: 520},
				anchor: {x: 1, y: 1},
				z: 101,
				label: {
					text: 'Auflegen',
					font: font
				}
			},
			dialogScene: {
				type: 'Scene'
			}
		}
	};
})();

function DialogScene() {
	var self = this;
	Scene.apply(this);
	
	this.lines = [];

	this.deserialize(dialogSceneTemplate);
	
	this.handleMouseDown = this.handleMouseUp = this.handleMouseMove = function(event) {
		return true;
	};
	
	this.exitButton.size = this.exitButton.label.size;
}
DialogScene.extends(Scene, {
	_showLines: function() {
		var yBorder = 10;
		var lines = this.lines;
		var labels = [];
		var totalHeight = 0;
		var maxHeight = 300;
		for (var i = lines.length - 1; i >= 0; --i) {
			var line = lines[i];
			var amISpeaker = (line.speaker == 'self');
			var label = new Label(line.text, Fonts.inGameMiddle, amISpeaker ? 'black' : 'blue');
			totalHeight += label.size.y + yBorder;
			if (totalHeight > maxHeight) {
				break;
			}
			label.anchor = amISpeaker ? new Size(0, 0) : new Size(1, 0);
			label.z = 101;
			labels.unshift({amISpeaker: amISpeaker, label: label});
		}
		
		this.dialogScene.clearChildren();
		
		var background = this.background;
		var bgPos = background.pos;
		var bgSize = background.size;
		var yPos = bgPos.y + 20;
		var left = bgPos.x + 20;
		var right = bgPos.x + bgSize.x - 20;
		labels.forEach(function(element, index) {
			var label = element.label;
			var amISpeaker = element.amISpeaker;
			label.pos = new Pos(amISpeaker ? left : right, yPos);
			yPos += label.size.y + yBorder;
			this.dialogScene.addChild(label);
		}, this);
	},
	set onExit(value) {
		this.exitButton.onClicked = value;
	},
	addMyLine: function(text) {
		this.lines.push({speaker: 'self', text: text});
		this._showLines();
	},
	addTheirLine: function(text) {
		this.lines.push({speaker: 'other', text: text});
		this._showLines();
	}
});
