'use strict';

function Meal(energyChange, saturationChange, funChange, timeToConsume) {
	this.energyChange = energyChange;
	this.saturationChange = saturationChange;
	this.funChange = funChange;
	this.timeToConsume = timeToConsume;
}

function FoodProduct(type, price, label, meals, energyChange, saturationChange, funChange, timeToConsume) {	
	this.kind = 'food';
	this.type = type;
	this.price = price;
	this.label = label;
	this.meals = meals;
	this.energyChange = energyChange;
	this.saturationChange = saturationChange;
	this.funChange = funChange;
	this.timeToConsume = timeToConsume;
}
FoodProduct.extends(Object, {
	convertToMeals: function() {
		var mealCount = this.meals;
		var result = new Array(mealCount);
		for (var i = 0; i < mealCount; ++i) {
			result[i] = new Meal(this.energyCost, this.saturationGain, this.funGain, this.timeToConsume);
		}
		return result;
	}
});
FoodProduct.clone = function(value) {
	return new FoodProduct(value.type, 
		value.price, 
		value.label, 
		value.meals, 
		value.energyChange, 
		value.saturationChange, 
		value.funChange, 
		value.timeToConsume);
}

var CHEAP_FOOD = new FoodProduct('cheap_food', 10, 'Billig', 4, -10, 45, 0, 30);
var HEALTHY_FOOD = new FoodProduct('healthy_food', 15, 'Gesund', 3, -15, 45, 0, 45);
var EXPENSIVE_FOOD = new FoodProduct('expensive_food', 30, 'Vornehm', 3, -20, 40, 0, 60);
var DOENER_MEAL = new Meal(-5, 20, 0, 15);
var BURGER_MEAL = new Meal(-5, 30, 0, 45);
var SAUSAGE_MEAL = new Meal(-5, 10, 0, 5);
var BEER_MEAL = new Meal(-5, 0, 5, 30);
