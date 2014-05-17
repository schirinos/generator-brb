/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'tpl!templates/<%= name %>.html'
], function ($, _, Backbone, Tpl) {
    'use strict';

    var <%= _.classify(name) %>View = Backbone.View.extend({
        template: Tpl,
        bindings: {},
        events: {},
        initialize: function () {
            
        }
    });

    return <%= _.classify(name) %>View;
});
