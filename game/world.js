'use strict';

var GAME_TIME_SPEED = 10;

function World() {
	this.player = new Player();
	var supermarket = new Supermarket();
	supermarket.addProduct(CHEAP_FOOD);
	supermarket.addProduct(HEALTHY_FOOD);
	supermarket.addProduct(EXPENSIVE_FOOD);
	this.supermarket = supermarket;
	this.playerHome = new Home();
	
	var date = new Date();
	date.setHours(7);
	date.setMinutes(0);
	
	while (date.getDay() != 1) {
		date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
	}
	
//	date.setDate(7);
//	this.player._hoursWorkedThisWeek = 39;
	this.clock = new Clock(date);
}

World.extends(Object, {
	advanceClock: function(minutes) {
		var clock = this.clock;
		var time = clock.time;
		var day = clock.day;
		this.clock.advance(minutes);
		if (clock.time < time) {
			if (this.onNewDay) {
				this.onNewDay();
			}
			this.player.newDay(clock.day);
		}
		if ((day == 0) && (clock.day == 1)) {
			if (this.onNewWeek) {
				this.onNewWeek();
			}
			this.player.newWeek();
		}
	}
})