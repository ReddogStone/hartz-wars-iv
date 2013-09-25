'use strict';

function StreetScene() {
	Scene.apply(this);

	var playerImage = new Image();
	playerImage.src = 'data/walk_anim.png';
	
	var bgImg = new Image();
	bgImg.src = 'data/street_bg.png';
	
	var homeDoorHighlightImg = new Image();
	homeDoorHighlightImg.src = 'data/street_home_door_highlight.png';
	
	var mapImg = new Image();
	mapImg.src = 'http://thumb1.shutterstock.com/display_pic_with_logo/623560/623560,1315411594,2/stock-vector-editable-vector-street-map-of-a-generic-city-with-push-pins-all-d-buildings-arrows-and-push-pins-84206464.jpg';

	var background = new Scene();	
	background.addChild(new Sprite(new Size(1024, 640), bgImg));
	this.addChild(background);
	this.mouseHandler.addHandler(background);
	
	var foreground = new Scene();
	this.addChild(foreground);
	this.mouseHandler.addHandler(foreground);
	
	var mapOverlay = new Scene();
	mapOverlay.anchor = new Point(0.5, 0.5);
	mapOverlay.pos = new Pos(0.5 * mapOverlay.size.x, 0.5 * mapOverlay.size.y);
	this.addChild(mapOverlay);
	this.mouseHandler.addHandler(mapOverlay);
	
	var sprite = new Sprite(new Size(450, 470), mapImg);
	sprite.anchor = new Point(0.5, 0.5);
	sprite.pos = new Pos(0.5 * mapOverlay.size.x, 0.5 * mapOverlay.size.y);
	mapOverlay.addChild(sprite);
	
	var buttonEffects = [new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state == ButtonState.ACTIVE) {
				button.label.color = 'rgba(0,0,0,1)';
				button.setLabelOffset(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = 'rgba(255,0,0,1)';
				button.setLabelOffset(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = 'rgba(0,120,0,1)';
				button.setLabelOffset(0, 0);
			}
		})];

	var button = new Button(new Size(0, 0), undefined, buttonEffects);
	button.pos = new Pos(sprite.pos.x - 100, sprite.pos.y - 100);
	var label = button.label;
	label.text = 'Zuhause';
	label.font = new Font('Comic Sans MS', 16, '900', 'italic');
	button.size = cloneSize(label.size);

	var self = this;
	button.onClicked = function() { 
		if (self.onEnterHome) self.onEnterHome();
		mapOverlay.visible = false;
	};
	mapOverlay.addChild(button);
	mapOverlay.mouseHandler.addHandler(button);
	this.mapOverlay = mapOverlay;
	
	sprite = new Sprite(new Size(150, 300), playerImage, new Rect(30, 30, 100, 200));
	sprite.pos = new Pos(400, 600);
	sprite.anchor = new Point(0, 1.0);
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	this.playerBody = sprite;
	foreground.addChild(sprite);
	
	var buttonEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor('rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgba(0,120,0,1)'),
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state != ButtonState.ACTIVE) {
				button.sprite.blend = 'screen';
			} else {
				button.sprite.blend = 'source-over';
			}
		})];
	button = new Button(new Size(150, 265), homeDoorHighlightImg, buttonEffects);
	button.pos = new Pos(730, 0);

	button.onClicked = function() { 
		if (self.onEnterHome) self.onEnterHome(); 
	};
	button.setLabelOffset(-150, -100);
	label = button.label;
	label.text = 'Reingehen';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);

	buttonEffects = [new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state == ButtonState.ACTIVE) {
				button.label.color = 'rgba(255,255,255,1)';
				button.setLabelOffset(0, 0);
			} else if (state == ButtonState.PRESSED) {
				button.label.color = 'rgba(255,0,0,1)';
				button.setLabelOffset(2, 2);
			} else if (state == ButtonState.HOVERED) {
				button.label.color = 'rgba(0,120,0,1)';
				button.setLabelOffset(0, 0);
			}
		})];
	button = new Button(new Size(120, 60), undefined, buttonEffects);
	button.anchor = new Point(0, 1);
	button.pos = new Pos(20, 748);
	button.onClicked = function() { 
		mapOverlay.visible = true;
		mapOverlay.addAction(new LinearAction(0.2, function(value) {
			mapOverlay.scale.x = value;
			mapOverlay.scale.y = value;
			mapOverlay.color = 'rgba(255,255,255,' + value + ')';
		}));
	};
	label = button.label;
	label.text = 'Karte';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	button.size = cloneSize(label.size);
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);
};
StreetScene.extends(Scene, {
	init: function() {
		this.mapOverlay.visible = false;
	}
});