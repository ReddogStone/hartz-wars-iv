'use strict';

function Subtree(parent) {
	this._parent = parent;
	this._children = [];
	this._expanded = false;
}
Subtree.extends(Object, {
	get parent() {
		return this._parent;
	},
	get children() {
		if (this._expanded) {
			return this._children;
		}
		return [];
	},
	get expanded() {
		return this._expanded;
		return (this._children.length > 0);
	},
	getSiblings: function() {
		var result = [];
		var parent = this._parent;
		if (parent) {
			var siblings = parent.children;
			for (var i = 0; i < siblings.length; ++i) {
				var sibling = siblings[i];
				if (sibling.tree !== this) {
					result.push(sibling);
				}
			}
		}
		return result;
	},
	expand: function(entity) {
		if (this._children.length == 0) {
			var childNodes = entity.node.createChildren();
			for (var i = 0; i < childNodes.length; ++i) {
				this._children.push({
					node: childNodes[i],
					tree: new Subtree(entity)
				});
			}
		}
		this._expanded = true;
	},
	collapse: function() {
		this._expanded = false;
	},
	destroy: function() {
		this._children.clear();
	}
});
Object.mixin(Subtree, {
	clone: function(value) {
		if (!value) {
			return value;
		}
		
		var result = new Subtree(value._node, value._parent);
		result._children = value._children.slice(0);
		return result;
	},
	preOrderChildren: function(entity, callback, thisArg) {
		var stack = entity.tree.children.slice(0);
		while (stack.length > 0) {
			var current = stack.shift();
			var children = current.tree.children;
			for (var i = 0; i < children.length; ++i) {
				stack.push(children[i]);
			}
			callback.call(thisArg, current);
		}		
	},	
	preOrder: function(entity, callback, thisArg) {
		callback.call(thisArg, entity);
		Subtree.preOrderChildren(entity, callback, thisArg);
	},
	postOrder: function(entity, callback, thisArg) {
		var childIndexStack = [0];
		var current = entity;
		while (childIndexStack.length > 0) {
			var currentChildIndex = childIndexStack[childIndexStack.length - 1];
			var children = current.tree.children;
			if (currentChildIndex < children.length) {
				// go down
				current = children[currentChildIndex];
				++childIndexStack[childIndexStack.length - 1];
				childIndexStack.push(0);
			} else {
				// finished subtree
				callback.call(thisArg, current);

				// go up
				current = current.tree._parent;
				childIndexStack.pop();
			}
		}		
	},
	expandAll: function(entity) {
		var stack = [entity];
		while (stack.length > 0) {
			var current = stack.shift();
			current.tree.expand(current);
			var children = current.tree.children;
			for (var i = 0; i < children.length; ++i) {
				stack.push(children[i]);
			}
		}		
	}
});

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
//			subtree.expand();
//			expanded = subtree;
			
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
