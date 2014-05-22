/**
    Main Router - The central routing object for the application
    @module routers/app
    @extends Backbone.Router
 */
define([
    'backbone',
    'helpers/vent',
],
function (Backbone, Vent){
    /**
     * Constructor
     * @constructor
     * @alias module:routers/main
     */
    var exports = Backbone.Router.extend({
        /**
        * Route map
        * @type {Object}
        */
        routes: {
            '*path'                 : 'defaultRoute',
        },
        /**
         * Initializes the application workspace.
         * @param {object} options The initialization options
         */
        initialize: function (options) {
            // Register router to listen for application wide url changes
            this.listenTo(Vent, 'app:navigate', this.navigate);
        },
        /**
         * Default route
         */
        defaultRoute: function (path){
            // Render homepage view into main space
            Vent.trigger('app:swapMain', 'home');
        }
    });

    // Export module
    return exports;
});