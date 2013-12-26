'use strict';

var FileUtils = (function() {
	/**
	 * Loads a shader from a file.
	 */
	function loadFile(path) {
		var request = new XMLHttpRequest();
		request.open('GET', path, false);
		request.send();
		return request.responseText;
	};
	return {
		loadFile: loadFile
	}
}());
