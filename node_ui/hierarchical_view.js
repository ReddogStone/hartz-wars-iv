'use strict';

function HierarchicalView(engine, viewport) {
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 1000),
		transformable: new Transformable(new Vecmath.Vector3(0, 9, 5)),
		updateable: new BehaviorsUpdateable()
	};
	this._scene = new Scene();
	this._widgets = [];

//================ TEMP ================
	var widgets = this._widgets;
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
	
	var widgetDescriptions = [
		{text: 'Neu', icon: 'data/textures/new_icon.png'},
		{text: 'Laden', icon: 'data/textures/load_icon.png'}, 
		{text: 'Speichern', icon: 'data/textures/save_icon.png'}, 
		{text: 'Hilfe', icon: 'data/textures/help_icon.png'}
	];
	var SPRITE_COUNT = widgetDescriptions.length;
	var transforms = [];
	
	var widget = new IconTextWidget(engine, 'data/textures/node.png', 80, BLUE);
	widget.transformable.pos = new Vecmath.Vector3(0, 2, 0);
	widget.addToScene(scene);
	widgets.push(widget);
	transforms.push(widget.transformable);
	
	cam.camera.target = new Vecmath.Vector3(0, 0, 0);
	this._nextCamTarget = cam.camera.target;
	
	var layout = new CircleLayout(5, new Vecmath.Vector3(0, -1, 0), new Vecmath.Vector3(0, -2, 0));
	var childTransforms = [];
	
	var font = new Font('Helvetica', 12);
	var textOffset = new Vecmath.Vector2(0.0, -50.0);
	for (var i = 0; i < SPRITE_COUNT; ++i) {
		var childWidget = new IconTextWidget(engine, widgetDescriptions[i].icon, 64, BLUE, widgetDescriptions[i].text, font, textOffset);
		childWidget.addToScene(scene);
		widgets.push(childWidget);
		childTransforms.push(childWidget.transformable);
	}
	
	layout.apply(widget.transformable, childTransforms);
	
	transforms = transforms.concat(childTransforms);
	for (var i = 0; i < transforms.length - 1; ++i) {
		var endPoint1 = transforms[0];
		var endPoint2 = transforms[i + 1];
		var line = {
			renderable: new LineRenderable(engine, 'data/textures/line_pattern.png', endPoint1, endPoint2)
		};
		var mat = line.renderable.material;
		mat.color = BLUE;
		mat.color.alpha = 0.4;
		mat.width = 10;
		scene.addEntity(line);
		widgets[i + 1].line = line;
	}
//================ TEMP ================	
}
HierarchicalView.extends(Object, {
	update: function(delta) {
		this._cam.updateable.update(this._cam, delta);
	},
	render: function(engine) {
		this._scene.render(engine, this._viewport, this._cam);
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
		this._widgets.forEach(function(widget) {
			var dist = Vecmath.distPointRay(widget.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = widget;
			}
		}, this);
		this._widgets.forEach(function(widget) {
			var color = BLUE;
			if (widget == this._highlighted) {
				color = HIGHLIGHTED;
			}
			widget.color = color;
			if (widget.line) {
				var lineColor = Color.clone(color);
				lineColor.alpha = widget.line.renderable.material.color.alpha;
				widget.line.renderable.material.color = lineColor;
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
		if (this._click && this._highlighted) {
			var camera = this._cam.camera;
			var camTrans = this._cam.transformable;
			
			var targetPos = camera.getTargetPos();
			var offset = camTrans.pos.clone().sub(targetPos);
			this._nextCamTarget = this._highlighted.transformable.pos.clone().add(new Vecmath.Vector3(0, -2, 0));
			this._nextCamPos = this._nextCamTarget.clone().add(offset);
		}
	}
});