'use strict';

var TRANSITION_TIME = 1;

var Layers = {
	MAIN_SCENE: 0,
	MAP_SCENE: 1,
	UI_SCENE: 2,
	OVERLAY: 3
};

function GameController() {
}

GameController.extends(Object, {
	_updatePlayerValues: function(player, scene) {
		var uiScene = this.uiScene;
		uiScene.energyProgress.progress = player.energy * 0.01;
		uiScene.saturationProgress.progress = player.saturation * 0.01;
		uiScene.funProgress.progress = player.fun * 0.01;
		uiScene.energyProgress.numberLabel.text = Math.ceil(player.energy);
		uiScene.saturationProgress.numberLabel.text = Math.ceil(player.saturation);
		uiScene.funProgress.numberLabel.text = Math.ceil(player.fun);
		if (scene.playerBody) {
			scene.playerBody.colorBody.alpha = player.fun * 0.01;
		}
		uiScene.moneyAmountLabel.text = player.money.toFixed(2) + ' EURO';
	},
	get rootScene() {
		return this.layerDirector.getLayerScene(Layers.MAIN_SCENE);
	},
	set rootScene(value) {
		this.layerDirector.setLayerScene(Layers.MAIN_SCENE, value);
	},
	get overlay() {
		return this.layerDirector.getLayerScene(Layers.OVERLAY);
	},
	set overlay(value) {
		this.layerDirector.setLayerScene(Layers.OVERLAY, value);
	},
	transitToScene: function(scene, onEnter, onFinished) {
		var self = this;
		return function() {
			self.hideMap();
			var args = arguments;

			var transition = new TransitionScene(TRANSITION_TIME, self.rootScene, scene, 
				function() {
					self._updatePlayerValues(self.world.player, scene);
					scene.init();
					if (onEnter) {
						onEnter.apply(scene, args);
					}
				},
				function() {
					self.controller = null;
					self.rootScene = scene;
					if (onFinished) {
						onFinished.apply(scene, args);
					}
				});
			self.rootScene = transition;
			transition.init();
		};
	},
	transitToController: function(controller, onEnter, onFinished) {
		var self = this;
		return function() {
			self.hideMap();
			var args = arguments;
			
			var transition = new TransitionScene(TRANSITION_TIME, self.rootScene, controller.scene, 
				function() {
					self._updatePlayerValues(self.world.player, controller.scene);
					controller.init();
					if (onEnter) {
						onEnter.apply(controller, args);
					}					
				},
				function() {
					self.controller = controller;
					self.rootScene = controller.scene;
					if (onFinished) {
						onFinished.apply(controller, args);
					}
				});
			self.rootScene = transition;
			transition.init();
		};
	},
	_showPlayerTempMessages: function(messages) {
		var rootScene = this.rootScene;
		if (rootScene) {
			if (rootScene.playerBody) {
				var playerBody = rootScene.playerBody;
				var playerBB = playerBody.getBoundingBox();
				var pos = new Pos(playerBB.x + playerBB.sx * 0.5, playerBB.y);
				this.showTempMessages(messages, pos);
			}
		}
	},
	_newController: function(type, world) {
		var result = new type(world);
		var self = this;
		result.messenger = {
			showMessage: function(message, callback) { 
				self.showMessage(message, callback); 
			},
			showPlayerTempMessages: function(messages) { 
				self._showPlayerTempMessages(messages);
			}
		};
		result.restartGame = function() { self.initMainGame(self.canvas); };
		result.showOverlay = function(overlay, callback) { self.showOverlay(overlay, callback); };
		return result;
	},
	_createBuyMealSlot: function(meal, price) {
		var self = this;
		var showPlayerMessages = function(messages) {
			self._showPlayerTempMessages(messages);
		};
		return new ActivitySlot(this.world, this.barScene, showPlayerMessages, function() {
			return new BuyAndConsumeMealActivity(meal, price);
		});
	},
	_restartGame: function() {
		this.initMainGame(this.canvas);
	},
	_showWorkInfo: function() {
		var workInfoScene = this.workInfoScene;
		var player = this.world.player;
		workInfoScene.setInfo(player.workDescription, player.hoursWorkedToday, player.hoursWorkedThisWeek, player.nextSalary);
		this.showOverlay(workInfoScene);
	},
	initMainGame: function(canvas) {
		var self = this;
		this.canvas = canvas;
		this.camera = new Camera(-canvas.width * 0.5, -canvas.height * 0.5, 0, 1, 1);
		this.mainViewport = new Viewport(new Rect(0, 0, 1024, 640), new Size(1024, 640));
		this.uiViewport = new Viewport(new Rect(0, 640, 1024, 128), new Size(1024, 128));
		
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
		this.workInfoScene = new WorkInfoScene();		
		
		// create controllers
		var roomController = this.roomController = this._newController(RoomController, world);
		var supermarketInsideController = this.supermarketInsideController = this._newController(SupermarketInsideController, world);
		var officeController = this.officeController = this._newController(OfficeController, world);
		
		// setup the layers
		var layerDirector = this.layerDirector = new LayerDirector();
		layerDirector.createLayer(Layers.MAIN_SCENE, this.mainViewport);
		layerDirector.createLayer(Layers.MAP_SCENE, this.mainViewport);
		layerDirector.createLayer(Layers.UI_SCENE, this.uiViewport);
		layerDirector.createLayer(Layers.OVERLAY, this.mainViewport, LayerType.MODAL);
		layerDirector.setLayerScene(Layers.MAP_SCENE, mapScene);
		layerDirector.setLayerScene(Layers.UI_SCENE, uiScene);		
		
		// connect scenes
		roomController.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromRoom);
		roomController.onSleep = this.transitToController(roomController, undefined, function(messages) {
			self._showPlayerTempMessages(messages);
		});
		barScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromBar);
		supermarketOutsideScene.onExitToStreet = this.transitToScene(streetScene, streetScene.enterFromSupermarket);
		supermarketOutsideScene.onEnterSupermarket = this.transitToController(supermarketInsideController, supermarketInsideController.enter);
		supermarketInsideController.onExit = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromSupermarket);
		streetScene.onEnterBar = this.transitToScene(barScene, barScene.enter);
		streetScene.onExitToSupermarket = this.transitToScene(supermarketOutsideScene, supermarketOutsideScene.enterFromStreet);
		streetScene.onEnterHome = this.transitToController(roomController, roomController.enter);
		mapScene.onGoHome = this.transitToController(roomController, roomController.enter);
		mapScene.onGoToWork = this.transitToController(officeController, officeController.enterFromBus);
		
		streetScene.onShowMap = officeController.onShowMap = function() {
			self.showMap();
		}
		mapScene.onHideMap = function() {
			self.hideMap();
		}

		mapScene.visible = false;
		
		// events
		barScene.connectDoenerSlot(this._createBuyMealSlot(DOENER_MEAL, 3.2));
		barScene.connectSausageSlot(this._createBuyMealSlot(SAUSAGE_MEAL, 2.0));
		barScene.connectBurgerSlot(this._createBuyMealSlot(BURGER_MEAL, 5.5));
		barScene.connectBeerSlot(this._createBuyMealSlot(BEER_MEAL, 1.5));
		
		// wire-up UI scene
		uiScene.onWorkInfo = function() {
			self._showWorkInfo();
		};
		
		player.onValueChanged = function(valueName, oldValue, newValue) {
			if (self.rootScene) {
				self._updatePlayerValues(self.world.player, self.rootScene);
			}
		};
		player.energy = 100;
		player.saturation = 100;
		player.fun = 100;
		player.money = 391;
		player.addHoursWorked;
		
		// set internal properties
		this.updatePaused = false;
		this.overlay = null;
		
		// initial transit
		this.transitToController(roomController, function() {
			roomController.enter();
			self.showMessage('Willkommen bei Hartz Wars IV.\n' +
				'\n' +
				'Unten siehst Du deine Lebenslust. Diese darf auf keinen Fall\n' +
				'auf Null fallen, sonst hast Du verloren.\n' +
				'\n' +
				'Um Geld zu verdienen solltest du arbeiten gehen.\n' +
				'Das Gehalt kommt jede Woche.\n' +
				'Drücke unten auf *Arbeit* für mehr Info.\n' +
				'\n' +
				'Viel Spaß beim spielen!');
			this.updatePaused = false;
		})();
		
		this.tempMessageQueue = [];
		uiScene.addAction(new RepeatAction(new SequenceAction(
			new WaitAction(0.5),
			new InstantAction(function() {
				if (self.tempMessageQueue.length <= 0) {
					return;
				}
				var messageEntry = self.tempMessageQueue.shift();
				var message = messageEntry.message;
				var pos = messageEntry.pos;
				var rootScene = self.rootScene;
				var label = new Label(message, Fonts.inGameMiddle, 'white');
				label.anchor = new Pos(0.5, 1);
				label.z = 100;
				
				var endPos = Pos.clone(pos);
				endPos.y -= 100;
				label.addAction(new SequenceAction(
					new ParallelAction(
						new LinearAction(2, function(progress) {
							label.pos = Pos.clone(Vec.lerp(pos, endPos, progress));
						}),
						new EaseOutAction(2, function(progress) {
							label.alpha = 1.0 - progress;
						})
					),
					new InstantAction(function() {
						rootScene.removeChild(label);
					}))
				);
					
				rootScene.addChild(label);
			})
		)));
		
		world.onNewDay = function() {
			var day = world.clock.day;
			if ((day > 0) && (day < 6) && (player.hoursWorkedToday < 4)) {
				player.nextSalary = Math.max(player.nextSalary - 60.0, 0.0);
				self.showMessage('Du hast gestern weniger als 4 Stunden gearbeitet.\n' +
					'Zur Strafe bekommst Du nächstes Mal 60 EURO weniger!\n' +
					'\n' +
					GameUtils.randomSelect('Wir werden dir außerdem immer Salz in den Kaffee beimischen.', 
						'Und dein Chef wird dich frühs immer als erstes anschreien.', 
						'Vorsicht, deine Probezeit läuft noch!'));
			}
		};
		world.onNewWeek = function() {
			if (player.hoursWorkedThisWeek < 40) {
				player.nextSalary = Math.max(player.nextSalary - 60.0, 0.0);
				self.showMessage('Du hast letzte Woche weniger als 40 Stunden gearbeitet.\n' +
					'Zur Strafe bekommst Du 60 EURO weniger!\n' +
					'\n' +
					GameUtils.randomSelect('Andere rackern sich ab und du drehst Däumchen?', 
						'Wie wär\'s mal mit Verantwortung?', 
						'Ja, es ist uns egal, dass dein Hamster krank war.'));
			}
		};
	},
	_updateScene: function(delta, scene) {
		if (!scene) {
			return;
		}
		scene.update(delta);
	},	
	update: function(delta) {
		var self = this;
		this.layerDirector.update(delta);
		
		if (!this.updatePaused) {
			var world = this.world;
			var clock = world.clock;
			var day = clock.day;
			
			var messages = Activity.perform(new RegularActivity(delta / 6), world);
			this._showPlayerTempMessages(messages);
		
			if (this.world.player.fun <= 0) {
				this.showMessage('Du hast verloren!\n\n' +
					'Du bist nur noch ein graues Rädchen in einer grauen Welt\n' +
					'und deine Existenz ist nicht mehr von Belang.', 
				function() {
					self._restartGame();
				});
			}
			
			if (this.controller && this.controller.update) {
				this.controller.update(delta);
			}
		}
	},
	render: function(context) {
		this.layerDirector.updateRenderList();
		this.layerDirector.render(context);
	},
	handleMouseEvent: function(type, mouse) {
		this.layerDirector.handleMouseEvent(type, mouse);
	},
	showMap: function() {
		var map = this.mapScene;
		map.visible = true;
		map.addAction(new EaseOutAction(0.2, function(value) {
			map.scale.x = value;
			map.scale.y = value;
			map.pos.rot = value * 2 * Math.PI;
			map.sprite.alpha = value;
		}));
	},
	hideMap: function() {
		this.mapScene.visible = false;
	},
	showOverlay: function(overlay, callback) {
		var self = this;
		overlay.handleMouseDown = overlay.handleMouseUp = overlay.handleMouseMove = function() {
			return true;
		}
		this.updatePaused = true;
		this.overlay = overlay;
		
		overlay.addAction(new EaseOutAction(0.2, function(progress) {
			progress = 0.99 * progress + 0.01;
			overlay.scale.x = progress;
			overlay.scale.y = progress;
		}));
		overlay.onConfirm = function() {
			if (callback) {
				callback();
			}
			self.updatePaused = false;
			self.overlay = null;
		};
		overlay.onCancel = function() {
			self.updatePaused = false;
			self.overlay = null;
		};
	},
	showMessage: function(message, callback) {
		var self = this;
		var messageScene = new MessageScene(message);
		this.updatePaused = true;
		this.overlay = messageScene;
		
		messageScene.addAction(new EaseOutAction(0.2, function(progress) {
			progress = 0.99 * progress + 0.01;
			messageScene.scale.x = progress;
			messageScene.scale.y = progress;
		}));
		messageScene.onOK = function() {
			if (callback) {
				callback();
			}
			self.updatePaused = false;
			self.overlay = null;
		};
	},
	showTempMessages: function(messages, pos) {
		messages.forEach(function(message) {
			this.tempMessageQueue.push({message: message, pos: pos});
		}, this);
	}
});
