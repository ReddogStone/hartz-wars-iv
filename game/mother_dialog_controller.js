'use strict';

var motherDialogTemplate = [
	{type: 'line', speaker: 'self', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'self', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'self', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'other', text: 'Hallo.', wait: 0.5},
	{type: 'options', options: [
		{text: 'Grüße sie', consequence: [
			{type: 'line', speaker: 'self', text: 'Hallo, Mama.', wait: 1},
			{type: 'line', speaker: 'other', text: 'Ah, hallo mein Junge. Wie geht\'s dir?', wait: 0.5},
			{type: 'options', options: [
				{text: 'Alles ok', consequence: []},
				{text: 'Alles super!', consequence: []},
				{text: 'So la-la', consequence: []}
			]}
		]},
		{text: 'Grüße sie fröhlich', consequence: [
			{type: 'line', speaker: 'self', text: 'Hallo, Mama!!', wait: 1},
			{type: 'line', speaker: 'other', text: 'Ach, hallo mein Junge. So gut gelaunt?', wait: 0.5},
			{type: 'options', options: [
				{text: 'Einfach gute Laune', consequence: []},
				{text: 'Neue Arbeit läuft toll', consequence: []}
			]}
		]},
		{text: 'Schluchze traurig', consequence: [
			{type: 'line', speaker: 'self', text: 'Hallo *schluchz*, Mama.', wait: 1},
			{type: 'line', speaker: 'other', text: 'Mein Junge, was ist denn passiert?', wait: 0.5},
			{type: 'options', options: [
				{text: '[Lügen] Nichts...', consequence: []},
				{text: 'Neue Arbeit läuft schlecht', consequence: []}
			]}
		]}
	]},
];

function loadDialogTemplate(template, scene) {
	var actions = [];
	template.forEach(function(element) {
		switch (element.type) {
			case 'line':
				actions.push(new InstantAction(function() { 
					if (element.speaker == 'self') {
						scene.addMyLine(element.text);
					} else {
						scene.addTheirLine(element.text);
					}
				}));
				if (element.wait) {
					actions.push(new WaitAction(element.wait));
				}
				break;
			case 'options':
				actions.push(new InstantAction(function() {
					element.options.forEach(function(option) {
						scene.addOption(option.text, function() {
							scene.clearOptions();
							loadDialogTemplate(option.consequence, scene);
						});
					});
				}));
				break;
		}
	});
	if (actions.length > 0) {
		scene.addAction(new SequenceAction(actions));
	}
}

function MotherDialogController(world) {
	this._world = world;
	this.scene = new DialogScene();
}
MotherDialogController.extends(Object, {
	init: function() {
		var scene = this.scene;
		scene.onExit = this.onExit;
		loadDialogTemplate(motherDialogTemplate, scene);
	}
});
