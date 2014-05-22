/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        backboneNestedModel: {
            deps: ['backbone']
        }<% if (templateFramework === 'handlebars') { %>,
        handlebars: {
            exports: 'Handlebars'
        }<% } %>
    },
    paths: {
        jquery: '../vendor/jquery/dist/jquery',
        backboneLib: '../vendor/backbone/backbone',
        backbone: 'helpers/backbonePkg',
        backboneStickit: '../vendor/backbone.stickit/backbone.stickit',
        backboneNestedModel: '../vendor/backbone-nested-model/backbone-nested',
        tpl: '../vendor/requirejs-tpl/tpl',
        underscore: '../vendor/underscore/underscore',<% if (compassBootstrap) { %>,
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap'<% } else {%>
       	bootstrap: '../vendor/bootstrap/dist/js/bootstrap'<% }%><% if (templateFramework === 'handlebars') { %>,
        handlebars: '../vendor/handlebars/handlebars'<% } %>
    }
});

require([
    'backbone',
    'app'
], function (Backbone, App) {
    App.init('#app');
});