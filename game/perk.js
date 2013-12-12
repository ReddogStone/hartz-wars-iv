'use strict';

function Perk(title, image, description) {
	this._id = Perk.newId();
	this._title = title;
	this._image = image;
	this._description = description;
}
Perk.extends(Object, {
	get title() {
		return this._title;
	},
	get image() {
		return this._image;
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

var HUNGRY_PERK = new Perk('Hungrig', '', 'Deine Lebenslust sinkt rapide');
var TIRED_PERK = new Perk('Müde', '', 'Deine Lebenslust sinkt rapide');
