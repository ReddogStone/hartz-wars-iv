'use strict';

var RenderUtils = (function() {
	function transform(context, pos) {
		context.translate(pos.x, pos.y);
		context.rotate(pos.rot);
	}
	
	function renderNode(node, context) {
		var renderable = node.renderable;
		if (renderable) {
			var pos = node.pos;
			var anchor = node.anchor;
			var size = renderable.size;
			if (size) {
				pos = new Pos(pos.x - anchor.x * size.x, pos.y - anchor.y * size.y);
			}
			
			context.save();
			context.translate(pos.x, pos.y);
			context.rotate(pos.rot);
			
			renderable.render(node, context);
			
			context.restore();
		}
	}

	return {
		transform: transform,
		renderNode: renderNode
	};
})();