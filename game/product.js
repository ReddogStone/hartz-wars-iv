'use strict';

function Food(type, price, label, meals, condition, consequence) {	
	this.kind = 'food';
	this.type = type;
	this.price = price;
	this.label = label;
	this.meals = meals;
	this.condition = condition;
	this.consequence = consequence;
}

Food.extends(Object);

Food.clone = function(value) {
	return new Food(value.type, value.price, value.label, value.meals, value.condition, value.consequence);
}

var CHEAP_FOOD = new Food('cheap_food', 10, 'Billig', 4,
	function(world, player) {
		return (player.energy >= 10);
	},
	function(world, player) {
		player.saturation += 45;
		player.energy -= 10;
		world.clock.advance(30);
	});
	
var HEALTHY_FOOD = new Food('healthy_food', 15, 'Gesund', 3,
	function(world, player) {
		return (player.energy >= 15);
	},
	function(world, player) {
		player.saturation += 45;
		player.energy -= 15;
		world.clock.advance(45);
	});

var EXPENSIVE_FOOD = new Food('expensive_food', 30, 'Vornehm', 3,
	function(world, player) {
		return (player.energy >= 20);
	},
	function(world, player) {
		player.saturation += 40;
		player.energy -= 20;
		world.clock.advance(60);
	});
