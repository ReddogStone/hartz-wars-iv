'use strict';

var otherThemeDialogTemplate = [
	{type: 'options', options: [
		{text: 'Nichts', consequence: [
			{type: 'action', action: function(scene, world) { scene.onExit(); } }
		]}
	]}
];

var workDialogTemplate = [
	{type: 'options', options: [
		{text: 'Sehr gut', consequence: [
			{type: 'line', speaker: 'left', text: 'Es ist sehr schön. Die Kollegen sind sehr nett und der Chef auch.', wait: 1},
			{type: 'line', speaker: 'right', text: 'Na siehst du.', wait: 1},
			{type: 'line', speaker: 'right', text: 'Ich war mir sicher, dass du alles gut schaffst.', wait: 1},
			{type: 'action', action: function(scene, world) { world.player.fun += 10; } },
			{type: 'line', speaker: 'left', text: 'Und gibt\'s sonst noch etwas?', wait: 1},
			{type: 'template', template: otherThemeDialogTemplate}
		]},
		{text: 'Nicht so gut', consequence: []}
	]}
];

var goodMoodDialogTemplate = [
	{type: 'line', speaker: 'left', text: 'Gerade läuft einfach alles sehr gut.', wait: 1},
	{type: 'line', speaker: 'right', text: 'Das freut mich aber.', wait: 1},
	{type: 'line', speaker: 'right', text: 'Wie läuft denn die neue Arbeit?', wait: 1},
	{type: 'template', template: workDialogTemplate}
];

var motherDialogTemplate = [
	{type: 'line', speaker: 'left', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'left', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'left', text: '*klingel*', wait: 1},
	{type: 'line', speaker: 'right', text: 'Hallo.', wait: 0.5},
	{type: 'options', options: [
		{text: 'Grüße sie', consequence: [
			{type: 'line', speaker: 'left', text: 'Hallo, Mama.', wait: 1},
			{type: 'line', speaker: 'right', text: 'Ah, hallo mein Junge. Wie geht\'s dir?', wait: 0.5},
			{type: 'options', options: [
				{text: 'Alles ok', consequence: [
					{type: 'line', speaker: 'left', text: 'Es ist alles in Ordnung. Wie geht\'s dir, denn?', wait: 1},
					{type: 'line', speaker: 'right', text: 'Ach alles ist beim alten, wie läuft deine neue Arbeit?', wait: 1},
				]},
				{text: 'Alles super!', consequence: goodMoodDialogTemplate},
				{text: 'So la-la', consequence: []}
			]}
		]},
		{text: 'Grüße sie fröhlich', consequence: [
			{type: 'line', speaker: 'left', text: 'Hallo, Mama!!', wait: 1},
			{type: 'line', speaker: 'right', text: 'Ach, hallo mein Junge. So gut gelaunt?', wait: 0.5},
			{type: 'options', options: [
				{text: 'Einfach gute Laune', consequence: goodMoodDialogTemplate},
				{text: 'Neue Arbeit läuft toll', consequence: []}
			]}
		]},
		{text: 'Schluchze traurig', consequence: [
			{type: 'line', speaker: 'left', text: 'Hallo *schluchz*, Mama.', wait: 1},
			{type: 'line', speaker: 'right', text: 'Mein Junge, was ist denn passiert?', wait: 0.5},
			{type: 'options', options: [
				{text: '[Lügen] Nichts...', consequence: []},
				{text: 'Neue Arbeit läuft schlecht', consequence: []}
			]}
		]}
	]},
];

function loadDialogElement(element, actions, scene, world) {
	switch (element.type) {
		case 'line':
			actions.push(new InstantAction(function() { 
				if (element.speaker == 'left') {
					scene.addMyLine(element.text);
				} else if (element.speaker == 'right') {
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
						loadDialog(option.consequence, scene, world);
					});
				});
			}));
			break;
		case 'template':
			loadDialogTemplate(element.template, actions, scene, world);
			break;
		case 'action':
			actions.push(new InstantAction(function() {
				element.action(scene, world);
			}));
			break;
	}	
}

function loadDialogTemplate(template, actions, scene, world) {
	template.forEach(function(element) {
		loadDialogElement(element, actions, scene, world);
	});
}

function loadDialog(template, scene, world) {
	var actions = [];
	loadDialogTemplate(template, actions, scene, world);
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
		loadDialog(motherDialogTemplate, scene, this._world);
	}
});
