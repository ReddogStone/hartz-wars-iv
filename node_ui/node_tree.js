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
			for (var i = 0; i < parent._children.length; ++i) {
				var sibling = parent._children[i];
				if (sibling !== this) {
					result.push(sibling);
				}
			}
		}
		return result;
	},
	// flat list of all nodes from this subtree
	getNodeList: function() {
		var result = [];
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			for (var i = 0; i < current._children.length; ++i) {
				stack.push(current._children[i]);
			}
			result.push(current._node);
		}
		return result;
	},
	forEachChildNode: function(callback, thisArg) {
		var stack = this._children.slice(0);
		while (stack.length > 0) {
			var current = stack.shift();
			for (var i = 0; i < current._children.length; ++i) {
				stack.push(current._children[i]);
			}
			callback.call(thisArg, current._node, current);
		}
	},
	forEachNode: function(callback, thisArg) {
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			for (var i = 0; i < current._children.length; ++i) {
				stack.push(current._children[i]);
			}
			callback.call(thisArg, current._node, current);
		}
	},
	forEachChildSubtree: function(callback, thisArg) {
		var stack = this._children.slice(0);
		while (stack.length > 0) {
			var current = stack.shift();
			for (var i = 0; i < current._children.length; ++i) {
				stack.push(current._children[i]);
			}
			callback.call(thisArg, current);
		}		
	},
	forEachSubtree: function(callback, thisArg) {
		var stack = [this];
		while (stack.length > 0) {
			var current = stack.shift();
			for (var i = 0; i < current._children.length; ++i) {
				stack.push(current._children[i]);
			}
			callback.call(thisArg, current);
		}		
	},
	postOrderSubtrees: function(callback, thisArg) {
		var childIndexStack = [0];
		var current = this;
		while (childIndexStack.length > 0) {
			var currentChildIndex = childIndexStack[childIndexStack.length - 1];
			if (currentChildIndex < current._children.length) {
				// go down
				current = current._children[currentChildIndex];
				++childIndexStack[childIndexStack.length - 1];
				childIndexStack.push(0);
			} else {
				// finished subtree
				callback.call(thisArg, current);

				// go up
				current = current._parent;
				childIndexStack.pop();
			}
		}
	},
	expand: function() {
		var childNodes = this._node.createChildren();
		for (var i = 0; i < childNodes.length; ++i) {
			this._children.push(new Subtree(childNodes[i], this));
		}
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
