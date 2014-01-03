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

var TYPE_ICONS = {
	'string': 'data/textures/string_icon',
	'number': 'data/textures/number_icon',
	'array': 'data/textures/array_icon',
	'object': 'data/textures/object_icon',
	'function': 'data/textures/function_icon',
	'null': 'data/textures/null_icon',
	'undefined': 'data/textures/null_icon',
	'boolean': 'data/textures/boolean_icon'
};

function ReflectionNode(engine, subject, name, depth) {
	this._subject = subject;
	this._depth = depth || 0;
	
	var subjectType;
	if (subject === undefined) {
		subjectType = 'undefined';
	} else if (subject === null) {
		subjectType = 'null';
	} else if (Array.isArray(subject)) {
		subjectType = 'array';
	} else {
		subjectType = typeof subject;
	}
	
	var icon = TYPE_ICONS[subjectType];
	if (!icon) {
		icon = 'data/textures/node'
	}
	
	this._final = false;
	switch (subjectType) {
		case 'array':
		case 'object':
			break;
			
		case 'string':
		case 'number':
		case 'boolean':
			name += ': "' + subject.toString() + '"';
			this._final = true;
			break;
			
		case 'null':
		case 'undefined':
			this._final = true;
			break;
			
		case 'function':
			name += ': "' + subject.toString().split('\n')[0] + '"';
			this._final = true;
			break;
			
		default:
			name = '[' + subjectType + ']' + name;
			break;
	}

	var font = new Font('Helvetica', 12);
	var textOffset = new Vecmath.Vector2(0.0, -50.0);
	this._widget = new IconTextWidget(engine, icon, 64, name, font, textOffset);
}
ReflectionNode.extends(Object, {
	get widget() {
		return this._widget;
	},
	get depth() {
		return this._depth;
	},
	createChildren: function(engine) {
		if (this._final) {
			return [];
		}
	
		var result = [];
		var depth = this._depth;
		var childTransforms = [];
		for (var key in this._subject) {
			var value = this._subject[key];
			
			if (typeof value == 'function') {
				continue;
			}
			
			var childNode = new ReflectionNode(engine, value, key, depth + 1);
			childTransforms.push(childNode._widget.transformable);
			result.push(childNode);
		}
		return result;
	}	
});
