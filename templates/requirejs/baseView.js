define([
    'jquery',
    'underscore',
    'views/base',
    'tpl!<%= templatePath %>'
], function ($, _, BaseView, Tpl) {
    'use strict';

    var <%= _.classify(name) %>View = BaseView.extend({
        template: Tpl,
        bindings: {},
        events: {},
        initialize: function () {
            BaseView.prototype.initialize.apply(this, arguments);
        }
    });

    return <%= _.classify(name) %>View;
});
