'use strict';

var otherTopicDialogTemplate = [
	{options: [
		{text: 'Nichts', consequence: [
			{left: 'Nein, Mama. War schön mit dir zu reden.', wait: 1},
			{right: 'OK. Dann meld dich mal wieder. Bis dann.', wait: 3},
			{right: '*tuut*', wait: 1},
			{right: '*tuut*', wait: 1},
			{right: '*tuut*', wait: 1},
			{right: '*tuut*', wait: 1},
			{right: '*tuut*', wait: 1},
			function(scene, world) { scene.onExit(); }
		]}
	]}
];

var goodWorkReplyTemplate = [
	{right: 'Na siehst du.', wait: 1},
	{right: 'Ich war mir sicher, dass du alles gut schaffst.', wait: 1},
	function(scene, world) { world.player.fun += 10; },
	{left: 'Danke, Mama.', wait: 2},
	{right: 'Und gibt\'s sonst noch etwas?', wait: 1}
];

var goodWorkOptionTemplate = [
	{left: 'Es ist sehr schön. Die Kollegen sind sehr nett und der Chef auch.', wait: 1},
	goodWorkReplyTemplate
];

var badWorkReplyTemplate = [
	{right: 'Du kommst schon noch rein.', wait: 1},
	{right: 'Ich bin mir sicher, dass du alles gut schaffst.', wait: 1},
	function(scene, world) { world.player.fun += 5; },
	{left: 'Ja, bestimmt hast du recht.', wait: 2},
	{right: 'Und gibt\'s sonst noch etwas?', wait: 1}
];

var badWorkOptionTemplate = [
	{left: 'Es geht so. Ich bin noch nicht so gut reingekommen.', wait: 1},
	badWorkReplyTemplate
];

var workDialogTemplate = [
	{options: [
		{text: 'Sehr gut', consequence: [
			goodWorkOptionTemplate,
			otherTopicDialogTemplate
		]},
		{text: 'Nicht so gut', consequence: [
			badWorkOptionTemplate,
			otherTopicDialogTemplate
		]}
	]}
];

var goodWorkDialogTemplate = [
	{options: [
		{text: 'Sehr gut', consequence: [
			goodWorkOptionTemplate,
			otherTopicDialogTemplate
		]}
	]}
];

var badWorkDialogTemplate = [
	{options: [
		{text: 'Nicht so gut', consequence: [
			badWorkOptionTemplate,
			otherTopicDialogTemplate
		]}
	]}
];

var goodMoodDialogTemplate = [
	{left: 'Gerade läuft einfach alles sehr gut.', wait: 1},
	{right: 'Das freut mich aber.', wait: 1},
	{right: 'Wie läuft denn die neue Arbeit?', wait: 1},
	goodWorkDialogTemplate
];

var badMoodDialogTemplate = [
	{left: 'Naja, im Moment läuft alles nicht so toll.', wait: 1},
	{right: 'Ist es irgendwas bei der neuen Arbeit?', wait: 1},
	{right: 'Wie läuft\'s denn auf der Arbeit?', wait: 1},
	badWorkDialogTemplate
];

var motherDialogTemplate = [
	{right: '*klingel*', wait: 1},
	{right: '*klingel*', wait: 1},
	{right: '*klingel*', wait: 1},
	{right: 'Hallo.', wait: 0.5},
	{options: [
		{text: 'Grüße sie', consequence: [
			{left: 'Hallo, Mama.', wait: 1},
			{right: 'Ah, hallo mein Junge. Wie geht\'s dir?', wait: 0.5},
			{options: [
				{text: 'Alles ok', consequence: [
					{left: 'Es ist alles in Ordnung. Wie geht\'s dir, denn?', wait: 1},
					{right: 'Ach alles ist beim alten, wie läuft deine neue Arbeit?', wait: 1},
					workDialogTemplate
				]},
				{text: 'Alles super!', consequence: goodMoodDialogTemplate},
				{text: 'So la-la', consequence: badMoodDialogTemplate}
			]}
		]},
		{text: 'Grüße sie fröhlich', consequence: [
			{left: 'Hallo, Mama!!', wait: 1},
			{right: 'Ach, hallo mein Junge. So gut gelaunt?', wait: 0.5},
			{options: [
				{text: 'Einfach gute Laune', consequence: goodMoodDialogTemplate},
				{text: 'Neue Arbeit läuft toll', consequence: [
					{left: 'Die neue Arbeit ist einfach super!', wait: 1},
					{left: 'Alle Kollegen sind sehr nett und der Chef auch.', wait: 1},
					goodWorkReplyTemplate,
					otherTopicDialogTemplate
				]}
			]}
		]},
		{text: 'Schluchze traurig', consequence: [
			{left: 'Hallo *schluchz*, Mama.', wait: 1},
			{right: 'Mein Junge, was ist denn passiert?', wait: 0.5},
			{options: [
				{text: '[Lügen] Nichts...', consequence: [
					{left: 'Es ist gar nichts, Mama, keine Sorge.', wait: 1},
					{right: 'Hmm, nagut. Wie läuft denn die neue Arbeit?', wait: 1},
					workDialogTemplate
				]},
				{text: 'Neue Arbeit läuft schlecht', consequence: [
					{left: 'Naja, die neue Arbeit läuft nicht so toll.', wait: 1},
					{left: 'Ich bin noch nicht so gut reingekommen.', wait: 1},
					badWorkReplyTemplate,
					otherTopicDialogTemplate
				]}
			]}
		]}
	]},
];

function loadDialogElement(element, actions, scene, world) {
	if (element.left || element.right) {
		if (element.left) {
			actions.push(new InstantAction(function() { 
				scene.addMyLine(element.left);
			}));
		} else if (element.right) {
			actions.push(new InstantAction(function() { 
				scene.addTheirLine(element.right);
			}));
		}
		if (element.wait) {
			actions.push(new WaitAction(element.wait));
		}
	} else if (element.options) {
		actions.push(new InstantAction(function() {
			element.options.forEach(function(option) {
				scene.addOption(option.text, function() {
					scene.clearOptions();
					loadDialog(option.consequence, scene, world);
				});
			});
		}));		
	} else if (Array.isArray(element)) {
		loadDialogTemplate(element, actions, scene, world);
	} else if ((typeof element) == 'function') {
		actions.push(new InstantAction(function() {
			element(scene, world);
		}));
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
