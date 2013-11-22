'use strict';

var Activity = {
	perform: function(activity, world) {
		var duration = activity.duration;
		
		var player = world.player;
		var energy = player.energy;
		var saturation = player.saturation;
		var fun = player.fun;
		var money = player.money;
	
		world.advanceClock(duration);
		
		player.energy += activity.getEnergyChangeRate(player) * duration;
		player.saturation += activity.getSaturationChangeRate(player) * duration;
		player.fun += activity.getFunChangeRate(player) * duration;
		
		var messages = [];
		var energyChange = integerDifference(player.energy, energy);
		var saturationChange = integerDifference(player.saturation, saturation);
		var funChange = integerDifference(player.fun, fun);
		var moneyChange = player.money - money;
		if (energyChange != 0) {
			messages.push(numberToStringWithSign(energyChange) + ' Energie');
		}
		if (saturationChange != 0) {
			messages.push(numberToStringWithSign(saturationChange) + ' Sättigung');
		}
		if (funChange != 0) {
			messages.push(numberToStringWithSign(funChange) + ' Lebenslust');
		}
		if (moneyChange != 0) {
			messages.push(numberToStringWithSign(moneyChange.toFixed(2)) + ' EURO');
		}
		
		var effectMessages = activity.applyWorldEffects(world);
		messages = messages.concat(effectMessages);
		
		return messages;
	}
};

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
	getExpectedEffectMessages: function() {
		return [];
	},
	applyWorldEffects: function(world) {
		return [];
	},
	reject: function(world) {
		return null;
	},
	get duration() {
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
		return 15 / this.duration;
	},
	reject: function(world) {
		if ((world.player.energy + this.duration * this.getEnergyChangeRate()) < 0) {
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
	getFunChangeRate: function() {
		return 0;
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
	this._goodDay = (Math.random() < 0.2);
}
WorkActivity.extends(RegularActivity, {
	getEnergyChangeRate: function() {
		return (this._goodDay) ? 
			-40 / (8.5 * 60) :
			-60 / (8.5 * 60);
	},
	getSaturationChangeRate: function() {
		return -60 / (8.5 * 60);
	},
	getFunChangeRate: function() {
		return (this._goodDay) ? 
			-10 / (8.5 * 60) :
			-30 / (8.5 * 60);
	},
	reject: function(world) {
		if (world.player.energy < 40) {
			return 'Nicht genug Energie';
		}
		return null;
	},
	applyWorldEffects: function(world) {
		var player = world.player;
		var hoursWorked = this.duration / 60;
		if (hoursWorked > 6) {
			hoursWorked = Math.max(hoursWorked - 0.5, 6);
		}
		player.addHoursWorked(hoursWorked);
		
		return [(this._goodDay) ? 
			GameUtils.randomSelect('Heut war gar nicht so übel',
				'Ich liebe meinen Job',
				'Yay, mein Chef liebt mich') :
			GameUtils.randomSelect('War wieder ein langer Tag', 
				'Und wieder nix geschafft', 
				'Ich hasse diesen Job')];
	}
});
