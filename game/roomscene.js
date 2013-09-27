'use strict';

function RoomScene() {
	Scene.apply(this);

	var playerImage = new Image();
	playerImage.src = 'data/walk_anim.png';
	
	var roomDoorHighlightImg = new Image();
	roomDoorHighlightImg.src = 'data/room_door_highlight.png';
	
	var bgImg = new Image();
	bgImg.src = 'data/room_bg.png';
	
	var progressImg = new Image();
	progressImg.src = 'data/progress.png';
	
	var background = new Scene();
	this.addChild(background);

	background.addChild(new Sprite(new Size(1024, 640), bgImg));
	
	var foreground = new Scene();
	this.addChild(foreground);
	
	var sprite = new Sprite(new Size(150, 300), playerImage, new Rect(30, 30, 100, 200));
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
	
	var hungerProgress = new Progress(new Size(100, 30), progressImg, new Rect(0, 72, 30, 72), new Rect(0, 0, 215, 72));
	hungerProgress.pos = new Pos(200, 650);
	hungerProgress.setFrameColor('#009000');
	hungerProgress.setFillColor('#7F0000');
	hungerProgress.setProgress(0.5);
	foreground.addChild(hungerProgress);
	this.hungerProgress = hungerProgress;
	
	label = new Label('Hunger', new Font('Comic Sans MS', 14, '900'), '#FFFFFF');
	label.pos = new Pos(-10, hungerProgress.size.y * 0.5);
	label.anchor = new Point(1, 0.5);
	hungerProgress.addChild(label);
	
	var energyProgress = new Progress(new Size(100, 30), progressImg, new Rect(0, 72, 30, 72), new Rect(0, 0, 215, 72));
	energyProgress.pos = new Pos(400, 650);
	energyProgress.setFrameColor('#009000');
	energyProgress.setFillColor('#FFFF00');
	energyProgress.setProgress(0.5);
	foreground.addChild(energyProgress);
	this.energyProgress = energyProgress;
	
	label = new Label('Energy', new Font('Comic Sans MS', 14, '900'), '#FFFFFF');
	label.pos = new Pos(-10, energyProgress.size.y * 0.5);
	label.anchor = new Point(1, 0.5);
	energyProgress.addChild(label);

	var funProgress = new Progress(new Size(100, 30), progressImg, new Rect(0, 72, 30, 72), new Rect(0, 0, 215, 72));
	funProgress.pos = new Pos(600, 650);
	funProgress.setFrameColor('#009000');
	funProgress.setFillColor('#70707F');
	funProgress.setProgress(0.5);
	foreground.addChild(funProgress);
	this.funProgress = funProgress;
	
	label = new Label('Fun', new Font('Comic Sans MS', 14, '900'), '#FFFFFF');
	label.pos = new Pos(-10, funProgress.size.y * 0.5);
	label.anchor = new Point(1, 0.5);
	funProgress.addChild(label);	
}
RoomScene.extends(Scene, {
	init: function() {
		var hunger = this.hungerProgress;
		hunger.addAction(new LinearAction(10.0, function(value) {
			hunger.setProgress(value);
		}));
		var energy = this.energyProgress;
		energy.addAction(new LinearAction(10.0, function(value) {
			energy.setProgress(1.0 - value);
		}));
		var fun = this.funProgress;
		fun.addAction(new LinearAction(10.0, function(value) {
			fun.setProgress(value);
		}));
	}
});
	