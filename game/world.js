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
	this.clock = new Clock(date);
}

World.extends(Object, {
})