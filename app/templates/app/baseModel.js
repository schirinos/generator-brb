/**
    A base model that all models in the app derive from. Implements some shared functionality
    that the base Backbone models don't provide but our useful to this app.
    @module app/models/base
    @extends Backbone.Model
 */
define([
    'helpers/backbonePkg'
],
function(Backbone){
    /**
     * Constructor
     * @constructor
     */
    var exports = Backbone.NestedModel.extend({
        /**
         * The options passed to the function
         * @type {Object}
         */
        options : {},
        /**
         * Merge a specified set of options from the passed options object with properties on this object.
         * @param {Object} options The options to pick from when merging.
         * @param {Array} mergeOpts The option names to merge.
         */
        mergeOpts: function (options, mergeOpts) {
            // Merge some passed options with default options
            _.extend(this, _.pick(_.extend({}, options), mergeOpts));
        }
    });

    // Export module
    return exports;
});