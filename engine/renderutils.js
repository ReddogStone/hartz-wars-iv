'use strict';

var RenderUtils = (function() {
	function transform(context, pos) {
		context.translate(pos.x, pos.y);
		context.rotate(pos.rot);
	}
	
	function renderNode(node, context) {
		if (node.renderable) {
			var pos = node.pos;
			context.save();
			context.translate(pos.x, pos.y);
			context.rotate(pos.rot);
			
			node.renderable.render(node, context);
			
			context.restore();
		}
	}

	return {
		transform: transform,
		renderNode: renderNode
	};
})();