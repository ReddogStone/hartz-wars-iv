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
		for (var key in this._subject) {
			var value = this._subject[key];
			
			if (typeof value == 'function') {
				continue;
			}
			
			var childNode = new ReflectionNode(engine, value, key, depth + 1);
			result.push(childNode);
		}
		return result;
	}	
});

function FileSystemNode(engine, path, depth) {
	this._path = path;
	this._depth = depth || 0;
	
	var fs = require('fs');
	var stats = fs.lstatSync(path);

	var pathModule = require('path');
	
	var icon = 'data/textures/file_icon';
	this._final = true;
	var name = path;
	
	var parts = path.split(pathModule.sep);
	if (parts[parts.length - 1]) {
		name = parts[parts.length - 1];
	}
	
	if (stats.isDirectory()) {
		icon = 'data/textures/directory_icon';
		this._final = false;
	}

	var font = new Font('Helvetica', 12);
	var textOffset = new Vecmath.Vector2(0.0, -50.0);
	this._widget = new IconTextWidget(engine, icon, 64, name, font, textOffset);
}
FileSystemNode.extends(Object, {
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
	
		var fs = require('fs');
		var pathModule = require('path');

		var result = [];
		var depth = this._depth;
		var path = this._path;
		var files = fs.readdirSync(path);
		files.forEach(function(fileName) {
			try {
				var childNode = new FileSystemNode(engine, pathModule.join(path, fileName), depth + 1);
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
	if (Array.isArray(template)) {
		data.type = 'list';
		this._final = false;
	} else if (template.right || template.left) {
		data.type = 'statement';
		data.text = template.right || template.left;
		data.side = template.right ? 'right' : 'left';
	} else if (template.options) {
		data.type = 'options';
		this._final = false;
	} else if (template.text) {
		data.type = 'option';
		data.text = template.text;
		this._final = !(template.consequence);
	} else {
		data.type = 'action';
	}
	
	this._data = data;
}

DialogNode.extends(Object, {
	get data() {
		return this._data;
	},
	get depth() {
		return this._depth;
	},
	get type() {
		return this._type;
	},
	createChildren: function() {
		if (this._final) {
			return [];
		}
	
		var result = [];
		var depth = this._depth;
		
		switch (this._data.type) {
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