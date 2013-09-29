'use strict';

function Player() {
	this._energy = 100;
	this._saturation = 100;
	this._fun = 100;
	this._money = 400;
	this.body;
};
Player.extends(Object, {
	setValue: function(valueName, value) {
		if ((value < 0) || (value > 100)) return;
		
		this['_' + valueName] = value;
		if (this.onValueChanged) {
			this.onValueChanged(valueName, value);
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
	}
});