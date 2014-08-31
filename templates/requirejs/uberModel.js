define([
    'underscore',
    'backbonePkg'
],
function (_, Backbone) {
    'use strict';

    var <%= _.classify(name) %>Model = Backbone.UberModel.extend({
        url: '',

        initialize: function() {
            Backbone.UberModel.prototype.initialize.apply(this, arguments);
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
                return response;
        }
    });

    return <%= _.classify(name) %>Model;
});
