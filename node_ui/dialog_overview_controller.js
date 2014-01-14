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
			function(scene, world) { scene.exit(); }
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

function DialogOverviewController(engine, viewport) {
	var view = this._view = new HierarchicalView(engine, viewport);
	this._engine = engine;

//================ TEMP ================
	var rootNode = new DialogNode(motherDialogTemplate);
//	var containerNode = new ContainerNode(engine, [rootNode]);
	this._nodeTree = new NodeTree(rootNode);
	this._nodeTree.expandAll();

	this._layoutAll();
	this._nodeTree.forEachSubtree(function(subtree) {
		view.showSubtree(subtree);
	});
	
	var rootSubtree = this._nodeTree.root;
	this._navigateToSubtree(rootSubtree);
	view.focusCamera(rootSubtree);
	
	var self = this;
	view.onSubtreeClicked = function(subtree) {
		self._navigateToSubtree(subtree);
	};
	view.onLevelUp = function() {
		var active = self._nodeTree.activeSubtree;
		if (active.parent) {
			self._navigateToSubtree(active.parent);
		}
	};
//================ END TEMP ================	
}

DialogOverviewController.extends(Object, {
	get view() {
		return this._view;
	},
	_createWidget: function(data) {
		var iconAtlasIndex = 13;
		var text = '';
		var offset = new Vecmath.Vector2(0.0, 0.0);
		var color = BLUE;
		
		switch (data.type) {
			case 'list':
				iconAtlasIndex = 0;
				offset = new Vecmath.Vector2(50.0, 0.0);
				break;
			case 'statement':
				switch (data.side) {
					case 'left': color = RED; break;
					case 'right': color = BLUE; break;
				}
				break;
			case 'options':
				iconAtlasIndex = 10;
				offset = new Vecmath.Vector2(50.0, 0.0);
				break;
			case 'action':
				iconAtlasIndex = 5;
				offset = new Vecmath.Vector2(50.0, 0.0);
				break;
		}
		var font = new Font('Helvetica', 9);
		var spriteBatch = this._view._scene.spriteBatch;
		return new IconTextWidget(this._engine, spriteBatch, iconAtlasIndex, data.text ? 16 : 64, color, data.text || data.type, font, offset);
	},
	_layoutAll: function() {
		this._layoutSubtree(this._nodeTree.root);
		this._nodeTree.forEachSubtree(function(subtree) {
			if (subtree.parent) {
				subtree.node.widget.transformable.translate(subtree.parent.node.widget.transformable.pos);
			}
		});
	},
	_calculateLayoutInfo: function(subtree) {
		var ownPos = subtree.node.widget.transformable.pos;
		var minZ = 0;
		var maxZ = 0;
		var minX = 0;
		var maxX = 0;
		subtree.children.forEach(function(child) {
			var childLayout = child.layout;
			var childPos = child.node.widget.transformable.pos;
			var delta = childPos.clone().sub(ownPos);
			var center = delta.add(childLayout.center);
			var childMinX = center.x - 0.5 * childLayout.width;
			var childMaxX = center.x + 0.5 * childLayout.width;
			var childMinZ = center.z - 0.5 * childLayout.height;
			var childMaxZ = center.z + 0.5 * childLayout.height;
			
			minX = Math.min(minX, childMinX);
			maxX = Math.max(maxX, childMaxX);
			minZ = Math.min(minZ, childMinZ);
			maxZ = Math.max(maxZ, childMaxZ);
		});
		return {
			center: new Vecmath.Vector3(0.5 * (minX + maxX), 0.0, 0.5 * (minZ + maxZ)),
			width: maxX - minX,
			height: maxZ - minZ
		};
	},
	_layoutSubtree: function(subtree) {
		subtree.forEachSubtree(function(child) {
			var node = child.node;
			node.widget = this._createWidget(node.data);
		}, this);

		Layout.treeOverviewLayout(subtree, function(tree) { return (tree.node.data.type == 'options'); });

		// add lines
		var engine = this._engine;
		subtree.forEachSubtree(function(root) {
			var rootTrans = root.node.widget.transformable;
			if (root.node.data.type == 'options') {
				root.children.forEach(function(child) {
					var widget = child.node.widget;
					var line = new LineRenderable(engine, 'data/textures/line_pattern', rootTrans, widget.transformable);
					var mat = line.material;
					mat.color = BLUE;
					mat.color.alpha = 0.3;
					mat.width = 10;
					widget.addLine(line);
				});
			} else {
				var last = root;
				root.children.forEach(function(child) {
					var widget = child.node.widget;
					if (last) {
						var lastWidget = last.node.widget;
						var line = new LineRenderable(engine, 
								'data/textures/full_line_pattern', 
								lastWidget.transformable,
								widget.transformable);
						var mat = line.material;
						mat.color = BLUE;
						mat.color.alpha = 0.3;
						mat.width = 2;
						widget.addLine(line);
					}
					last = child;
				});
			}
		});
	},
	_fadeIn: function(subtrees) {
		var behavior = new ExpAttBehavior(1, 0.0, 1.0, function(entity, value) {
			entity.widget.setAlpha(value);

			var line = entity.line;
			if (line) {
				line.renderable.material.color.alpha = 0.4 * value;
			}
		});
		
		subtrees.forEach(function(subtree) {
			var node = subtree.node;
			node.updateable = new BehaviorsUpdateable();
			node.updateable.addBehavior(behavior);
			node.widget.setAlpha(0);
		});
	},
	_addLines: function(subtrees) {
		var engine = this._engine;
		subtrees.forEach(function(subtree) {
			var node = subtree.node;
			var parentNode = subtree.parent.node;
			if (parentNode.type !== 'options') {
				return;
			}
			
			var endPoint1 = parentNode.widget.transformable;
			var endPoint2 = node.widget.transformable;
			var line = {
				renderable: new LineRenderable(engine, 'data/textures/line_pattern', endPoint1, endPoint2)
			};
			var mat = line.renderable.material;
			mat.color = BLUE;
			mat.color.alpha = 0.0;
			mat.width = 10;
//			scene.addEntity(line);
			node.line = line;
		});
	},
	_navigateToSubtree: function(subtree) {
		var scene = this._scene;
		var result = this._nodeTree.navigateTo(subtree);
		var view = this._view;
		
/*		var expanded = result.expanded;
		if (expanded) {
			this._layoutSubtree(expanded);
			this._addLines(expanded.children);
			this._fadeIn(expanded.children);
			expanded.forEachSubtree(function(subtree) {
				view.showSubtree(subtree);
			});
		}

		var removed = result.removed;
		removed.forEach(function(removedSubtree) {
			removedSubtree.forEachSubtree(function(subtree) {
				view.hideSubtree(subtree);
				
				var line = removedNode.line;
				if (line) {
//					scene.removeEntity(line);
				}
			});
		});
		
		var activated = result.activated;
		this._addLines(activated);
		this._fadeIn(activated);
		activated.forEach(function(activatedSubtree) {
			activatedSubtree.forEachSubtree(function(subtree) {
				view.showSubtree(subtree);
			});
		}, this); */
		
		var activeDepth = this._nodeTree.activeSubtree.node.depth;
		this._nodeTree.forEachNode(function(node) {
			node.widget.setLayerIndex(2);
			node.widget.setAttenuated(false);
			node.widget.setAttenuated(true);
		});
		this._nodeTree.activeSubtree.node.widget.setLayerIndex(2);
		this._nodeTree.activeSubtree.node.widget.setAttenuated(false);
		this._nodeTree.activeSubtree.children.forEach(function(child) {
			child.node.widget.setLayerIndex(2);
			child.node.widget.setAttenuated(false);
		});
		
		view.focusCamera(this._nodeTree.activeSubtree);
	},
	update: function(delta) {
		this._nodeTree.forEachNode(function(node) {
			if (node.updateable) {
				node.updateable.update(node, delta);
			}
		});
		
		this._view.update(delta);
		this._view.highlightNode(this._nodeTree);
	},
	render: function(engine) {
		this._view.render(engine);
	}
});