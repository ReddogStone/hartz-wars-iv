'use strict';

function Player() {
	this._energy = 100;
	this._saturation = 100;
	this._fun = 100;
	this._money = 400;
	this.productInventory = [];
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
		if (this.onValueChanged) {
			this.onValueChanged(valueName, oldValue, value);
		}
	},
	get energy() { return this._energy; },
	set energy(value) { this.setValue('energy', value); },
	get saturation() { return this._saturation; },
	set saturation(value) { this.setValue('saturation', value); },
	get fun() { return this._fun; },
	set fun(value) { this.setValue('fun', value); },
	get money() { return this._money; },
	set money(value) {
		this._money = value;
		if (this.onValueChanged) {
			this.onValueChanged('money', value);
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
	advanceGameTime: function(minutes, activity) {
		var energy = this.energy;
		var saturation = this.saturation;
		var fun = this.fun;
	
		this.energy += activity.getEnergyChangeRate() * minutes;
		this.saturation += activity.getSaturationChangeRate() * minutes;
		this.fun += activity.getFunChangeRate() * minutes;
		
		var messages = [];
		var energyChange = integerDifference(this.energy, energy);
		var saturationChange = integerDifference(this.saturation, saturation);
		var funChange = integerDifference(this.fun, fun);
		if (energyChange != 0) {
			messages.push(numberToStringWithSign(energyChange) + ' Energie');
		}
		if (saturationChange != 0) {
			messages.push(numberToStringWithSign(saturationChange) + ' Sättigung');
		}
		if (funChange != 0) {
			messages.push(numberToStringWithSign(funChange) + ' Lebenslust');
		}
		return messages;
	}
});