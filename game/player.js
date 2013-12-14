'use strict';

function Player() {
	this._energy = 100;
	this._saturation = 100;
	this._fun = 100;
	this._money = 400;
	this.productInventory = [];
	this._hoursWorkedToday = 0;
	this._hoursWorkedThisWeek = 0;
	
	this.workDescription = 'Mind. 40 Std./Woche, mind. 4 Std./Tag';
	this.nextSalary = 300;
	this.perks = {};
};
Player.extends(Object, {
	setValue: function(valueName, value) {
		if (value < 0) {
			value = 0;
		}
		if (value > 100) {
			value = 100;
		}
		
		var oldValue = this['_' + valueName];
		this['_' + valueName] = value;
		return value;
	},
	get energy() { return this._energy; },
	set energy(value) { 
		var setValue = this.setValue('energy', value);
		if(setValue <= 0) {
			this.setPerk(PerkType.TIRED, PERK_TIRED);
		} else {
			this.removePerk(PerkType.TIRED);
		}

		if (this.onEnergyChanged) {
			this.onEnergyChanged(this._energy);
		}
	},
	get saturation() { return this._saturation; },
	set saturation(value) { 
		var setValue = this.setValue('saturation', value);
		if(setValue <= 0) {
			this.setPerk(PerkType.HUNGRY, PERK_HUNGRY);
		} else {
			this.removePerk(PerkType.HUNGRY);
		}
		
		if (this.onSaturationChanged) {
			this.onSaturationChanged(this._saturation);
		}
	},
	get fun() { return this._fun; },
	set fun(value) {
		this.setValue('fun', value);
		if (this.onFunChanged) {
			this.onFunChanged(this._fun);
		}
	},
	get money() { return this._money; },
	set money(value) {
		this._money = value;
		if (this.onMoneyChanged) {
			this.onMoneyChanged(value);
		}
	},
	get hoursWorkedToday() {
		return this._hoursWorkedToday;
	},
	get hoursWorkedThisWeek() {
		return this._hoursWorkedThisWeek;
	},
	addHoursWorked: function(value) {
		this._hoursWorkedToday += value;
		this._hoursWorkedThisWeek += value;
		if (this.onHoursWorkedChanged) {
			this.onHoursWorkedChanged();
		}
	},
	canTakeProduct: function(product) {
		return (this.productInventory.length < 3);
	},
	takeProduct: function(product) {
		this.productInventory.push(product);
	},
	dropAllProducts: function() {
		var res = [];
		var productInventory = this.productInventory;
		while (productInventory.length > 0) {
			res.unshift(productInventory.pop());
		}
		return res;
	},
	newDay: function(day) {
		this._hoursWorkedToday = 0;
	},
	newWeek: function() {
		this._hoursWorkedThisWeek = 0;
		this.money += this.nextSalary;
		this.nextSalary = 300;
	},
	setPerk: function(type, perk) {
		if (this.perks[type.name] != perk) {
			this.perks[type.name] = perk;
			if (this.onPerkSet) {
				this.onPerkSet(perk);
			}
		}
	},
	removePerk: function(type) {
		var perk = this.perks[type.name];
		if (perk) {
			delete this.perks[type.name];
			if (this.onPerkRemoved) {
				this.onPerkRemoved(perk);
			}
		}
	}
});