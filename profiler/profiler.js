var FrameProfiler = (function() {
	var ENABLED = true;
	
	var module = {};
	
	var g_averages = {};
	var g_frameTimes = {};
	var g_times = [];
	var g_timeStack = [];
	var g_level = 0;
	
	module.startFrame = function() {
		g_frameTimes = {};
		g_times.length = 0;
	};
	module.stopFrame = function() {
		var nameStack = [];
		var level = -1;
		for (var i = 0; i < g_times.length; ++i) {
			var current = g_times[i];
			nameStack.splice(nameStack.length - level + current.level - 1, level - current.level + 1);
			level = current.level;
			nameStack.push(current.name);
			
			var name = nameStack.join('.');
			var duration = current.stop - current.start;
			if (g_frameTimes[name]) {
				g_frameTimes[name] += duration;
			} else {
				g_frameTimes[name] = duration;
			}
		}
		
		for (var name in g_frameTimes) {
			if (name in g_averages) {
				g_averages[name] = 0.95 * g_averages[name] + 0.05 * g_frameTimes[name];
			} else {
				g_averages[name] = g_frameTimes[name];
			}
		}
	};
	module.start = function(name) {
		var newTime = {name: name, level: g_level, start: window.performance.now()};
		g_times.push(newTime);
		g_timeStack.push(newTime);
		++g_level;
	};
	module.stop = function() {
		--g_level;
		var time = g_timeStack.pop();
		time.stop = window.performance.now();
	};
	
	function fixedLength(string, number) {
		return '            '.substr(string.length - number) + string;
	}
	
	module.getReportStrings = function() {
		var maxLength = 0;
		for (var name in g_frameTimes) {
			if (name.length > maxLength) {
				maxLength = name.length;
			}
		}
		
		var lines = [];
		for (var name in g_frameTimes) {
			var value = g_frameTimes[name];
			var average = g_averages[name];
			lines.push(name + Array(maxLength - name.length + 4).join(' ') + '===' + 
				fixedLength(value.toFixed(2), 8) + ' ms' +
				fixedLength(average.toFixed(2), 8) + ' ms');
		}
		
		return lines;
	};
	
	function empty() {}
	return ENABLED ? 
		module : 
		{startFrame: empty, stopFrame: empty, start: empty, stop: empty, getReportStrings: function() { return []; }};
})();