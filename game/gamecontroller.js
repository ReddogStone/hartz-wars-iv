'use strict';

function GameController() {
}

GameController.extends(Object, {
	transitToScene: function(scene, func) {
		var self = this;
		return function() {
			if (func) {
				func.call(scene);
			}
			self.controller = null;
			self.rootScene.children[0] = scene;
			self.hideMap();
			
			scene.init();
		};
	},
	transitToController: function(controller, func) {
		var self = this;
		return function() {
			if (func) {
				func.call(controller);
			}
			self.controller = controller;
			self.rootScene.children[0] = controller.scene;
			self.hideMap();
			
			controller.init();
		};
	},
	initMainGame: function(canvas) {
		this.camera = new Camera(-canvas.width * 0.5, -canvas.height * 0.5, 0, 1, 1);
		this.mainViewport = new Viewport(new Rect(0, 0, 1024, 640), new Size(1024, 640));
		this.uiViewport = new Viewport(new Rect(0, 640, 1024, 128), new Size(1024, 128));
		
		this.rootScene = new Scene();
		this.controller = null;
		
		var world = this.world = new World();
		var player = world.player;
		var home = world.playerHome;
		
		// create scenes
		var barScene = this.barScene = new BarScene();
		var streetScene = this.streetScene = new StreetScene();
		var supermarketOutsideScene = this.supermarketOutsideScene = new SupermarketOutsideScene();
		var uiScene = this.uiScene = new UIScene();
		var mapScene = this.mapScene = new MapScene();
		
		// create controllers
		var roomController = this.roomController = new RoomController(world);
		var supermarketInsideController = this.supermarketInsideController = new SupermarketInsideController(world);
		
		// connect scenes
		roomController.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromRoom);
		barScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromBar);
		supermarketOutsideScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromSupermarket);
		supermarketOutsideScene.onEnterSupermarket = this.transitToController(supermarketInsideController);
		supermarketInsideController.onExit = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromSupermarket);
		streetScene.onEnterBar = this.transitToScene(barScene);
		streetScene.onExitToSupermarket = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromStreet);
		streetScene.onEnterHome = this.transitToController(roomController, roomController.enter);
		mapScene.onGoHome = this.transitToController(roomController, roomController.enter);
		
		var self = this;
		streetScene.onShowMap = function() {
			self.showMap();
		}
		mapScene.onHideMap = function() {
			self.hideMap();
		}

		mapScene.visible = false;
		
		// events
		barScene.onEatDoener = function() {
			if (player.money >= 3.2) {
				player.saturation += 10;
				player.money -= 3.2;
			}
		};
		
		// wire-up UI scene
		player.onValueChanged = function(valueName, newValue) {
			switch (valueName) {
				case 'energy':
					uiScene.energyProgress.progress = newValue * 0.01;
					break;
				case 'saturation':
					uiScene.saturationProgress.progress = newValue * 0.01;
					break;
				case 'fun':
					uiScene.funProgress.progress = newValue * 0.01;
					break;
				case 'money':
					uiScene.moneyAmountLabel.text = newValue.toFixed(2) + '€';
					break;
			}
		};
		player.energy = 80;
		player.saturation = 75;
		player.fun = 5;
		player.money = 391;
		
		// initial transit
		this.transitToController(roomController)();
	},
	update: function(delta) {
		this.rootScene.update(delta);
	},
	render: function(context) {
		this.mainViewport.render(context, this.rootScene.children[0]);
		this.mainViewport.render(context, this.mapScene);
		this.uiViewport.render(context, this.uiScene);
	},
	handleMouseEvent: function(type, mouse) {
		var rootScene = this.rootScene;
		var transformedEvent = {x: mouse.x, y: mouse.y, down: mouse.down};
		Vec.set(transformedEvent, rootScene.getTransform().inverse().apply(transformedEvent));
		rootScene[type](transformedEvent);
	},
	showMap: function() {
		var map = this.mapScene;
		map.visible = true;
		map.addAction(new LinearAction(0.2, function(value) {	
			map.scale.x = value;
			map.scale.y = value;
			map.pos.rot = value * 2 * Math.PI;
			map.sprite.alpha = value;
		}));
		this.rootScene.children[1] = map;
	},
	hideMap: function() {
		this.mapScene.visible = false;
		this.rootScene.removeChild(self.mapScene);
	}
});
