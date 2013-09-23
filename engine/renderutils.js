'use strict';

var RenderUtils = (function() {
	function transform(context, pos, scale, size, anchor) {
		context.translate(pos.x, pos.y);
		context.scale(scale.x, scale.y);
		context.rotate(pos.rot);
		if (size && anchor) {
			context.translate(-size.x * anchor.x, -size.y * anchor.y);
		}
	}
	return {
		transform: transform
	};
})();