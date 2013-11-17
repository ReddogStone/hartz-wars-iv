'use strict';

function RegularActivity(duration) {
	this._duration = duration;
}
RegularActivity.extends(Object, {
	getEnergyChangeRate: function(player) {
		return -100 / (16 * 60);
	},
	getSaturationChangeRate: function(player) {
		return -100 / (12 * 60);
	},
	getFunChangeRate: function(player) {
		if (player.hungry || player.tired) {
			return -0.5;
		} else {
			return -100 / (4 * 24 * 60);
		}
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
	},
	getDuration: function() {
		return this._duration;
	}
});

function ConsumeMealActivity(meal) {
	RegularActivity.call(this, meal.timeToConsume);
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
	RegularActivity.call(this, 60);
}
ReadActivity.extends(RegularActivity, {
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
	RegularActivity.call(this, duration);
}
SleepActivity.extends(RegularActivity, {
	getEnergyChangeRate: function() {
		return 100 / (12 * 60);
	},
	reject: function(world) {
		if (world.player.energy >= 80) {
			return 'Nicht müde';
		}
		return null;
	}
});

function WorkActivity(duration) {
	RegularActivity.call(this, duration);
}
WorkActivity.extends(RegularActivity, {
	getEnergyChangeRate: function() {
		return -60 / (8.5 * 60);
	},
	getSaturationChangeRate: function() {
		return -60 / (8.5 * 60);
	},
	getFunChangeRate: function() {
		return -25 / (8.5 * 60);
	},
	reject: function(world) {
		if (world.player.energy < 40) {
			return 'Nicht genug Energie';
		}
		return null;
	}
});
