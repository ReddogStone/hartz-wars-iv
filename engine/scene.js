'use strict';

function Scene() {
	Node.apply(this);
	
	this.mouseHandler = new MouseDispatcher();
	
	var canvas = document.getElementById("myCanvas");
	var w = canvas.width;
	var h = canvas.height;
	this.size = new Size(w, h);
	this.anchor = new Point(0.5, 0.5);
	this.pos = new Pos(0.5 * w, 0.5 * h);
}
Scene.extends(Node);
