'use strict';

function TemplateNode(engine, template, layout) {
	this._template = template;
	this._layout = layout;
	
	var font = new Font('Helvetica', 12);
	var textOffset = new Vecmath.Vector2(0.0, -50.0);
	this._widget = new IconTextWidget(engine, template.icon, 64, BLUE, template.text, font, textOffset);
}
TemplateNode.extends(Object, {
	get widget() {
		return this._widget;
	},
	createChildren: function(engine) {
		var result = [];
		var layout = this._layout;
		var childTransforms = [];
		if (this._template.children) {
			this._template.children.forEach(function(child) {
				var childNode = new TemplateNode(engine, child, layout);
				childTransforms.push(childNode._widget.transformable);
				result.push(childNode);
			});
			layout.apply(this._widget.transformable, childTransforms);
		}
		return result;
	}
});

function ReflectionNode(engine, subject) {
	this._subject = subject;
	
}
ReflectionNode.extends(Object, {
	
});
