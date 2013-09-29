'use strict';

var streetSceneTemplate = ( function() {
	var playerImg = new Image(); playerImg.src = 'data/walk_anim.png';
	var bgImg = new Image(); bgImg.src = 'data/street_bg.png';
	var homeDoorHighlightImg = new Image();	homeDoorHighlightImg.src = 'data/street_home_door_highlight.png';
	var mapImg = new Image(); mapImg.src = 'data/map.png';

	var mapHomeButtonEffects = [new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state == ButtonState.ACTIVE) {
				button.label.color = 'rgba(0,0,0,1)';
				button.labelOffset = new Point(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = 'rgba(255,0,0,1)';
				button.labelOffset = new Point(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = 'rgba(0,120,0,1)';
				button.labelOffset = new Point(0, 0);
			}
		})];
		
	var homeDoorButtonEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor('rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgba(0,120,0,1)'),
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state != ButtonState.ACTIVE) {
				button.sprite.blend = 'lighter';
			} else {
				button.sprite.blend = 'source-over';
			}
		})];
		
	var mapButtonEffects = [new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state == ButtonState.ACTIVE) {
				button.label.color = 'rgba(255,255,255,1)';
				button.labelOffset = new Point(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = 'rgba(255,0,0,1)';
				button.labelOffset = new Point(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = 'rgba(0,120,0,1)';
				button.labelOffset = new Point(0, 0);
			}
		})];
	
	return {
		type: 'Scene',
		children: {
			background: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: bgImg,
						size: {x: 1024, y: 640}
					}
				}
			},
			foreground: {
				type: 'Scene',
				children: {
					playerBody: {
						type: 'Sprite',
						texture: playerImg,
						size: {x: 150, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 400, y: 600},
						anchor: {x: 0, y: 1}
					},
					homeDoorButton: {
						type: 'Button',
						size: {x: 150, y: 265},
						texture: homeDoorHighlightImg,
						effects: homeDoorButtonEffects,
						pos: {x: 730, y: 0},
						label: {
							offset: {x: -150, y: -50},
							text: 'Reingehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900, style: 'italic'}
						}
					},
					mapButton: {
						type: 'Button',
						pos: {x: 20, y: 748},
						anchor: {x: 0, y: 1},
						effects: mapButtonEffects,
						label: {
							text: 'Karte',
							font: {family: 'Comic Sans MS', size: 24, weight: 900, style: 'italic'}
						}
					}
				}
			},
			mapOverlay: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: mapImg,
						size: {x: 800, y: 598},
						anchor: {x: 0.5, y: 0.5},
						pos: {x: 512, y: 384},
					},
					homeButton: {
						type: 'Button',
						effects: mapHomeButtonEffects,
						pos: {x: 462, y: 254},
						label: {
							text: 'Zuhause',
							font: {family: 'Comic Sans MS', size: 16, weight: 900, style: 'italic'}
						}
					}
				}
			}
		}
	};
})();

function StreetScene() {
	var self = this;
	Scene.apply(this);
	
	Node.loadFromTemplate(streetSceneTemplate, this);

	// MAP OVERLAY
	var mapOverlay = this.mapOverlay;
	mapOverlay.handleMouseDown = function(event) {
		self.deactivateMap();
		return true;
	}
	mapOverlay.handleMouseUp = mapOverlay.handleMouseMove =function(event) {
		return true; 
	};
	var sprite = mapOverlay.sprite;
	sprite.handleMouseDown = sprite.handleMouseUp = sprite.handleMouseMove = function(event) {
		if (this.getLocalRect().containsPoint(event)) { 
			return true; 
		}
	};
	var button = mapOverlay.homeButton;
	button.size = Size.clone(button.label.size);
	button.onClicked = function() {
		if (self.onEnterHome) self.onEnterHome();
		mapOverlay.visible = false;
	};
	
	// FOREGROUND
	var foreground = this.foreground;
	sprite = foreground.playerBody;
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	button = foreground.homeDoorButton;
	button.onClicked = function() { 
		if (self.onEnterHome) self.onEnterHome(); 
	};
	button = foreground.mapButton;
	button.onClicked = function() { 
		self.activateMap();
	};
	button.size = Size.clone(button.label.size);
};
StreetScene.extends(Scene, {
	initSelf: function() {
		this.deactivateMap();
	},
	activateMap: function() {
		var map = this.mapOverlay;
		map.visible = true;
		map.addAction(new LinearAction(0.2, function(value) {	
			map.scale.x = value;
			map.scale.y = value;
			map.pos.rot = value * 2 * Math.PI;
			map.color = 'rgba(255,255,255,' + value + ')';
		}));
		
//		map.pos.rot = 0.5;
	},
	deactivateMap: function() {
		this.mapOverlay.visible = false;
	}
});
