define([
    'underscore',
    'backbonePkg'
],
function (_, Backbone) {
    'use strict';

    var <%= _.classify(name) %>Coll = Backbone.UberCollection.extend({
        url: '',

        model: Backbone.UberModel,

        parse: function(response, options)  {
                return response;
        }
    });

    return <%= _.classify(name) %>Coll;
});
