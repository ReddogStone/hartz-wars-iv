'use strict';

var streetSceneTemplate = ( function() {
	var mapHomeButtonEffects = [new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state == ButtonState.ACTIVE) {
				button.label.color = Color.black;
				button.labelOffset = new Point(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = Color.red;
				button.labelOffset = new Point(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = new Color(0, 0.47, 0);
				button.labelOffset = new Point(0, 0);
			}
		})];
		
	var doorButtonEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor(Color.transparentBlack, Color.red, new Color(0, 0.47, 0)),
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
				button.label.color = Color.white;
				button.labelOffset = new Point(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = Color.red;
				button.labelOffset = new Point(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = new Color(0, 0.47, 0);
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
						texture: 'data/street_bg.png',
						size: {x: 1024, y: 640}
					}
				}
			},
			foreground: {
				type: 'Scene',
				children: {
					playerBody: {
						type: 'Sprite',
						texture: 'data/walk_anim.png',
						size: {x: 180, y: 300},
						sourceRect: {x: 30, y: 30, sx: 100, sy: 200},
						pos: {x: 400, y: 600},
						anchor: {x: 0, y: 1}
					},
					homeDoorButton: {
						type: 'Button',
						size: {x: 150, y: 265},
						texture: 'data/street_home_door_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 730, y: 0},
						label: {
							offset: {x: -150, y: -50},
							text: 'Reingehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					barDoorButton: {
						type: 'Button',
						size: {x: 82, y: 150},
						texture: 'data/street_bar_door_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 82, y: 0},
						label: {
							offset: {x: 130, y: 65},
							text: 'Reingehen',
							font: {family: 'Comic Sans MS', size: 24, weight: 900},
							z: 10
						}
					},
					toSupermarketButton: {
						type: 'Button',
						size: {x: 52, y: 640},
						texture: 'data/street_to_supermarket_highlight.png',
						effects: doorButtonEffects,
						pos: {x: 0, y: 0},
						label: {
							offset: {x: 40, y: 100},
							anchor: {x: 0, y: 0.5},
							text: 'Zum Supermarkt',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					},
					mapButton: {
						type: 'Button',
						pos: {x: 20, y: 620},
						anchor: {x: 0, y: 1},
						effects: mapButtonEffects,
						label: {
							text: 'Karte',
							font: {family: 'Comic Sans MS', size: 24, weight: 900}
						}
					}
				}
			},
			mapOverlay: {
				type: 'Scene',
				children: {
					sprite: {
						type: 'Sprite',
						texture: 'data/map.png',
						size: {x: 800, y: 598},
						anchor: {x: 0.5, y: 0.5},
						pos: {x: 512, y: 320},
					},
					homeButton: {
						type: 'Button',
						effects: mapHomeButtonEffects,
						pos: {x: 462, y: 190},
						label: {
							text: 'Zuhause',
							font: {family: 'Comic Sans MS', size: 16, weight: 900}
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
	animation.addFrame(new Rect(0, 0, 150, 250));
	animation.addFrame(new Rect(150, 0, 150, 250));
	animation.addFrame(new Rect(300, 0, 150, 250));
	animation.addFrame(new Rect(450, 0, 150, 250));
	sprite.addAction(animation);
	this.playerBody = sprite;
	foreground.homeDoorButton.onClicked = function() { 
		if (self.onEnterHome) { self.onEnterHome(); }
	};
	foreground.barDoorButton.onClicked = function() { 
		if (self.onEnterBar) { self.onEnterBar(); }
	};
	foreground.toSupermarketButton.onClicked = function() { 
		if (self.onExitToSupermarket) { self.onExitToSupermarket(); }
	};
	button = foreground.mapButton;
	button.size = Size.clone(button.label.size);
	button.onClicked = function() { 
		self.activateMap();
	};
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
