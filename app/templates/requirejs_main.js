/*global require*/
'use strict';

require.config({
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }<% if (templateFramework === 'handlebars') { %>,
        handlebars: {
            exports: 'Handlebars'
        }<% } %>
    },
    paths: {
        jquery: '../vendor/jquery/dist/jquery',
        backbone: '../vendor/backbone/backbone',
        backbonePkg: 'helpers/backbonePkg',
        'backbone.stickit': '../vendor/backbone.stickit/backbone.stickit',
        tpl: '../vendor/requirejs-tpl/tpl',
        underscore: '../vendor/underscore/underscore',<% if (compassBootstrap) { %>,
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap'<% } else {%>
       	bootstrap: '../vendor/bootstrap/dist/js/bootstrap'<% }%><% if (templateFramework === 'handlebars') { %>,
        handlebars: '../vendor/handlebars/handlebars'<% } %>
    }
});

require([
    'backbone'
    'app'
], function (Backbone, AppView) {
    var appView = new AppView({el: $('#app'), model: new Backbone.UberModel()});
    appView.render();
});
