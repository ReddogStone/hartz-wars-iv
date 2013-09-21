'use strict';

var RenderUtils = (function() {
	function transform(context, pos) {
		context.translate(pos.x, pos.y);
		context.rotate(pos.rot);
	}
	return {
		transform: transform
	};
})();