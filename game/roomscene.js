'use strict';

function RoomScene() {
	Scene.apply(this);

	var image = new Image();
	image.src = 'data/walk_anim.png';
	
	var roomDoorHighlightImg = new Image();
	roomDoorHighlightImg.src = 'data/room_door_highlight.png';
	
	var bgImg = new Image();
	bgImg.src = 'data/room_bg.png';
	
	var background = new Scene();
	this.addChild(background);
	this.mouseHandler.addHandler(background);

	background.addChild(new Sprite(new Size(1024, 640), bgImg));
	
	var foreground = new Scene();
	this.addChild(foreground);
	this.mouseHandler.addHandler(foreground);
	
	var sprite = new Sprite(new Size(150, 300), image, new Rect(30, 30, 100, 200));
	sprite.pos = new Pos(350, 600);
	sprite.anchor = new Point(0, 1.0);
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.addAction(animation);
	foreground.addChild(sprite);
	
	var buttonEffects = [
		new JumpingLabel(2, 2), 
		new ChangingColor('rgba(255,255,255,0)', 'rgba(255,0,0,1)', 'rgba(0,200,0,1)'),
		new GenericButtonEffect( function(button) {
			var state = button.getState();
			if (state != ButtonState.ACTIVE) {
				button.sprite.blend = 'lighten';
			} else {
				button.sprite.blend = 'source-over';
			}
		})];
	var button = new Button(new Size(148, 286), roomDoorHighlightImg, buttonEffects);
	button.pos = new Pos(630, 152);
	button.setLabelOffset(0, -50);
	var self = this;
	button.onClicked = function() { if (self.onExitToStreet) self.onExitToStreet(); };
	var label = button.label;
	label.text = 'Rausgehen';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);
}
RoomScene.extends(Scene);
	