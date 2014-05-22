/*global require*/
'use strict';

require.config({
    shim: {<% if (compassBootstrap) { %>
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }<% } %><% if (templateFramework === 'handlebars') { %>,
        handlebars: {
            exports: 'Handlebars'
        }<% } %>
    },
    paths: {
        jquery: '../vendor/jquery/dist/jquery',
        backbone: '../vendor/backbone/backbone',
        underscore: '../vendor/lodash/dist/lodash'<% if (compassBootstrap) { %>,
        bootstrap: '../vendor/sass-bootstrap/dist/js/bootstrap'<% } else {%>
       	bootstrap: '../vendor/bootstrap/dist/js/bootstrap'<% }%><% if (templateFramework === 'handlebars') { %>,
        handlebars: '../vendor/handlebars/handlebars'<% } %>
    }
});

require([
    'backbone'
], function (Backbone) {
    Backbone.history.start();
});