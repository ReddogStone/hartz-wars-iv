'use strict';

var mapSceneTemplate = ( function() {
	var mapHomeButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'black', pressed: 'red', hovered: {green: 0.47} },
	];
	var font = Fonts.inGameMiddle;
	
	return {
		type: 'Scene',
		children: {
			sprite: {
				type: 'Sprite',
				texture: 'data/map.png',
				size: {x: 800, y: 598},
				anchor: {x: 0.5, y: 0.5},
				pos: {x: 512, y: 320},
				z: 0
			},
			homeButton: {
				type: 'Button',
				effects: mapHomeButtonEffects,
				pos: {x: 462, y: 190},
				z: 1,
				label: {
					text: 'Zuhause',
					font: font
				}
			},
			workButton: {
				type: 'Button',
				effects: mapHomeButtonEffects,
				pos: {x: 550, y: 450},
				z: 1,
				label: {
					text: 'Arbeit',
					font: font
				}
			}
		}
	};
})();

function MapScene() {
	Scene.apply(this);
	
	this.deserialize(mapSceneTemplate);

	this.sprite.handleMouseDown = this.sprite.handleMouseUp = this.sprite.handleMouseMove = function(event) {
		if (this.getLocalRect().containsPoint(event)) { 
			return true;
		}
	};
	
	var button = this.homeButton;
	button.size = Size.clone(button.label.size);
	button = this.workButton;
	button.size = Size.clone(button.label.size);
};
MapScene.extends(Scene, {
	handleMouseDown: function() {
		if (this.onHideMap) {
			this.onHideMap();
		}
		return true;
	},
	handleMouseUp: function() {
		return true;
	},
	handleMouseMove: function() {
		return true;
	},
	set onGoHome(value) {
		this.homeButton.onClicked = value;
	},
	set onGoToWork(value) {
		this.workButton.onClicked = value;
	}
});
