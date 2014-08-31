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
        rivets: '../vendor/rivets/dist/rivets',
        uberbackbone: '../vendor/uberbackbone/uberbackbonerivets',
        tpl: '../vendor/requirejs-tpl/tpl',
        underscore: '../vendor/underscore/underscore',<% if (compassBootstrap) { %>,
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap'<% } else {%>
       	bootstrap: '../vendor/bootstrap/dist/js/bootstrap'<% }%><% if (templateFramework === 'handlebars') { %>,
        handlebars: '../vendor/handlebars/handlebars'<% } %>
    }
});

require([
    'backbonePkg',
    'app'
], function (Backbone, AppView) {
    var appView = new AppView({el: $('#app'), model: new Backbone.UberModel()});
    appView.render();
});
