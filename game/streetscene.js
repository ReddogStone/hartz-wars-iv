'use strict';

function StreetScene() {
	Scene.apply(this);

	var bgImg = new Image();
	bgImg.src = 'http://www.toonpool.com/user/3135/files/a_busy_street_in_india_586455.jpg';
	
	var buttonImg = new Image();
	buttonImg.src = 'data/cartoon_button.png';

	var root = new Scene();
	
	var background = new Scene();
	background.addChild(new Sprite(new Size(1024, 768), bgImg));
	root.addChild(background);
	root.mouseHandler.addHandler(background);
	
	var foreground = new Scene();
	root.addChild(foreground);
	root.mouseHandler.addHandler(foreground);
	
	var buttonEffects = [new JumpingLabel(2, 2), new ChangingColor('#382A1D', '#810C05', '#38503A')];
	var button = new Button(new Size(215, 72), buttonImg, buttonEffects);
	button.pos = new Pos(590, 100);
	button.onClicked = function() { if (root.onEnterHome) root.onEnterHome(); };
	var label = button.label;
	label.text = 'Reingehen';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);

	return root;
};
StreetScene.extends(Scene);