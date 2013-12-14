'use strict';

function Perk(title, textureId, description) {
	this._id = Perk.newId();
	this._title = title;
	this._textureId = textureId;
	this._description = description;
}
Perk.extends(Object, {
	get title() {
		return this._title;
	},
	get textureId() {
		return this._textureId;
	},
	get description() {
		return this._description;
	},
	get id() {
		return this._id;
	}
});
Perk._currentId = 0;
Perk.newId = function() {
	return Perk._currentId++;
};

var HUNGRY_PERK = new Perk('Hungrig', 'data/hungry', 'Deine Lebenslust sinkt rapide');
var TIRED_PERK = new Perk('Müde', 'data/tired', 'Deine Lebenslust sinkt rapide');
