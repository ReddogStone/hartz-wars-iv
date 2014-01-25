var Layout = (function(module) {
	'use strict';

	function LineDesc() {
		this.from = null;
		this.to = null;
		this.color = null;
		this.width = null;
		this.patternIndex = null;
		this._id = null;
		this._active = false;
	}
	LineDesc.extends(Object, {
		get active() {
			return this._active;
		},
		set: function(from, to, type) {
			this._active = true;

			this.from = from;
			this.to = to;
			this.color = Color.clone(BLUE);

			if (type == 'horizontal') {
				this.patternIndex = 0;
				this.color.alpha = 0.8;
				this.width = 10;
			} else if (type == 'vertical') {
				this.patternIndex = 1;
				this.color.alpha = 0.3;
				this.width = 5;
			} else if (type == 'weak') {
				this.patternIndex = 0;
				this.color.alpha = 0.3;
				this.width = 10;
			}
		},
		highlight: function(batch, highlightValue) {
			if (!this._active) { return; }

			var color = Color.clone(this.color);
			if (highlightValue) {
				color.red += 0.8;
				color.green += 0.8;
				color.blue += 0.8;
			}
			color.alpha = this.color.alpha;
			batch.setColor(this._id, color);			
		},
		update: function(batch) {
			if (!this._active) { return; }

			batch.setEndPoints(this._id, this.from.pos, this.to.pos);			
		},
		add: function(batch) {
			if (!this._active) { return; }

			this._id = batch.add(this.from.pos, this.to.pos, this.color, this.width, this.patternIndex);
		},
		remove: function(batch) {
			if (!this._active) { return; }

			batch.remove(this._id);
			delete this._id;
		}
	});

	module.LineDesc = LineDesc;
	return module;
})(Layout || {});