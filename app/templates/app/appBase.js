/**
    Main application object
    @module app
 */
define([
    'jquery',
    'helpers/backbonePkg',
    'routers/app',
    'views/app',
    'models/app',
    'text!data/services.json',
    'text!data/escalations.json',
    'text!data/incidents.json',
    'text!data/schedules_detail.json',
    'text!data/oncall.json',
    'views/base',
    'sinon',
    'bootstrapDropdown',
    'bootstrapPopover',
    'holder'
],
function($, Backbone, AppRouter, AppView, AppModel, ServicesJSON, EscalationsJSON, IncidentsJSON, ScheduleDetailJSON, OncallJSON, BaseView) {
    var exports = {
        /**
         * Initialize the application
         */
        init: function (selector) {
            // Modify BaseView postrender prototype to run holder
            BaseView.prototype.postRender = function () {
                Holder.run();
            };

            // Setup our fake serve
            // NOTE: Remove this when a real server is created
            this.fakeAjax();

            // Attach application  main view to DOM
            this.appView = new AppView({el: $(selector), model: new AppModel()});
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