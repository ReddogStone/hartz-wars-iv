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

var messageSceneTemplate = ( function() {
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Node',
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
						effects: buttonEffects,
						pos: {x: 800, y: 416},
						size: {x: 64, y: 64},
						anchor: {x: 1, y: 1},
						z: 101
					},
					messageNode: {
						type: 'Node',
						pos: {x: 20, y: 20},
						size: {x: 804, y: 420}
					}
				}
			}
		}
	};
})();

function MessageScene(message) {
	var self = this;
	Scene.apply(this);
	
	this.deserialize(messageSceneTemplate);
	
	this.handleMouseDown = this.handleMouseUp = this.handleMouseMove = function(event) {
		return true;
	};
	
	this._initLines(message);
}
MessageScene.extends(Scene, {
	_initLines: function(message) {
		var yBorder = 10;
		var lines = message.split(/\r\n|[\r\n]/);
		var labels = [];
		var totalHeight = 0;
		var maxHeight = 420;
		lines.some(function(line) {
			var label = new Label(line, font, 'black');
			totalHeight += label.size.y + yBorder;
			if (totalHeight > maxHeight) {
				return true;
			}
			label.z = 101;
			labels.push(label);
		});
		
		var messageNode = this.background.messageNode;
		messageNode.clearChildren();
		
		var yPos = 20;
		var left = 20;
		labels.forEach(function(label) {
			label.pos = new Pos(left, yPos);
			yPos += label.size.y + yBorder;
			messageNode.addChild(label);
		}, this);
	},
	set onOK(value) {
		this.background.okButton.onClicked = value;
	}
});
