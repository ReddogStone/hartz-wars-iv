'use strict';

function RoomController(world) {
	this._world = world;
	this.scene = new RoomScene();
}
RoomController.extends(Object, {
	_consumeFood: function(type) {
		var world = this._world;
		var player = world.player;
		var home = world.playerHome;
		var product = home.consumeProduct(type);
		if (product) {
			if (product.condition(world, player)) {
				product.consequence(world, player);
			} else {
				home.storeProduct(product);
			}
		}
		this._updateFoodAmount();		
	},	
	init: function() {
		var scene = this.scene;
		var world = this._world;
		var player = world.player;
		var home = world.playerHome;
		
		scene.init();

		var self = this;
		scene.onAlarmUp = function() {
			home.alarmTime += 0.5;
			self._updateAlarmTime();
		};
		scene.onAlarmDown = function() {
			home.alarmTime -= 0.5;
			self._updateAlarmTime();
		};
		scene.onSleep = function() {
			var duration = Clock.timeDiff(world.clock.time, home.alarmTime);
			player.saturation -= 100 * duration / 24;
			player.energy += 12 * duration;
			world.jumpGameTime(duration * 60);
			
			if (self.onSleep) {
				self.onSleep();
			}
		};
		scene.onCookCheap = function() {
			self._consumeFood('cheap_food');
		};
		scene.onCookExpensive = function() {
			self._consumeFood('expensive_food');
		};
		scene.onCookHealthy = function() {
			self._consumeFood('healthy_food');
		};
		scene.onPhoneCall = function() {
			var dialogController = new MotherDialogController(world);
			scene.addChild(dialogController.scene);
			dialogController.onExit = function() {
				scene.removeChild(dialogController.scene);
			}
			dialogController.init();
		};
		scene.onReadBook = function() {
			player.fun += 15;
			world.advanceGameTime(60);
		};
		this._updateFoodAmount();
		this._updateAlarmTime();
	},
	enter: function() {
		var world = this._world;
		var products = world.player.dropAllProducts();
		world.playerHome.storeProducts(products);
		this._updateFoodAmount();
		this.scene.enter();
	},
	set onExitToStreet(value) {
		this.scene.onExitToStreet = value;
	},
	_updateFoodAmount: function() {
		var home = this._world.playerHome;
		var cheap = home.findProducts('cheap_food');
		var expensive = home.findProducts('expensive_food');
		var healthy = home.findProducts('healthy_food');
		
		var scene = this.scene;
		scene.cheapAmount.text = cheap.length;
		scene.expensiveAmount.text = expensive.length;
		scene.healthyAmount.text = healthy.length;
	},
	_updateAlarmTime: function() {
		var alarmTime = this._world.playerHome.alarmTime;
		var alarmHours = Math.floor(alarmTime);
		var alarmMinutes = Math.floor((alarmTime - alarmHours) * 60);
		this.scene.foreground.alarmTimeLabel.text = padNumber(alarmHours, 2) + ':' + padNumber(alarmMinutes, 2);
	}
});
