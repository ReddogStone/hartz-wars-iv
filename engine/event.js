'use strict';

function Event() {
	this._observers = {};
}
Event.extends(Object, {
	raise: function(value) {
		var observers = this._observers;
		for (var id in observers) {
			observers[id]();
		}
	},
	addObserver: function(observer) {
		var id = Event.nextObserverId();
		this._observers[id] = observer;
	},
	removeObserver: function(observer) {
		var observers = this._observers;
		for (var id in observers) {
			var storedObserver = observers[id];
			if (storedObserver == observer) {
				delete observers[id];
				break;
			}
		}
	},
	removeObserverById: function(id) {
		delete this._observers[id];
	}
});

Object.addProperties(Event, {
	_observerId: 0,
	nextObserverId: function() {
		return this._observerId++;
	},
	observe: function(event, observer) {
		event.addObserver(observer);
	}
});
