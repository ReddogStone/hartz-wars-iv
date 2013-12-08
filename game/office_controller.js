'use strict';

function OfficeController(world) {
	this._world = world;
	this.scene = new OfficeScene();
}
OfficeController.extends(Object, {
	_setWorkAmount: function(workAmount) {
		if (workAmount > 6) {
			return {amount: 6, info: 'Maximal 6 Std. ohne Pause'};
		} else if (workAmount < 1) {
			return {amount: 1, info: 'Du musst schon mindestens eine Stunde arbeiten.'};
		}
			
		return {amount: workAmount, info: ''};
	},
	_setConsequences: function(selectScene) {
		var time = this._world.clock.time;
		var duration = selectScene.workAmount;
		duration = Math.min(20.0 - time, duration) * 60;
		
		var activity = new WorkActivity(duration);
		var consequences = Activity.getConsequences(activity, this._world);
		selectScene.setInfo(consequences);		
	},
	init: function() {
		var self = this;
		var scene = this.scene;
		var world = this._world;
		var player = world.player;
		
		scene.init();
		this.updateWorkCondition();
	},
	enterFromBus: function() {
		this.scene.enterFromBus();
	},
	set onExitToStreet(value) {
		this.scene.onExitToStreet = value;
	},
	set onShowMap(value) {
		this.scene.onShowMap = value;
	},
	update: function(delta) {
		this.updateWorkCondition();
	},
	work: function() {
		var self = this;
		
		var selectScene = new WorkSelectScene();
		
		selectScene.onIncreaseWorkAmount = function() {
			var response = self._setWorkAmount(selectScene.workAmount + 0.5);
			selectScene.workAmount = response.amount;
			selectScene.additionalInformation = response.info;
			self._setConsequences(selectScene);
		};
		selectScene.onDecreaseWorkAmount = function() {
			var response = self._setWorkAmount(selectScene.workAmount - 0.5);
			selectScene.workAmount = response.amount;
			selectScene.additionalInformation = response.info;
			self._setConsequences(selectScene);
		};
		this._setConsequences(selectScene);
		
		this.showOverlay(selectScene, function() {
			var time = self._world.clock.time;
			var duration = selectScene.workAmount;
			duration = Math.min(20.0 - time, duration) * 60;
			
			var activity = new WorkActivity(duration);
			ControllerUtils.performActivity(self._world, activity, function(messages) {
					self.messenger.showPlayerTempMessages(messages);
				},
				function(rejectionReason) {
					self.messenger.showPlayerTempMessages([rejectionReason]);
				});
		});
	},
	updateWorkCondition: function() {
		var clock = this._world.clock;
		var day = clock.day;
		var time = clock.time;
		var scene = this.scene;
		var self = this;
		if ((day > 0) && (day < 6) && (time > 6.00) && (time < 20.00)) {
			scene.onEnterOffice = function() { self.work(); };
			scene.foreground.doorButton.label.text = 'Arbeiten gehen';
		} else {
			var message = 'Geschlossen am Wochenende';
			if ((day > 0) && (day < 6)) {
				message = 'Geöffnet von 06:00 bis 20:00';
			}
			scene.onEnterOffice = function() { self.showPlayerTempMessages([message]); };
			scene.foreground.doorButton.label.text = 'Geschlossen';
		}
	}
});
