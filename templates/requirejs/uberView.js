define([
    'jquery',
    'underscore',
    'backbone',
    'tpl!<%= templatePath %>'
], function ($, _, Backbone, Tpl) {
    'use strict';

    var <%= _.classify(name) %>View = Backbone.UberView.extend({
        template: Tpl,
        bindings: {},
        events: {},
        initialize: function () {
            Backbone.UberView.prototype.initialize.apply(this, arguments);
        }
    });

    return <%= _.classify(name) %>View;
});
