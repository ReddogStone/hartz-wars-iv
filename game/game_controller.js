'use strict';

var TRANSITION_TIME = 1;

function GameController() {
}

GameController.extends(Object, {
	get _mainScene() {
		return this.rootScene.children[0];
	},
	set _mainScene(value) {
		this.rootScene.children[0] = value;
	},
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
		uiScene.todayAmountLabel.text = player.hoursWorkedToday.toFixed(1) + ' Std.';
		uiScene.thisWeekAmountLabel.text = player.hoursWorkedThisWeek.toFixed(1) + ' Std.';
	},
	transitToScene: function(scene, onEnter, onFinished) {
		var self = this;
		return function() {
			self.hideMap();
			var args = arguments;

			var transition = new TransitionScene(TRANSITION_TIME, self._mainScene, scene, 
				function() {
					self._updatePlayerValues(self.world.player, scene);
					scene.init();
					if (onEnter) {
						onEnter.apply(scene, args);
					}
				},
				function() {
					self.controller = null;
					self._mainScene = scene;
					if (onFinished) {
						onFinished.apply(scene, args);
					}
				});
			self._mainScene = transition;
			transition.init();
		};
	},
	transitToController: function(controller, onEnter, onFinished) {
		var self = this;
		return function() {
			self.hideMap();
			var args = arguments;
			
			var transition = new TransitionScene(TRANSITION_TIME, self._mainScene, controller.scene, 
				function() {
					self._updatePlayerValues(self.world.player, controller.scene);
					controller.init();
					if (onEnter) {
						onEnter.apply(controller, args);
					}					
				},
				function() {
					self.controller = controller;
					self._mainScene = controller.scene;
					if (onFinished) {
						onFinished.apply(controller, args);
					}
				});
			self._mainScene = transition;
			transition.init();
		};
	},
	_showPlayerTempMessages: function(messages) {
		if (this._mainScene) {
			if (this._mainScene.playerBody) {
				var playerBody = this._mainScene.playerBody;
				var playerBB = playerBody.getBoundingBox();
				var pos = new Pos(playerBB.x + playerBB.sx * 0.5, playerBB.y);
				this.showTempMessages(messages, pos);
			}
		}
	},
	_newController: function(type, world) {
		var result = new type(world);
		var self = this;
		result.showMessage = function(message, callback) { self.showMessage(message, callback); };
		result.showPlayerTempMessages = function(messages) { 
			self._showPlayerTempMessages(messages);
		};
		result.restartGame = function() { self.initMainGame(self.canvas); };
		return result;
	},
	_buyMeal: function(meal, price) {
		var self = this;
		var world = this.world;
		var player = world.player;
		if (player.money >= price) {
			ControllerUtils.performActivity(world, new ConsumeMealActivity(meal), function(messages) {
					player.money -= price;
					messages.push('-' + price.toFixed(2) + ' EURO');
					self._showPlayerTempMessages(messages);
				},
				function(rejectionReason) {
					self._showPlayerTempMessages([rejectionReason]);
				});		
		} else {
			self._showPlayerTempMessages('Nicht genug Geld');
		}
	},
	_restartGame: function() {
		this.initMainGame(this.canvas);
	},
	initMainGame: function(canvas) {
		var self = this;
		this.canvas = canvas;
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
		var roomController = this.roomController = this._newController(RoomController, world);
		var supermarketInsideController = this.supermarketInsideController = this._newController(SupermarketInsideController, world);
		var officeController = this.officeController = this._newController(OfficeController, world);
		
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
		barScene.onEatDoener = function() {
			self._buyMeal(DOENER_MEAL, 3.2);
		};
		barScene.onEatSausage = function() {
			self._buyMeal(SAUSAGE_MEAL, 2);
		};
		barScene.onEatBurger = function() {
			self._buyMeal(BURGER_MEAL, 5.5);
		};
		barScene.onDrinkBeer = function() {
			self._buyMeal(BEER_MEAL, 1.5);
		};
		
		// wire-up UI scene
		player.onValueChanged = function(valueName, oldValue, newValue) {
			if (self._mainScene) {
				self._updatePlayerValues(self.world.player, self._mainScene);
			}
		};
		player.onHoursWorkedChanged = function() {
			if (self._mainScene) {
				self._updatePlayerValues(self.world.player, self._mainScene);
			}
		};
		player.energy = 100;
		player.saturation = 100;
		player.fun = 100;
		player.money = 391;
		player.addHoursWorked;
		
		this.updatePaused = true;

		// initial transit
		this.transitToController(roomController, function() {
			roomController.enter();
			self.showMessage('Willkommen bei Hartz Wars IV.\n' +
				'\n' +
				'Unten siehst Du deine Lebenslust. Diese darf auf keinen Fall\n' +
				'auf Null fallen, sonst hast Du verloren.\n' +
				'\n' +
				'Viel Spaß beim spielen!');
			this.updatePaused = false;
		})();
		
		this.tempMessageQueue = [];
		this.rootScene.addAction(new RepeatAction(new SequenceAction(
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
	},
	update: function(delta) {
		var self = this;
		this.rootScene.update(delta);
		if (!this.updatePaused) {
			var messages = Activity.perform(new RegularActivity(delta / 6), this.world);
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
		this.mainViewport.render(context, this.rootScene);
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
		this.rootScene.removeChild(this.mapScene);
	},
	showMessage: function(message, callback) {
		var self = this;
		var messageScene = new MessageScene(message);
		var rootScene = this.rootScene;
		rootScene.addChild(messageScene);
		this.updatePaused = true;
		
		messageScene.onOK = function() {
			rootScene.removeChild(messageScene);
			if (callback) {
				callback();
			}
			self.updatePaused = false;
		};
	},
	showTempMessages: function(messages, pos) {
		messages.forEach(function(message) {
			this.tempMessageQueue.push({message: message, pos: pos});
		}, this);
	}
});
