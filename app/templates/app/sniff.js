/** 
    Sniff - used to detect various aspects of the environment, such as browser type and certain features.
    @module app/helpers/sniff
 */
define(function(){

	// Init namspace to export
	var exports = {};

	// Mobile browser detection
	exports.isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return navigator.userAgent.match(/Mobi/i);
	    }
	};

	// Touch enabled devices
	exports.hasTouch = 'ontouchstart' in document.documentElement;

	// Export module
	return exports;

});