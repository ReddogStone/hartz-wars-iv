'use strict';

function World() {
	this.player = new Player();
	var supermarket = new Supermarket();
	supermarket.addProduct(new Product('cheap_food', 10, 'Billig'));
	supermarket.addProduct(new Product('expensive_food', 30, 'Vornehm'));
	supermarket.addProduct(new Product('healthy_food', 15, 'Gesund'));
	this.supermarket = supermarket;
	this.playerHome = new Home();
	this.clock = new Clock(new Date());
}