'use strict';

function HierarchicalView(engine, viewport) {
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 1000),
		transformable: new Transformable(new Vecmath.Vector3(0, 9, 5)),
		updateable: new BehaviorsUpdateable()
	};
	this._scene = new Scene();
	this._nodeTree = [];
	this._engine = engine;

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
				{text: 'Dialog6', icon: 'data/textures/new_icon'},
			]},
			{text: 'Laden', icon: 'data/textures/load_icon'}, 
			{text: 'Speichern', icon: 'data/textures/save_icon'}, 
			{text: 'Hilfe', icon: 'data/textures/help_icon'}
		]
	};
	var layout = new CircleLayout(5, new Vecmath.Vector3(0, -1, 0), new Vecmath.Vector3(0, -2, 0));
	
	var rootNode = new TemplateNode(engine, nodeTemplate, layout);
	rootNode.widget.addToScene(scene);
	this._nodeTree.push({nodes: [rootNode], parent: null});
//================ TEMP ================	
}
HierarchicalView.extends(Object, {
	update: function(delta) {
		this._cam.updateable.update(this._cam, delta);
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
		var camera = this._cam.camera;
		var view = camera.getView(this._cam.transformable);
		var projection = camera.getProjection();
		var invProjectionView = projection.clone().mul(view).invert();
		var viewport = this._viewport.toVector4();
		var mouseRayFrom = new Vecmath.Vector3(event.x, event.y, 0.0).unproject(viewport, invProjectionView);
		var mouseRayTo = new Vecmath.Vector3(event.x, event.y, 1.0).unproject(viewport, invProjectionView);
		var mouseRay = new Vecmath.Ray(mouseRayFrom, mouseRayTo);
		
		var minDist = 10000000000.0;
		this._highlighted = null;
		
		var currentLayer = this._nodeTree.last();
		var currentNodes = currentLayer.nodes.slice(0);
		if (currentLayer.parent) {
			currentNodes.push(currentLayer.parent);
		}
		
		currentNodes.forEach(function(node) {
			var dist = Vecmath.distPointRay(node.widget.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = node;
			}
		}, this);
		currentNodes.forEach(function(node) {
			var color = BLUE;
			if (node == this._highlighted) {
				color = HIGHLIGHTED;
			}
			node.widget.color = color;
			
			var line = node.line;
			if (line) {
				var lineColor = Color.clone(color);
				lineColor.alpha = line.renderable.material.color.alpha;
				line.renderable.material.color = lineColor;
			}
		}, this);
		
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
			var camera = this._cam.camera;
			var camTrans = this._cam.transformable;
			
			var targetPos = camera.getTargetPos();
			var offset = camTrans.pos.clone().sub(targetPos);
			this._nextCamTarget = this._highlighted.widget.transformable.pos.clone().add(new Vecmath.Vector3(0, -2, 0));
			this._nextCamPos = this._nextCamTarget.clone().add(offset);
			
			var scene = this._scene;
			var currentLayer = this._nodeTree.last();
			if (highlighted === currentLayer.parent) {
				currentLayer.nodes.forEach(function(node) {
					node.widget.removeFromScene(scene);
					var line = node.line;
					if (line) {
						scene.removeEntity(line);
					}
				});
				this._nodeTree.splice(this._nodeTree.length - 1, 1);
			} else {
				var engine = this._engine;
				var children = highlighted.createChildren(engine);
				if (children.length > 0) {
					children.forEach(function(child) {
						child.widget.addToScene(scene);
						
						var endPoint1 = highlighted.widget.transformable;
						var endPoint2 = child.widget.transformable;
						var line = {
							renderable: new LineRenderable(engine, 'data/textures/line_pattern', endPoint1, endPoint2)
						};
						var mat = line.renderable.material;
						mat.color = BLUE;
						mat.color.alpha = 0.4;
						mat.width = 10;
						scene.addEntity(line);
						child.line = line;
					});
					this._nodeTree.push({nodes: children, parent: highlighted});
				}
			}
		}
	}
});