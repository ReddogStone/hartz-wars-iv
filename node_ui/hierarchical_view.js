'use strict';

function HierarchicalView(engine, viewport) {
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 1000),
		transformable: new Transformable(new Vecmath.Vector3(0, 10, 0.1)),
		updateable: new BehaviorsUpdateable()
	};
	this._scene = new Scene();
	this._engine = engine;
	
	this._mouse = {x: 0, y: 0};

//================ TEMP ================
	var scene = this._scene;
	var cam = this._cam;
	var self = this;
	
	cam.updateable.addBehavior(new FollowTargetBaseBehavior(0.1, function(entity) {
		return {value: entity.transformable.pos, target: self._nextCamPos};
	}));
	cam.updateable.addBehavior(new FollowTargetBaseBehavior(0.1, function(entity) {
		return {value: entity.camera.target, target: self._nextCamTarget};
	}));

	this._nextCamPos = cam.transformable.pos.clone();
	cam.camera.target = new Vecmath.Vector3(0, 0, 0);
	this._nextCamTarget = cam.camera.target;
	
	var nodeTemplate = {
		icon: 'data/textures/node',
		text: 'Root',
		children: [
			{text: 'Neu', icon: 'data/textures/new_icon', children: [
				{text: 'Dialog1', icon: 'data/textures/new_icon'},
				{text: 'Dialog2', icon: 'data/textures/new_icon'},
				{text: 'Dialog3', icon: 'data/textures/new_icon'},
				{text: 'Dialog4', icon: 'data/textures/new_icon'},
				{text: 'Dialog5', icon: 'data/textures/new_icon'},
				{text: 'Dialog6', icon: 'data/textures/new_icon'}
			]},
			{text: 'Laden', icon: 'data/textures/load_icon', children: [
				{text: 'Load1', icon: 'data/textures/load_icon', children: [
					{text: 'Unerwartet', icon: 'data/textures/save_icon'},
					{text: 'Wow', icon: 'data/textures/save_icon'},
					{text: 'WTF', icon: 'data/textures/save_icon'},
					{text: 'Cool', icon: 'data/textures/save_icon'},
					{text: 'Yay', icon: 'data/textures/save_icon'},
					{text: 'Yahoo', icon: 'data/textures/save_icon'}
				]},
				{text: 'Load2', icon: 'data/textures/load_icon'},
				{text: 'Load3', icon: 'data/textures/load_icon'},
				{text: 'Load4', icon: 'data/textures/load_icon'},
				{text: 'Load5', icon: 'data/textures/load_icon'},
				{text: 'Load6', icon: 'data/textures/load_icon'}
			]}, 
			{text: 'Speichern', icon: 'data/textures/save_icon'}, 
			{text: 'Hilfe', icon: 'data/textures/help_icon'}
		]
	};
	
	var rootNode = new ReflectionNode(engine, this, 'this');
	this._nodeTree = new NodeTree(rootNode);
	
	rootNode.widget.addToScene(scene);
//	this._nodeTree.push({nodes: [rootNode], parent: null});
//================ TEMP ================	
}
HierarchicalView.extends(Object, {
	_layoutSubtree: function(subtree) {
		var layout = new CircleLayout(new Vecmath.Vector3(0, -1, 0));
		var rootNode = subtree.node;
		var rootTransformable = rootNode.widget.transformable;
		var childTransformables = subtree.children.map(function(childTree) { return childTree.node.widget.transformable; });
		
		var expDepth = Math.pow(2, rootNode.depth);
		layout.apply(rootTransformable, childTransformables, 5 / expDepth, 0.5 / expDepth);
	},
	_applyExpansionVisuals: function(subtree) {
		var rootNode = subtree.node;
		var scene = this._scene;
		var engine = this._engine;
		
		var behavior = new ExpAttBehavior(1, 0.0, 1.0, function(entity, value) {
			entity.widget.setAlpha(value);

			var line = entity.line;
			if (line) {
				line.renderable.material.color.alpha = 0.4 * value;
			}
		});
		
		subtree.forEachChildNode(function(child) {
			// fade-in
			child.updateable = new BehaviorsUpdateable();
			child.updateable.addBehavior(behavior);
			child.widget.setAlpha(0);
			
			// add line from parent
			var endPoint1 = rootNode.widget.transformable;
			var endPoint2 = child.widget.transformable;
			var line = {
				renderable: new LineRenderable(engine, 'data/textures/line_pattern', endPoint1, endPoint2)
			};
			var mat = line.renderable.material;
			mat.color = BLUE;
			mat.color.alpha = 0.0;
			mat.width = 10;
			scene.addEntity(line);
			child.line = line;
		});
	},
	_navigateToSubtree: function(subtree) {
		var scene = this._scene;
		var result = this._nodeTree.navigateTo(this._engine, subtree);
		
		var expanded = result.expanded;
		if (expanded) {
			this._layoutSubtree(expanded);
			this._applyExpansionVisuals(expanded);
			expanded.forEachChildNode(function(node) {
				node.widget.addToScene(scene);
			});
		}

		var removed = result.removed;
		removed.forEach(function(removedSubtree) {
			removedSubtree.forEachNode(function(removedNode) {
				removedNode.widget.removeFromScene(scene);
				
				var line = removedNode.line;
				if (line) {
					scene.removeEntity(line);
				}
			});
		});
		
		var activeDepth = this._nodeTree.activeSubtree.node.depth;
		this._nodeTree.forEachNode(function(node) {
			var depth = node.depth;
			var delta = depth - activeDepth;
			node.widget.setLayerIndex(Math.max(delta - 1, 0));
			if ((delta > 1) || (delta < -1)) {
				node.widget.setAttenuated(true);
			} else {
				node.widget.setAttenuated(false);
			}
		});
	},
	_highlightNode: function(mouse) {
		var camera = this._cam.camera;
		var view = camera.getView(this._cam.transformable);
		var projection = camera.getProjection();
		var invProjectionView = projection.clone().mul(view).invert();
		var viewport = this._viewport.toVector4();
		var mouseRayFrom = new Vecmath.Vector3(mouse.x, mouse.y, 0.0).unproject(viewport, invProjectionView);
		var mouseRayTo = new Vecmath.Vector3(mouse.x, mouse.y, 1.0).unproject(viewport, invProjectionView);
		var mouseRay = new Vecmath.Ray(mouseRayFrom, mouseRayTo);
		
		var minDist = 10000000000.0;
		this._highlighted = null;
		
		var activeSubtrees = this._nodeTree.getActiveSubtrees();
		activeSubtrees.forEach(function(subtree) {
			var node = subtree.node;
			var dist = Vecmath.distPointRay(node.widget.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = subtree;
			}
		}, this);
		activeSubtrees.forEach(function(subtree) {
			var node = subtree.node;
			node.widget.setHighlighted(subtree == this._highlighted);
			
			var color = BLUE;
			var line = node.line;
			if (line) {
				var lineColor = Color.clone(color);
				lineColor.alpha = line.renderable.material.color.alpha;
				line.renderable.material.color = lineColor;
			}
		}, this);
	},
	update: function(delta) {
		this._cam.updateable.update(this._cam, delta);
		
		this._nodeTree.forEachNode(function(node) {
			if (node.updateable) {
				node.updateable.update(node, delta);
			}
		});
		
		this._highlightNode(this._mouse);
	},
	render: function() {
		this._scene.render(this._engine, this._viewport, this._cam);
	},
	mouseDown: function(event) {
		this._drag = {x: event.x, y: event.y};
		this._dragStart = {x: event.x, y: event.y};
		this._click = true;
	},
	mouseMove: function(event) {
		this._mouse.x = event.x;
		this._mouse.y = event.y;
		
		if (event.down) {
			var dx = event.x - this._drag.x;
			var dy = event.y - this._drag.y;
			this._cam.camera.rotateAroundTargetHoriz(this._cam.transformable, -0.005 * dx);
			this._cam.camera.rotateAroundTargetVert(this._cam.transformable, -0.01 * dy);
			this._nextCamPos = this._cam.transformable.pos.clone();
			this._drag = {x: event.x, y: event.y};
			
			if (this._click) {
				dx = event.x - this._dragStart.x;
				dy = event.y - this._dragStart.y;
				this._click = Math.abs(dx + dy) < 10;
			}
		}
	},
	mouseUp: function(event) {
		var highlighted = this._highlighted;
		if (this._click && highlighted) {
			this._navigateToSubtree(highlighted);
			
			var camera = this._cam.camera;
			var camTrans = this._cam.transformable;
			var activeNode = this._nodeTree.activeSubtree.node;
			
			var targetPos = camera.getTargetPos();
			var offset = camTrans.pos.clone().sub(targetPos).normalize();
			var expDepth = Math.pow(2, activeNode.depth);
			offset.scale(10 / expDepth);
			
			this._nextCamTarget = activeNode.widget.transformable.pos.clone().add(new Vecmath.Vector3(0, -0.5 / expDepth, 0));
			this._nextCamPos = this._nextCamTarget.clone().add(offset);
		}
	}
});