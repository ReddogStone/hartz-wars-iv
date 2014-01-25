'use strict';

function TemplateNode(engine, template, depth) {
	this._template = template;
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
		var depth = this._depth;
		if (this._template.children) {
			this._template.children.forEach(function(child) {
				var childNode = new TemplateNode(engine, child, depth + 1);
				result.push(childNode);
			});
			var expDepth = Math.pow(2, this._depth);
		}
		return result;
	}
});

var TYPE_ICONS = {
	'string': 12,
	'number': 9,
	'array': 0,
	'object': 10,
	'function': 5,
	'null': 13,
	'undefined': 13,
	'boolean': 1
};

function ReflectionNode(subject, name, depth) {
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
	
	this._final = false;
	switch (subjectType) {
		case 'array':
			this._type = 'sequential';
			break;

		case 'object':
			this._type = 'parallel';
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

	this._subjectType = subjectType;
	this._text = name;
	this._color = BLUE;
}
ReflectionNode.extends(Object, {
	get type() {
		return this._type;
	},
	get depth() {
		return this._depth;
	},
	createWidget: function(engine, scene, subtree) {
		var icon = TYPE_ICONS[this._subjectType];
		var iconSize = 64;
		var color = this._color;
		var text = this._text;
		var font = new Font('Helvetica', 9);
		var textOffset = new Vecmath.Vector2(0.0, 10.0);
		this.widget = new IconTextWidget(engine, scene, subtree, icon, iconSize, color, text, font, textOffset);
	},
	createChildren: function() {
		if (this._final) {
			return [];
		}
	
		var result = [];
		var depth = this._depth;
		for (var key in this._subject) {
			var value = this._subject[key];
			
			var childNode = new ReflectionNode(value, key, depth + 1);
			result.push(childNode);
		}
		return result;
	}	
});

function FileSystemNode(path, depth) {
	this._path = path;
	this._depth = depth || 0;
	
	var fs = require('fs');
	var stats = fs.lstatSync(path);

	this._final = true;
	if (stats.isDirectory()) {
		this._final = false;
	}
}
FileSystemNode.extends(Object, {
	get type() {
		return this._type;
	},
	get depth() {
		return this._depth;
	},
	createWidget: function(engine, scene, subtree) {
		var path = this._path;
		var fs = require('fs');
		var stats = fs.lstatSync(path);

		var pathModule = require('path');
		
		var icon = 0;
		var name = path;
		
		var parts = path.split(pathModule.sep);
		if (parts[parts.length - 1]) {
			name = parts[parts.length - 1];
		}
		
		if (stats.isDirectory()) {
			icon = 1;
		}

		var font = new Font('Helvetica', 12);
		var textOffset = new Vecmath.Vector2(0.0, -50.0);
		this.widget = new IconTextWidget(engine, scene, subtree, icon, 64, BLUE, name, font, textOffset);
	},
	createChildren: function() {
		if (this._final) {
			return [];
		}
	
		var fs = require('fs');
		var pathModule = require('path');

		var result = [];
		var depth = this._depth;
		var path = this._path;
		var files = fs.readdirSync(path);
		files.forEach(function(fileName) {
			try {
				var childNode = new FileSystemNode(pathModule.join(path, fileName), depth + 1);
				result.push(childNode);
			} catch (e) {
			}
		});
		return result;
	}	
});

function ContainerNode(engine, containedNodes, name, depth) {
	this._containedNodes = containedNodes;
	this._depth = depth || 0;
	
	if (containedNodes.length > 1) {
		var font = new Font('Helvetica', 12);
		var textOffset = new Vecmath.Vector2(0.0, -50.0);
		this._widget = new IconTextWidget(engine, 'data/textures/container_icon', 64, name, font, textOffset);
	} else if (containedNodes.length == 1) {
		var node = containedNodes[0];
		this._widget = node.widget;
	} else {
		throw new Error('ContainerNode can not be constructed from 0 nodes!');
	}
}
ContainerNode.extends(Object, {
	_packContainer: function(children, index) {
		var result = [];
		for (var i = index; (i < index + ContainerNode.MAX_CONTAINED_NODES) && (i < children.length); ++i) {
			result.push(children[i]);
		}
		return result;
	},
	get widget() {
		return this._widget;
	},
	get depth() {
		return this._depth;
	},
	createChildren: function(engine) {
		var nodes = this._containedNodes;
		var children;
		if (nodes.length > 1) {
			children = nodes;
		} else {
			children = nodes[0].createChildren(engine);
		}
		
		var result = [];
		var depth = this._depth;
		var childCount = children.length;
		if (childCount <= ContainerNode.MAX_CONTAINED_NODES) {
			children.forEach(function(child) {
				result.push(new ContainerNode(engine, [child], '', depth + 1));
			});
		} else if (childCount <= ContainerNode.MAX_CONTAINED_NODES * ContainerNode.MAX_CONTAINED_NODES) {
			var i = 0;
			var containerCount = 0;
			while (i < childCount) {
				var containedChildren = this._packContainer(children, i);
				result.push(new ContainerNode(engine, containedChildren, 'Container ' + containerCount, depth + 1));
				i += containedChildren.length;
				++containerCount;
			}
		} else {
			
		}
		return result;
	}
});
ContainerNode.MAX_CONTAINED_NODES = 12;

function DialogNode(template, depth) {
	this._template = template;
	this._depth = depth || 0;
	
	this._final = true;
	var data = {};
	data.color = BLUE;
	data.iconSize = 64;
	data.type = '';
	data.textOffset = new Vecmath.Vector2(0.0, 0.0);

	if (Array.isArray(template)) {
		this._templateType = 'list';
		this._final = false;
	} else if (template.right || template.left) {
		this._templateType = 'statement';
	} else if (template.options) {
		this._templateType = 'options';
		this._type = 'parallel';
		this._final = false;
	} else if (template.text) {
		this._templateType = 'option';
		this._final = !(template.consequence);
	} else {
		this._templateType = 'action';
	}
}

DialogNode.extends(Object, {
	get type() {
		return this._type;
	},
	get depth() {
		return this._depth;
	},
	createWidget: function(engine, scene, subtree) {
		var icon;
		var iconSize = 64;
		var color = BLUE;
		var text;
		var font = new Font('Helvetica', 9);		
		var textOffset = new Vecmath.Vector2(0.0, 0.0);

		switch (this._templateType) {
			case 'list':
				icon = 0;
				text = 'list';
				textOffset = new Vecmath.Vector2(50.0, 0.0);
				break;
			case 'statement':
				icon = 13;
				text = this._template.right || this._template.left;
				color = this._template.right ? BLUE : RED;
				iconSize = 32;
				break;
			case 'options':
				icon = 10;
				text = 'options';
				textOffset = new Vecmath.Vector2(50.0, 0.0);
				break;
			case 'option':
				icon = 13;
				text = this._template.text;
				iconSize = 32;
				break;
			case 'action':
				icon = 5;
				text = this._template.toString();
				textOffset = new Vecmath.Vector2(0.0, 10.0);
				break;
		}

		this.widget = new IconTextWidget(engine, scene, subtree, icon, iconSize, color, text, font, textOffset);
	},
	createChildren: function() {
		if (this._final) {
			return [];
		}
	
		var result = [];
		var depth = this._depth;
		
		switch (this._templateType) {
			case 'list':
				this._template.forEach(function(element) {
					result.push(new DialogNode(element, depth + 1));
				});
				break;
			case 'options':
				this._template.options.forEach(function(element) {
					result.push(new DialogNode(element, depth + 1));
				});
				break;
			case 'option':
				this._template.consequence.forEach(function(element) {
					result.push(new DialogNode(element, depth + 1));
				});
				break;
		}
		
		return result;
	}	
});
