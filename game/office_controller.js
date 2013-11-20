'use strict';

function OfficeController(world) {
	this._world = world;
	this.scene = new OfficeScene();
}
OfficeController.extends(Object, {
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
		var activity = new WorkActivity(8.5 * 60);
		ControllerUtils.performActivity(this._world, activity, function(messages) {
				self.showPlayerTempMessages(messages);
			},
			function(rejectionReason) {
				self.showPlayerTempMessages([rejectionReason]);
			});
	},
	updateWorkCondition: function() {
		var day = this._world.clock.day;
		var scene = this.scene;
		var self = this;
		if ((day > 0) && (day < 6)) {
			scene.onEnterOffice = function() { self.work(); };
			scene.foreground.doorButton.label.text = 'Arbeiten gehen';
		} else {
			scene.onEnterOffice = function() { self.showPlayerTempMessages(['Geschlossen am Wochenende']); };
			scene.foreground.doorButton.label.text = 'Geschlossen';
		}
	}
});
