'use strict';

function TemplateNode(engine, template, layout, depth) {
	this._template = template;
	this._layout = layout;
	this._depth = depth || 0;
	
	var font = new Font('Helvetica', 12);
	var textOffset = new Vecmath.Vector2(0.0, -50.0);
	this._widget = new IconTextWidget(engine, template.icon, 64, template.text, font, textOffset);
}
TemplateNode.extends(Object, {
	get widget() {
		return this._widget;
	},
	createChildren: function(engine) {
		var result = [];
		var layout = this._layout;
		var depth = this._depth;
		var childTransforms = [];
		if (this._template.children) {
			this._template.children.forEach(function(child) {
				var childNode = new TemplateNode(engine, child, layout, depth + 1);
				childTransforms.push(childNode._widget.transformable);
				result.push(childNode);
			});
			var expDepth = Math.pow(2, this._depth);
			layout.apply(this._widget.transformable, childTransforms, 5 / expDepth, 0.5 / expDepth);
		}
		return result;
	}
});

function ReflectionNode(engine, subject) {
	this._subject = subject;
	
}
ReflectionNode.extends(Object, {
	
});
