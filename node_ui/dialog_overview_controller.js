'use strict';

var otherTopicDialogTemplate = [
	{options: [
		{text: 'Nichts', consequence: [
			{left: 'Nein, Mama. War schön mit dir zu reden.', wait: 1},
			{right: 'OK. Dann meld dich mal wieder. Bis dann.', wait: 3}
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
	{right: '*tuut*', wait: 1},
	{right: '*tuut*', wait: 1},
	{right: '*tuut*', wait: 1},
	{right: '*tuut*', wait: 1},
	{right: '*tuut*', wait: 1},	
	function(scene, world) { scene.exit(); }
];

motherDialogTemplate = [
	{options: [
		{text: 'Neue Arbeit läuft schlecht', consequence: [
			[
				{right: 'Du kommst schon noch rein.', wait: 1},
				{right: 'Du kommst schon noch rein.', wait: 1},
				{right: 'Du kommst schon noch rein.', wait: 1}
			]
		]},
		{text: 'Neue Arbeit läuft schlecht', consequence: [
			[
				{right: 'Du kommst schon noch rein.', wait: 1}
			]
		]}
	]},
	{right: 'Du kommst schon noch rein.', wait: 1}
];

/*motherDialogTemplate = {
	game: {

	},
	editor: {
		'3dengine': {},
		'ui': {
			controller: [
				{
					name: 'dialog_overview_controller',
					start: '10.01.2014',
					length: 4
				}, 
				{
					name: 'factor out view stuff',
					start: '14.01.2014',
					length: 1
				}, 
				{
					name: 'add some fancy stuff',
					start: '17.01.2014',
					length: 1
				}, 
			],
			view: {

			},
			nodes: {

			}
		},
		'data I/O': {}
	}
};*/

function DialogOverviewController(engine, viewport) {
	var view = this._view = new HierarchicalView(engine, viewport);

//================ TEMP ================
	var rootNode = new DialogNode(motherDialogTemplate);
//	var rootNode = new ReflectionNode(motherDialogTemplate, 'root');
//	var containerNode = new ContainerNode(engine, [rootNode]);

	var rootEntity = {
		node: rootNode,
		tree: new Subtree()
	};
	this._rootEntity = rootEntity;

	this._selection = [];
	Subtree.expandAll(rootEntity);

	view.show(rootEntity);

	this._navigate(rootEntity);
	this._view.focusCamera(rootEntity);
	
	var self = this;
	view.onClicked = function(entity) {
		self._select(entity);
		self._navigate(entity);		
	};
	view.onAction = function(entity) {
		self._selection.forEach(function(selected) {
			self._view.hide(selected);
			var selTree = selected.tree;
			if (selTree.expanded) {
				selTree.collapse();
			} else {
				selTree.expand(selected);
			}
			self._view.show(selected);
		});

		self._selection.forEach(function(selected) {
			self._select(selected);
		});

		self._navigate(self._rootEntity);
	};
	view.onLevelUp = function() {
		var active = self._selection[0] || self._rootEntity;
		var parent = active.tree.parent;
		if (parent) {
			self._select(parent);
			self._navigate(parent);
			self._view.focusCamera(parent);
		}
	};
//================ END TEMP ================	
}

DialogOverviewController.extends(Object, {
	get view() {
		return this._view;
	},
	_select: function(entity) {
		var selection = this._selection;
		if (selection.indexOf(entity) >= 0) {
			this._view.focusCamera(entity);
		}

		selection.forEach(function(selected) {
			this._unselect(selected);
		}, this);
		selection.clear();
		selection.push(entity);

		Subtree.preOrder(entity, function(child) {
			child.widget.setSelected(true);
		});
	},
	_unselect: function(entity) {
		Subtree.preOrder(entity, function(child) {
			child.widget.setSelected(false);
		});
	},
	_navigate: function(entity) {
		var scene = this._scene;
		Subtree.preOrder(this._rootEntity, function(child) {
			child.widget.setLayerIndex(2);
			child.widget.setAttenuated(true);
		});
		this._selection.forEach(function(selected) {
			selected.widget.setAttenuated(false);
			selected.tree.children.forEach(function(child) {
				child.widget.setAttenuated(false);
			});
		});
	},
	update: function(delta) {
		Subtree.preOrder(this._rootEntity, function(child) {
			var nodeUpdateable = child.node.updateable;
			var widgetUpdateable = child.widget.updateable;
			if (nodeUpdateable) {
				nodeUpdateable.update(node, delta);
			}
			if (widgetUpdateable) {
				widgetUpdateable.update(node.widget, delta);
			}
		});
		
		this._view.update(delta);
		this._view.highlightNode(this._rootEntity);
	},
	render: function(engine) {
		this._view.render(engine);
	}
});