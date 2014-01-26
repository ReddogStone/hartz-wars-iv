var Layout = (function(module) {
	'use strict';

	module.calculateRect = function(list) {
		if (list.length == 0) {
			return {
				min: new Vecmath.Vector2(0, 0),
				max: new Vecmath.Vector2(0, 0)
			};
		}

		var minZ = 10000;
		var maxZ = -10000;
		var minX = 10000;
		var maxX = -10000;
		for (var i = 0; i < list.length; ++i) {
			var entity = list[i];
			var childLayout = entity.layout;
			var center = entity.offset.clone().add(childLayout.center);
			var childMinX = center.x - 0.5 * childLayout.width;
			var childMaxX = center.x + 0.5 * childLayout.width;
			var childMinZ = center.z - 0.5 * childLayout.height;
			var childMaxZ = center.z + 0.5 * childLayout.height;
			
			minX = Math.min(minX, childMinX);
			maxX = Math.max(maxX, childMaxX);
			minZ = Math.min(minZ, childMinZ);
			maxZ = Math.max(maxZ, childMaxZ);
		}

		return {
			min: new Vecmath.Vector2(minX, minZ),
			max: new Vecmath.Vector2(maxX, maxZ)
		};
	};

	return module;
})(Layout || {});