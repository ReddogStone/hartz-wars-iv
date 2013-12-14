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
		
		activity.prepare();
		
		player.energy += activity.getEnergyChangeRate(player) * duration;
		player.saturation += activity.getSaturationChangeRate(player) * duration;
		player.fun += activity.getFunChangeRate(player) * duration;
		player.money += activity.getMoneyChange(player);
		
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
	},
	getConsequences: function(activity, world) {
		var duration = activity.duration;
		var player = world.player;
		
		var energyChange = activity.getEnergyChangeRate(player) * duration;
		var saturationChange = activity.getSaturationChangeRate(player) * duration;
		var funChange = activity.getFunChangeRate(player) * duration;
		var moneyChange = activity.getMoneyChange(player);
		var additionalMessages = activity.getExpectedEffectMessages(world);
		
		return {
			energy: energyChange,
			saturation: saturationChange,
			fun: funChange,
			money: moneyChange,
			messages: additionalMessages
		};
	}
};

function RegularActivity(duration) {
	this._duration = duration;
}
RegularActivity.extends(Object, {
	prepare: function(world) {
	},
	getEnergyChangeRate: function(player) {
		return -100 / (16 * 60);
	},
	getSaturationChangeRate: function(player) {
		return -100 / (12 * 60);
	},
	getFunChangeRate: function(player) {
		var perks = player.perks;
		if (perks[PerkType.HUNGRY.name] || perks[PerkType.TIRED.name]) {
			return -0.5;
		} else {
			return -100 / (4 * 24 * 60);
		}
	},
	getMoneyChange: function(player) {
		return 0;
	},
	getExpectedEffectMessages: function(world) {
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

function BuyAndConsumeMealActivity(meal, price) {
	ConsumeMealActivity.call(this, meal);
	this._price = price;
}
BuyAndConsumeMealActivity.extends(ConsumeMealActivity, {
	getMoneyChange: function(player) {
		return -this._price;
	},
	reject: function(world) {
		if (world.player.money < this._price) {
			return 'Nicht genug Geld';
		}
		return ConsumeMealActivity.prototype.reject.call(this, world);
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
}
WorkActivity.extends(RegularActivity, {
	prepare: function(world) {
		this._goodDay = (Math.random() < 0.2);
	},
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
		if (world.player.energy < (this.duration * this.getEnergyChangeRate())) {
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
	},
	getExpectedEffectMessages: function() {
		return ['An einem "Guten Tag" weniger Energie- und Lebenslustabzug'];
	}
});
