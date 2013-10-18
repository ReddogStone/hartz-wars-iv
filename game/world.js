'use strict';

function World() {
	this.player = new Player();
	var supermarket = new Supermarket();
	supermarket.addProduct('cheap_food', new Product(10, 'Billig'));
	supermarket.addProduct('expensive_food', new Product(30, 'Vornehm'));
	supermarket.addProduct('healthy_food', new Product(15, 'Gesund'));
	this.supermarket = supermarket;
	this.playerHome = new Home();
	this.clock = new Clock(new Date());
}