'use strict';

var PerkType = {
	HUNGRY: { name: 'HUNGRY' },
	TIRED: { name: 'TIRED' }
};

function Perk(type, title, textureId, description) {
	this._type = type;
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
	},
	get type() {
		return this._type;
	}
});
Perk._currentId = 0;
Perk.newId = function() {
	return Perk._currentId++;
};

var PERK_HUNGRY = new Perk(PerkType.HUNGRY, 'Hungrig', 'data/hungry', 'Deine Lebenslust sinkt\nrapide');
var PERK_TIRED = new Perk(PerkType.TIRED, 'Müde', 'data/tired', 'Deine Lebenslust sinkt\nrapide');
