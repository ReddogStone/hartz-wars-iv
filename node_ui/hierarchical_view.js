'use strict';

function HierarchicalView(engine, viewport) {
	this._engine = engine;
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 5000),
		transformable: new Transformable(new Vecmath.Vector3(0, 60, 0.1)),
		updateable: new BehaviorsUpdateable()
	};

	// scene
	this._scene = new Scene();

	var lineBatch = new LineBatchRenderable(engine, 'data/textures/line_patterns', 2);
	var lineBatchEntity = {
		renderable: lineBatch
	};
	this._scene.lineBatch = lineBatch;
	this._scene.addEntity(lineBatchEntity);

	var spriteBatch = new PointSpriteBatchRenderable(engine, 'data/textures/icon_atlas', new AtlasDesc(8, 8));
	var spriteBatchEntity = {
		renderable: spriteBatch
	};
	this._scene.spriteBatch = spriteBatch;
	this._scene.addEntity(spriteBatchEntity);

	// mouse
	this._mouse = {x: 0, y: 0};
	
	var self = this;
	var cam = this._cam;
	cam.updateable.addBehavior(new FollowTargetBaseBehavior(0.1, function(entity) {
		return {value: entity.transformable.pos, target: self._nextCamPos};
	}));
	cam.updateable.addBehavior(new FollowTargetBaseBehavior(0.1, function(entity) {
		return {value: entity.camera.target, target: self._nextCamTarget};
	}));

	this._nextCamPos = cam.transformable.pos.clone();
	cam.camera.target = new Vecmath.Vector3(0, 0, 0);
	this._nextCamTarget = cam.camera.target;	
}

HierarchicalView.extends(Object, {
	focusCamera: function(entity) {
		var camera = this._cam.camera;
		var camTrans = this._cam.transformable;
		
		var targetPos = camera.getTargetPos();
		var offset = camTrans.pos.clone().sub(targetPos);

		var layout = entity.layout;
		this._nextCamTarget = layout.center.clone().add(entity.transformable.pos);
		this._nextCamPos = this._nextCamTarget.clone().
			add(offset.normalize().scale(5 + 0.5 * Math.max(layout.width, layout.height)));
	},
	highlightNode: function(rootEntity) {
		var mouse = this._mouse;
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
		
		Subtree.preOrder(rootEntity, function(child) {
			var dist = Vecmath.distPointRay(child.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = child;
			}			
		}, this);
		Subtree.preOrder(rootEntity, function(child) {
			var highlighted = (child == this._highlighted);
			child.widget.setHighlighted(highlighted);
			child.layout.setHighlighted(highlighted);
		}, this);
	},
	show: function(entity) {
		var scene = this._scene;
		Layout.dialogTreeOverviewLayout(this._engine, scene, entity);
		//Layout.treeOverviewLayout(this._engine, scene, entity);
		Subtree.preOrder(entity, function(child) {
			child.layout.addToScene(scene);
			child.widget.addToScene(scene);
		});
	},
	hide: function(entity) {
		var scene = this._scene;
		Subtree.preOrder(entity, function(child) {
			child.layout.removeFromScene(scene);
			child.widget.removeFromScene(scene);
			delete child.layout;
			delete child.widget;
		});
	},
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
		if (this._click && highlighted && this.onClicked) {
			this.onClicked(highlighted);
		}
	},
	keyDown: function(event) {
		switch (event.keyCode) {
			case 17: // CTRL
				if (this.onAction) {
					this.onAction(this._highlighted);
				}
				break;
			case 27: // ESCAPE
				if (this.onLevelUp) {
					this.onLevelUp();
				}
				this._mouse.x = 512;
				this._mouse.y = 384;
				break;
			case 38: // UP_ARROW
				var camera = this._cam.camera;
				var camTrans = this._cam.transformable;
				var targetPos = camera.getTargetPos();
				var offset = camTrans.pos.clone().sub(targetPos);
				this._nextCamPos = this._nextCamTarget.clone().add(offset.scale(1 / 1.1));
				break;
			case 40: // DOWN_ARROW
				var camera = this._cam.camera;
				var camTrans = this._cam.transformable;
				var targetPos = camera.getTargetPos();
				var offset = camTrans.pos.clone().sub(targetPos);
				this._nextCamPos = this._nextCamTarget.clone().add(offset.scale(1.1));
				break;
			case 80: // P
				FrameProfiler.toggle();
				break;
		}
	},
	keyPress: function(event) {
	},
	keyUp: function(event) {
	}
});