'use strict';

var RenderUtils = (function() {
	function transform(context, pos, scale, size, anchor) {
		context.translate(pos.x, pos.y);
		context.rotate(pos.rot);
		context.scale(scale.x, scale.y);
		if (size && anchor) {
			context.translate(-size.x * anchor.x, -size.y * anchor.y);
		}
	}
	return {
		transform: transform
	};
})();