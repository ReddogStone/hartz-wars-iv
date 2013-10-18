'use strict';

function GameController(canvas) {
}

GameController.extends(Object, {
	transitToScene: function(scene, func) {
		var self = this;
		return function() {
			if (func) {
				func.call(scene);
			}
			self.rootScene = scene;
			scene.init();
		};
	},
	transitToController: function(controller, func) {
		var self = this;
		return function() {
			if (func) {
				func.call(controller);
			}
			self.rootScene = controller.scene;
			controller.init();
		};		
	},
	initMainGame: function(canvas) {
		this.camera = new Camera(-canvas.width * 0.5, -canvas.height * 0.5, 0, 1, 1);
		this.mainViewport = new Viewport(new Rect(0, 0, 1024, 640), new Size(1024, 640));
		this.uiViewport = new Viewport(new Rect(0, 640, 1024, 128), new Size(1024, 128));
		
		var world = this.world = new World();
		var player = world.player;
		var supermarket = world.supermarket;
		var home = world.playerHome;
		
		// create scenes
		var roomScene = this.roomScene = new RoomScene();
		var barScene = this.barScene = new BarScene();
		var streetScene = this.streetScene = new StreetScene();
		var supermarketOutsideScene = this.supermarketOutsideScene = new SupermarketOutsideScene();
		
		// create controllers
		var supermarketInsideController = this.supermarketInsideController = new SupermarketInsideController(world);
		
		// connect scenes
		roomScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromRoom);
		barScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromBar);
		supermarketOutsideScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromSupermarket);
		supermarketOutsideScene.onEnterSupermarket = this.transitToController(supermarketInsideController);
		supermarketInsideController.onExit = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromSupermarket);
		streetScene.onEnterBar = this.transitToScene(barScene);
		streetScene.onExitToSupermarket = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromStreet);
		var enterHome = this.transitToScene(roomScene);
		streetScene.onEnterHome = function() {
			var products = player.dropAllProducts();
			home.storeProducts(products);
			enterHome();
		};
		
		// events
		roomScene.onSleep = function() {
			player.saturation -= 5;
			player.energy += 5;
		};
		barScene.onEatDoener = function() {
			if (player.money >= 3.2) {
				player.saturation += 10;
				player.money -= 3.2;
			}
		}
		
		// create UI scene
		var uiScene = this.uiScene = new UIScene();
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
		}
		player.energy = 80;
		player.saturation = 75;
		player.fun = 5;
		player.money = 391;
		
		// initial transit
		this.transitToController(supermarketInsideController)();
	},
	update: function(delta) {
		this.rootScene.update(delta);
	},
	render: function(context) {
		this.mainViewport.render(context, this.rootScene);
		this.uiViewport.render(context, this.uiScene);
	},
	handleMouseEvent: function(type, mouse) {
		var rootScene = this.rootScene;
		var transformedEvent = {x: mouse.x, y: mouse.y, down: mouse.down};
		Vec.set(transformedEvent, rootScene.getTransform().inverse().apply(transformedEvent));
		rootScene[type](transformedEvent);
	}
});
