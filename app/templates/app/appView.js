/**
    Main application wrapper view
    @module views/app
    @extends BaseView
 */
define([
    'views/base',
    'helpers/vent'
],
function(BaseView, Vent){
    /**
     * Automatically attaches child views when instantiated by calling <b>attachChildViews</b>
     * @constructor
     * @alias module:views/app
     * @param {Object} options Initialization options
     */
    var exports = BaseView.extend({
        /**
         * Automatically called upon object construction
         */
        initialize: function (options) {
            // Call parent to to setup stuff
            BaseView.prototype.initialize.apply(this, arguments);

            // Subscribe events to swap things in the main view area
            this.listenTo(Vent, 'app:swapMain', this.swapMain);

            // Attach global subviews such as Header and Footers
        },
        /**
         * Swap out the main view of the app
         * @param {string} key Name of the view to swap into the main area.
         */
        swapMain: function (key) {
            
        }
    });

    // Export module
    return exports;
});