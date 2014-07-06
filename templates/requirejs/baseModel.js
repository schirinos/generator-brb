define([
        'underscore',
        'models/base'
],
function (_, BaseModel) {
    'use strict';

    var <%= _.classify(name) %>Model = BaseModel.extend({
        url: '',

        initialize: function() {
            BaseModel.prototype.initialize.apply(this, arguments);
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
