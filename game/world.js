'use strict';

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
		this.clock.advance(delta / 6);
	}
})