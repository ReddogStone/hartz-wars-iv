'use strict';

function HierarchicalView(viewport) {
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 1000),
		transformable: new Transformable(new Vecmath.Vector3(0, 9, 5)),
		updateable: new BehaviorsUpdateable()
	};
	this._scene = new Scene();
	this._items = [];

//================ TEMP ================
	var items = this._items;
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
	
	var widgets = [
		{text: 'Neu', icon: 'data/textures/new_icon.png'},
		{text: 'Laden', icon: 'data/textures/load_icon.png'}, 
		{text: 'Speichern', icon: 'data/textures/save_icon.png'}, 
		{text: 'Hilfe', icon: 'data/textures/help_icon.png'}
	];
	var SPRITE_COUNT = widgets.length;
	var transforms = [];
	
	var sprite = {
		renderable: new PointSpriteRenderable(Engine3D, 'data/textures/node.png'),
		transformable: new Transformable(new Vecmath.Vector3(0, 2, 0))
	};
	var mat = sprite.renderable.material;
	mat.color = BLUE;
	mat.size = new Vecmath.Vector2(80, 80);
	
	scene.addEntity(sprite);
	transforms.push(sprite.transformable);
	items.push({sprite: sprite});
	
	cam.camera.target = new Vecmath.Vector3(0, 0, 0);
	this._nextCamTarget = cam.camera.target;
	
	for (var i = 0; i < SPRITE_COUNT; ++i) {
		var angle = (i / SPRITE_COUNT - 0.5) * Math.PI * 2;
		var pos = new Vecmath.Vector3(5 * Math.sin(angle), 0, 5 * Math.cos(angle));
		
		var sprite = {
			renderable: new PointSpriteRenderable(Engine3D, widgets[i].icon),
			transformable: new Transformable(pos)
		};
		var mat = sprite.renderable.material;
		mat.color = BLUE;
		mat.size = new Vecmath.Vector2(64, 64);

		var font = new Font('Georgia', 12);
		var label = {
			renderable: new TextRenderable(Engine3D, widgets[i].text, font, BLUE, new Vecmath.Vector2(0.0, -50.0)),
			transformable: new Transformable(pos)
		};
		var mat = label.renderable.material;
		mat.color = BLUE;
		
		scene.addEntity(sprite);
		scene.addEntity(label);
		transforms.push(sprite.transformable);
		
		items.push({sprite: sprite, label: label});
	}
	
	for (var i = 0; i < transforms.length - 1; ++i) {
		var endPoint1 = transforms[0];
		var endPoint2 = transforms[i + 1];
		var line = {
			renderable: new LineRenderable(Engine3D, 'data/textures/line_pattern.png', endPoint1, endPoint2)
		};
		var mat = line.renderable.material;
		mat.color = BLUE;
		mat.color.alpha = 0.4;
		mat.width = 10;
		scene.addEntity(line);
		items[i + 1].line = line;
	}
//================ TEMP ================	
}
HierarchicalView.extends(Object, {
	update: function(delta) {
		this._cam.updateable.update(this._cam, delta);
	
//		Vecmath.expAttVec(this._cam.transformable.pos, this._nextCamPos, delta, 0.1);
//		Vecmath.expAttVec(this._cam.camera.target, this._nextCamTarget, delta, 0.1);
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
		this._items.forEach(function(item) {
			var sprite = item.sprite;
			var dist = Vecmath.distPointRay(sprite.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = item;
			}
		}, this);
		this._items.forEach(function(item) {
			var color = BLUE;
			if (item == this._highlighted) {
				color = HIGHLIGHTED;
			}
			item.sprite.renderable.material.color = color;
			if (item.label) {
				item.label.renderable.material.color = color;
			}
			if (item.line) {
				var lineColor = Color.clone(color);
				lineColor.alpha = item.line.renderable.material.color.alpha;
				item.line.renderable.material.color = lineColor;
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
			var sprite = this._highlighted.sprite;
			var camera = this._cam.camera;
			var camTrans = this._cam.transformable;
			
			var targetPos = camera.getTargetPos();
			var offset = camTrans.pos.clone().sub(targetPos);
			this._nextCamTarget = sprite.transformable.pos.clone().add(new Vecmath.Vector3(0, -2, 0));
			this._nextCamPos = this._nextCamTarget.clone().add(offset);
		}
	}
});