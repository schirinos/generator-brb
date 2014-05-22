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
        backbone: '../vendor/backbone/backbone',
        backbonePkg: 'helpers/backbonePkg',
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
    'app'
], function (App) {
    App.init('#app');
});