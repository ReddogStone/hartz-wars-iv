'use strict';

var mapSceneTemplate = ( function() {
	var mapHomeButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'black', pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
	var mapWorkButtonEffects = [
		{ type: 'JumpingLabel', offsetX: 2, offsetY: 2 },
		{ type: 'ChangingLabelColor', active: 'white', pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingSpriteColor', pressed: 'red', hovered: {green: 0.47} },
		{ type: 'ChangingSpriteBlendMode', active: 'destination-over', pressed: 'lighter', hovered: 'lighter' }
	];
	var font = Fonts.inGameMiddle;
	
	return {
		type: 'Scene',
		children: {
			sprite: {
				type: 'Sprite',
				texture: 'data/map_bg',
				size: {x: 800, y: 598},
				anchor: {x: 0.5, y: 0.5},
				pos: {x: 512, y: 320},
				z: 50
			},
			homeTextBg: {
				type: 'Sprite',
				color: 'white',
				pos: {x: 770, y: 267},
				anchor: {x: 0.5, y: 0.5},
				z: 51
			},
			homeButton: {
				type: 'Button',
				size: {x: 70, y: 120},
				texture: 'data/map_selection',
				effects: mapHomeButtonEffects,
				pos: {x: 735, y: 277},
				z: 52,
				label: {
					text: 'Zuhause',
					font: font,
					offset: {x: 0, y: -70}
				}
			},
			workTextBg: {
				type: 'Sprite',
				color: 'white',
				pos: {x: 251, y: 332},
				anchor: {x: 0.5, y: 0.5},
				z: 51
			},
			workButton: {
				type: 'Button',
				size: {x: 70, y: 114},
				texture: 'data/map_selection',
				effects: mapHomeButtonEffects,
				pos: {x: 216, y: 345},
				z: 52,
				label: {
					text: 'Arbeit',
					font: font,
					offset: {x: 0, y: -70}
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
	
	var size = this.homeButton.label.size;
	this.homeTextBg.size = new Size(size.x + 10, size.y + 10);

	var size = this.workButton.label.size;
	this.workTextBg.size = new Size(size.x + 10, size.y + 10);
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
