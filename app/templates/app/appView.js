/**
    Main application wrapper view
    @module views/app
    @extends BaseView
 */
define([
    'backbonePkg',
    'helpers/vent',
    'routers/app'
],
function(Backbone, Vent, AppRouter){
    /**
     * Automatically attaches child views when instantiated by calling <b>attachChildViews</b>
     * @constructor
     * @alias module:views/app
     * @param {Object} options Initialization options
     */
    var exports = Backbone.UberView.extend({
        /**
         * Automatically called upon object construction
         */
        initialize: function (options) {
            // Call parent to to setup stuff
            Backbone.UberView.prototype.initialize.apply(this, arguments);

            // Setup our app container to listen for events
            this.listenTo(Vent, 'app:swapView', this.swapView);

            // Create the app router and kickoff app
            // routing by starting history
            this.appRouter = new AppRouter();
            Backbone.history.start({root: '/', pushState: true});
        }
    });

    // Export module
    return exports;
});
