'use strict';

function RoomController(world) {
	this._world = world;
	this.scene = new RoomScene();
	this._cookSlots = {};
}
RoomController.extends(Object, {
	_createCookSlot: function(type) {
		var self = this;
		var world = this._world;
		var home = world.playerHome;
		
		var slot = new ActivitySlot(world, this.scene, this.messenger.showPlayerTempMessages, function() {
			var products = home.findProducts(type);
			if (products.length > 0) {
				return new ConsumeMealActivity(products[0]);
			}
			return null;
		});
		slot.onSucceed = function(messages) {
			home.consumeProduct(type);
			self._updateFoodAmount();
			slot.notifyChanges();
		};
		return slot;
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
		
		var sleepSlot = this.sleepSlot = new ActivitySlot(world, scene, null, function() { 
			var hours = Clock.timeDiff(world.clock.time, home.alarmTime);
			return new SleepActivity(hours * 60);
		});
		sleepSlot.onSucceed = function(messages) {
			if (self.onSleep) {
				self.onSleep(messages);
			}
		};
		sleepSlot.onReject = function(rejectionReason) {
			self.messenger.showPlayerTempMessages([rejectionReason]);
		};
		scene.connectSleepSlot(sleepSlot);
		
		scene.connectCookCheapSlot(this._createCookSlot('cheap_food'));
		scene.connectCookExpensiveSlot(this._createCookSlot('expensive_food'));
		scene.connectCookHealthySlot(this._createCookSlot('healthy_food'));
		
		scene.connectReadSlot(new ActivitySlot(world, scene, this.messenger.showPlayerTempMessages, function() { 
			return new ReadActivity();
		}));

		scene.onPhoneCall = function() {
			var dialogController = new MotherDialogController(world);
			scene.addChild(dialogController.scene);
			dialogController.onExit = function() {
				scene.removeChild(dialogController.scene);
			}
			dialogController.init();
		};
		
		this._updateFoodAmount();
		this._updateAlarmTime();
		
/*		home.storeProduct(CHEAP_FOOD);
		home.storeProduct(EXPENSIVE_FOOD);
		home.storeProduct(HEALTHY_FOOD); */
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
		this.sleepSlot.notifyChanges();
	}
});
