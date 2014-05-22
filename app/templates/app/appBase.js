/**
    Main application object
    @module app
 */
define([
    'jquery',
    'backbone',
    'routers/app',
    'views/app',
    'models/base'
],
function($, Backbone, AppRouter, AppView, BaseModel) {
    var exports = {
        /**
         * Initialize the application
         */
        init: function (selector) {
            // Attach application  main view to DOM
            this.appView = new AppView({el: $(selector), model: new BaseModel()});
            this.appView.render();

            // Create the application router
            // and start Backbone history to make router work
            this.appRouter = new AppRouter();
            Backbone.history.start({root: '/', pushState: true});
        }
    };

    // Export module
    return exports;
});