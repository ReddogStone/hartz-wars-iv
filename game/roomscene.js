function createRoomScene(context) {
	'use strict';

	var image = new Image();
	image.src = 'data/walk_anim.png';
	
	var buttonImg = new Image();
	buttonImg.src = 'data/cartoon_button.png';
	
	var bgImg = new Image();
	bgImg.src = 'data/room_bg.jpg';
	
	var root = new Scene();
	
	var background = new Scene();
	root.addChild(background);
	root.mouseHandler.addHandler(background);

	background.addChild(new Sprite(new Size(1024, 768), bgImg));
	
	var foreground = new Scene();
	root.addChild(foreground);
	root.mouseHandler.addHandler(foreground);
	
	var sprite = new Sprite(new Size(150, 300), image, new Rect(30, 30, 100, 200));
	sprite.pos = new Pos(350, 670);
	sprite.anchor = new Point(0, 1.0);
	var animation = new FrameAnimation(0.4, function() {return sprite.sourceRect;} );
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	sprite.action = animation;
	foreground.addChild(sprite);
	
	var buttonEffects = [new JumpingLabel(2, 2), new ChangingColor('#382A1D', '#810C05', '#38503A')];
	var button = new Button(context, new Size(215, 72), buttonImg, buttonEffects);
	button.pos = new Pos(590, 100);
	var label = button.label;
	label.text = 'Rausgehen';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);
	
	return root;
};