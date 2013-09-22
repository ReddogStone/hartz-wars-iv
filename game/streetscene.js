'use strict';

function StreetScene() {
	Scene.apply(this);

	var bgImg = new Image();
	bgImg.src = 'data/street_bg.png';
	
	var homeDoorHighlightImg = new Image();
	homeDoorHighlightImg.src = 'data/street_home_door_highlight.png';	

	var root = new Scene();
	
	var background = new Scene();
	background.addChild(new Sprite(new Size(1024, 768), bgImg));
	root.addChild(background);
	root.mouseHandler.addHandler(background);
	
	var foreground = new Scene();
	root.addChild(foreground);
	root.mouseHandler.addHandler(foreground);
	
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
	var scale = 2.1;
	var button = new Button(new Size(74 * scale, 153 * scale), homeDoorHighlightImg, buttonEffects);
	button.pos = new Pos(730, 0);
	button.onClicked = function() { if (root.onEnterHome) root.onEnterHome(); };
	button.setLabelOffset(-150, -100);
	var label = button.label;
	label.text = 'Reingehen';
	label.font = new Font('Comic Sans MS', 24, '900', 'italic');
	foreground.addChild(button);
	foreground.mouseHandler.addHandler(button);

	return root;
};
StreetScene.extends(Scene);