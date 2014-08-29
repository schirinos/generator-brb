define([
    'underscore',
    'helpers/vent'
],
function(_, Vent){
    'use strict';

    function <%= _.classify(name) %>Controller() {
        if (!(this instanceof <%= _.classify(name) %>Controller)) {
            return new <%= _.classify(name) %>Controller();
        }
    }

    <%= _.classify(name) %>Controller.prototype.index = function() {

    }

    // Export module
    return <%= _.classify(name) %>Controller;
});
