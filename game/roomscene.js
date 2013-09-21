function createRoomScene() {
	'use strict';

	var image = new Image();
	image.src = 'data/walk_anim.png';
	
	var buttonImg = new Image();
	buttonImg.src = 'data/cartoon_button.png';
	
	var bgImg = new Image();
	bgImg.src = 'data/room_bg.jpg';
	
	var root = createSceneNode();
	
	var background = createSceneNode();
	root.renderable.addChild(background);
	root.mouseHandler.addHandler(background);

	background.renderable.addChild(createSpriteNode(new Size(1024, 768), bgImg));
	
	var foreground = createSceneNode();
	root.renderable.addChild(foreground);
	root.mouseHandler.addHandler(foreground);
	
	var sprite = createSpriteNode(new Size(150, 300), image, new Rect(30, 30, 100, 200));
	sprite.pos = new Pos(350, 300);
	var animation = new FrameAnimation(0.4);
	animation.addFrame(new Rect(30, 30, 100, 200));
	animation.addFrame(new Rect(155, 30, 100, 200));
	animation.addFrame(new Rect(292, 30, 100, 200));
	animation.addFrame(new Rect(442, 30, 100, 200));
	foreground.renderable.addChild(sprite);
	
	var button = createButtonNode(new Size(215, 72), buttonImg);
	button.pos = new Pos(590, 100);
	button.mouseHandler.setLabelColor(ButtonState.ACTIVE, '#382A1D');
	button.mouseHandler.setLabelColor(ButtonState.PRESSED, '#810C05');
	button.mouseHandler.setLabelColor(ButtonState.HOVERED, '#38503A');
	
	var label = button.label;
	label.text = 'Rausgehen';
	label.font = new Font('Comic Sans MS', '24pt', '900', 'italic');
//	label.color = '#382A1D';
	
	foreground.renderable.addChild(button);
	foreground.mouseHandler.addHandler(button);
	
/*	var label = createLabelNode('Rausgehen', new Font('Comic Sans MS', '24pt', '900', 'italic'), '#382A1D', 'center');
	label.pos = new Pos(695, 150);
	foreground.addChild(label); */

	return [root, sprite, animation];
};