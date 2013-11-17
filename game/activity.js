'use strict';

function RegularActivity() {
}
RegularActivity.extends(Object, {
	getEnergyChangeRate: function() {
		return -100 / (16 * 60);
	},
	getSaturationChangeRate: function() {
		return -100 / (12 * 60);
	},
	getFunChangeRate: function() {
		return -100 / (4 * 24 * 60);
	},
	getSuccessMessages: function() {
		var duration = this.getDuration();
		var energyChange = duration * this.getEnergyChangeRate();
		var saturationChange = duration * this.getSaturationChangeRate();
		var funChange = duration * this.getFunChangeRate();
		return [
			numberToStringWithSign(Math.floor(energyChange)) + ' Energie',
			numberToStringWithSign(Math.floor(saturationChange)) + ' Sättigung',
			numberToStringWithSign(Math.floor(funChange)) + ' Lebenslust'
		];
	}	
});
var REGULAR_ACTIVITY = new RegularActivity();

function ConsumeMealActivity(meal) {
	this.meal = meal;
}
ConsumeMealActivity.extends(RegularActivity, {
	getEnergyChangeRate: function() {
		var meal = this.meal;
		return meal.energyChange / meal.timeToConsume;
	},
	getSaturationChangeRate: function() {
		var meal = this.meal;
		return meal.saturationChange / meal.timeToConsume;
	},
	getFunChangeRate: function() {
		var meal = this.meal;
		return meal.funChange / meal.timeToConsume;
	},
	getDuration: function() {
		return this.meal.timeToConsume;
	},
	getSuccessMessages: function() {
		var meal = this.meal;
		var result = [];
		if (meal.energyChange != 0) {
			result.push(numberToStringWithSign(meal.energyChange) + ' Energie');
		}
		if (meal.saturationChange != 0) {
			result.push(numberToStringWithSign(meal.saturationChange) + ' Sättigung');
		}
		if (meal.funChange != 0) {
			result.push(numberToStringWithSign(meal.funChange) + ' Lebenslust');
		}
		return result;
	},
	reject: function(world) {
		if ((world.player.energy + this.meal.energyChange) < 0) {
			return 'Nicht genug Energie';
		}
		return null;
	}
});

function ReadActivity() {
}
ReadActivity.extends(RegularActivity, {
	getDuration: function() {
		return 60;
	},
	getFunChangeRate: function() {
		return 15 / this.getDuration();
	},
	reject: function(world) {
		if ((world.player.energy + this.getDuration() * this.getEnergyChangeRate()) < 0) {
			return 'Nicht genug Energie';
		}
		return null;
	}
});
var READ_ACTIVITY = new ReadActivity();

function SleepActivity(duration) {
	this._duration = duration;
}
SleepActivity.extends(RegularActivity, {
	getEnergyChangeRate: function() {
		return 100 / (12 * 60);
	},
	getDuration: function() {
		return this._duration;
	},
	reject: function(world) {
		if (world.player.energy >= 80) {
			return 'Nicht müde';
		}
		return null;
	}
});
