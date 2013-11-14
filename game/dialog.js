'use strict';

var Dialog = {
	loadElement: function(element, actions, scene, world) {
		if (element.left || element.right) {
			if (element.left) {
				actions.push(new InstantAction(function() { 
					scene.addMyLine(element.left);
				}));
			} else if (element.right) {
				actions.push(new InstantAction(function() { 
					scene.addTheirLine(element.right);
				}));
			}
			if (element.wait) {
				actions.push(new WaitAction(element.wait));
			}
		} else if (element.options) {
			actions.push(new InstantAction(function() {
				element.options.forEach(function(option) {
					scene.addOption(option.text, function() {
						scene.clearOptions();
						Dialog.load(option.consequence, scene, world);
					});
				});
			}));		
		} else if (Array.isArray(element)) {
			Dialog.loadTemplate(element, actions, scene, world);
		} else if ((typeof element) == 'function') {
			actions.push(new InstantAction(function() {
				element(scene, world);
			}));
		}
	},
	loadTemplate: function(template, actions, scene, world) {
		template.forEach(function(element) {
			Dialog.loadElement(element, actions, scene, world);
		});
	},
	load: function(template, scene, world) {
		var actions = [];
		Dialog.loadTemplate(template, actions, scene, world);
		if (actions.length > 0) {
			scene.addAction(new SequenceAction(actions));
		}
	}
};