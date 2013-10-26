'use strict';

function MotherDialogController(world) {
	this._world = world;
	this.scene = new DialogScene();
}
MotherDialogController.extends(Object, {
	init: function() {
		var scene = this.scene;
		scene.onExit = this.onExit;
		
		scene.addAction(new SequenceAction(
			new InstantAction(function() {scene.addMyLine('*klingel*');}), new WaitAction(1),
			new InstantAction(function() {scene.addMyLine('*klingel*');}), new WaitAction(1),
			new InstantAction(function() {scene.addMyLine('*klingel*');}), new WaitAction(1),
			new InstantAction(function() {scene.addTheirLine('Hallo.');}), new WaitAction(1),
			new InstantAction(function() {scene.addMyLine('Hallo, Mama.');}), new WaitAction(1),
			new InstantAction(function() {scene.addTheirLine('Ah, wie geht\'s dir mein Junge?');}), new WaitAction(2),
			new InstantAction(function() {scene.addMyLine('Danke, alles prima.');}), new WaitAction(2),
			new InstantAction(function() {scene.addMyLine('Und wie geht\'s dir?');}), new WaitAction(2),
			new InstantAction(function() {scene.addTheirLine('Bei uns ist alles ganz gut.');}), new WaitAction(2),
			new InstantAction(function() {scene.addTheirLine('Wie läuft\'s denn bei deiner neuen Arbeit?');}), new WaitAction(2),
			new InstantAction(function() {scene.addMyLine('Es ist auch sehr schön. Ich hab nette Kollegen.');}), new WaitAction(2),
			new InstantAction(function() {scene.addMyLine('Und mein Chef ist sehr gewissenhaft und offenbar ein guter Mensch.');})
		));
	}
});
