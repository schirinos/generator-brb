/*global define*/

define([
    'underscore',
    'models/base'
], function (_, Backbone) {
    'use strict';

    var <%= _.classify(name) %>Model = BaseModel.extend({
        url: '',

        initialize: function() {
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