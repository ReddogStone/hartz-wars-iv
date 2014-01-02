'use strict';

function FollowTargetBaseBehavior(halfTime, getValueAndTargetFunc) {
	this._halfTime = halfTime;
	this._get = getValueAndTargetFunc;
}
FollowTargetBaseBehavior.extends(Object, {
	update: function(entity, delta) {
		var valueAndTarget = this._get(entity);
		Vecmath.expAttVec(valueAndTarget.value, valueAndTarget.target, delta, this._halfTime);
	}
});

function FollowTargetBehavior(halfTime, target) {
	var self = this;
	this._target = target;
	FollowTargetBaseBehavior.call(this, halfTime, function(entity) {
		return { value: entity.transformable.pos, target: self._target};
	});
}
FollowTargetBehavior.extends(FollowTargetBaseBehavior);

function BehaviorsUpdateable() {
	this._behaviors = [];
}
BehaviorsUpdateable.extends(Object, {
	addBehavior: function(behavior) {
		this._behaviors.push(behavior);
		return behavior;
	},
	removeBehavior: function(behavior) {
		this._behaviors.remove(behavior);
		return behavior;
	},
	update: function(entity, delta) {
		this._behaviors.reverseForEach(function(behavior, index) {
			var finished = behavior.update(entity, delta);
			if (finished) {
				this._behaviors.splice(index, 1);
			}
		});
	}
});
