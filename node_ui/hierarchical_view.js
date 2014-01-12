'use strict';

function HierarchicalView(engine, viewport) {
	this._viewport = viewport || new Viewport();
	this._cam = {
		camera: new Camera(0.5 * Math.PI, g_canvas.width / g_canvas.height, 0.01, 1000),
		transformable: new Transformable(new Vecmath.Vector3(0, 60, 0.1)),
		updateable: new BehaviorsUpdateable()
	};
	this._scene = new Scene();
	var spriteBatch = new PointSpriteBatchRenderable(engine, 'data/textures/icon_atlas', new AtlasDesc(8, 8));
	var spriteBatchEntity = {
		renderable: spriteBatch
	};
	this._scene.spriteBatch = spriteBatch;
	this._scene.addEntity(spriteBatchEntity);
	
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
	focusCamera: function(subtree) {
		var camera = this._cam.camera;
		var camTrans = this._cam.transformable;
		
		var targetPos = camera.getTargetPos();
		var offset = camTrans.pos.clone().sub(targetPos);

		var layout = subtree.layout;
		this._nextCamTarget = layout.center.clone().add(subtree.node.widget.transformable.pos);
		this._nextCamPos = this._nextCamTarget.clone().add(offset.normalize().scale(5 + 0.5 * Math.max(layout.width, layout.height)));
	},
	highlightNode: function(nodeTree) {
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
		
		var activeSubtrees = nodeTree.getActiveSubtrees();
		nodeTree.forEachSubtree(function(subtree) {
			var node = subtree.node;
			var dist = Vecmath.distPointRay(node.widget.transformable.pos, mouseRay);
			if (dist < minDist) {
				minDist = dist;
				this._highlighted = subtree;
			}
		}, this);
		nodeTree.forEachNode(function(node) {
			node.widget.setHighlighted(node == this._highlighted.node);
			
			var color = BLUE;
			var line = node.line;
			if (line) {
				var lineColor = Color.clone(color);
				lineColor.alpha = line.renderable.material.color.alpha;
				line.renderable.material.color = lineColor;
			}
		}, this);
	},
	showSubtree: function(subtree) {
		subtree.node.widget.addToScene(this._scene);
	},
	hideSubtree: function(subtree) {
		subtree.node.widget.removeFromScene(this._scene);
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
		if (this._click && highlighted && this.onSubtreeClicked) {
			this.onSubtreeClicked(highlighted);
		}
	},
	keyDown: function(event) {
//		console.log('keyDown: ' + String.fromCharCode(event.keyCode));
		switch (event.keyCode) {
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
//		console.log('keyPress: ' + String.fromCharCode(event.keyCode));
	},
	keyUp: function(event) {
//		console.log('keyUp:' + String.fromCharCode(event.keyCode));
	}
});