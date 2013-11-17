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
	this.clock = new Clock(new Date());
}

World.extends(Object, {
	update: function(delta) {
		this.advanceGameTime(delta / 60 * GAME_TIME_SPEED, REGULAR_ACTIVITY);
	},
	advanceGameTime: function(minutes, activity) {
		this.clock.advance(minutes);
		this.player.advanceGameTime(minutes, activity);
	},
	jumpGameTime: function(minutes) {
		this.clock.advance(minutes);		
	},
	performActivity: function(activity) {
		this.advanceGameTime(activity.getDuration(), activity);
	}
})