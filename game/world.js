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
	advanceGameTime: function(minutes, activity) {
		this.clock.advance(minutes);
		return this.player.advanceGameTime(minutes, activity);
	},
	jumpGameTime: function(minutes) {
		this.clock.advance(minutes);		
	},
	performActivity: function(activity) {
		return this.advanceGameTime(activity.getDuration(), activity);
	}
})