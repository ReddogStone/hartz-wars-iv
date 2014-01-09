'use strict';

function Subtree(node, parent) {
	this._node = node;
	this._parent = parent;
	this._children = [];
}
Subtree.extends(Object, {
	get parent() {
		return this._parent;
	},
	get node() {
		return this._node;
	},
	get children() {
		return this._children;
	},
	get expanded() {
		return (this._children.length > 0);
	},
	getSiblings: function() {
		var result = [];
		var parent = this._parent;
		if (parent) {
			parent.children.forEach(function(sibling) {
				if (sibling !== this) {
					result.push(sibling);
				}
			}, this);
		}
		return result;
	},
	// flat list of all nodes from this subtree
	getNodeList: function() {
		var result = [];
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			current._children.forEach(function(child) {
				stack.push(child);
			});
			result.push(current._node);
		}
		return result;
	},
	forEachChildNode: function(callback, thisArg) {
		var stack = [];
		this._children.forEach(function(child) {
			stack.push(child);
		});
		while (stack.length > 0) {
			var current = stack.shift();
			current._children.forEach(function(child) {
				stack.push(child);
			});
			callback.call(thisArg, current._node, current);
		}
	},
	forEachNode: function(callback, thisArg) {
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			current._children.forEach(function(child) {
				stack.push(child);
			});
			callback.call(thisArg, current._node, current);
		}
	},
	forEachSubtree: function(callback, thisArg) {
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			stack = stack.concat(current._children);
			callback.call(thisArg, current);
		}		
	},
	expand: function() {
		var childNodes = this._node.createChildren();
		
		childNodes.forEach(function(childNode) {
			this._children.push(new Subtree(childNode, this));
		}, this);
	},
	collapse: function() {
		this._children.clear();
	}
});
Subtree.clone = function(value) {
	if (!value) {
		return value;
	}
	
	var result = new Subtree(value._node, value._parent);
	result._children = value._children.slice(0);
	return result;
}

function NavigationResult(expanded, removed, activated) {
	this.expanded = expanded;
	this.removed = removed;
	this.activated = activated;
}

function NodeTree(rootNode) {
	this._root = new Subtree(rootNode);
	this._activeSubtree = this._root;
}
NodeTree.extends(Object, {
	get root() {
		return this._root;
	},
	get activeSubtree() {
		return this._activeSubtree;
	},
	getActiveSubtrees: function() {
		var activeSubtree = this._activeSubtree;
		var result = activeSubtree.children.slice(0);
		result.push(activeSubtree);
		var parent = activeSubtree.parent;
		while (parent) {
			result.push(parent);
			parent = parent.parent;
		}
		return result;
	},
	navigateTo: function(subtree) {
		var expanded = null;
		var activated = [];
		var removed = [];
		
		if (subtree.expanded) {
			// find active child
			var activeChild = this._activeSubtree;
			while (activeChild && (activeChild.parent !== subtree)) {
				activeChild = activeChild.parent;
			}
			
/*			if (activeChild) {
				var current = this._activeSubtree;
				while (current != subtree) {
					activated = activated.concat(current.getSiblings());
					current = current.parent;
				}
			} else {
				subtree.getSiblings().forEach(function(sibling) {
					removed.push(Subtree.clone(sibling));
					sibling.collapse();
				}); 
			}*/
		} else {
			// expand leaf
			subtree.expand();
			expanded = subtree;
			
			// collapse siblings
/*			subtree.getSiblings().forEach(function(sibling) {
				removed.push(Subtree.clone(sibling));
				sibling.collapse();
			}); */
		}
		this._activeSubtree = subtree;
		
		return new NavigationResult(expanded, removed, activated);
	},
	expandAll: function() {
		var stack = [this._root];
		while (stack.length > 0) {
			var current = stack.shift();
			current.expand();
			stack = stack.concat(current.children);
		}
	},
	forEachNode: function(callback, thisArg) {
		this._root.forEachNode(callback, thisArg);
	},
	forEachSubtree: function(callback, thisArg) {
		this._root.forEachSubtree(callback, thisArg);
	}
});
