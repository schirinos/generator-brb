/**
 * Base collection, has some shared functions that most collection need.
 * @exports app/collections/base
 */
define([
    'backbone'
    ],
function(Backbone){
    /**
     * Contructor
     * @constructor
     * @alias app/collections/base
     */
    var exports = Backbone.Collection.extend({
        /**
         * The options passed to the function
         * @type {Object}
         */
        options : {},
        /**
         * Sort direction
         * @type {String}
         */
        sortDir : 'asc',
        /**
         * Property of the model to sort by
         * @type {String}
         */
        sortName : 'asc',
        /**
         * Merge a specified set of options from the passed options object with properties on this object.
         * @param {Object} options The options to pick from when merging.
         * @param {Array} mergeOpts The option names to merge.
         */
        mergeOpts: function (options, mergeOpts) {
            // Merge some passed options with default options
            _.extend(this, _.pick(_.extend({}, options), mergeOpts));
        },
        /**
         * The sort strategies availble for this collection
         * @param {String} dir The sort direction
         */
        strategies: function (dir) {
            if (dir === 'desc') {
                return function (prop) {
                    return function (model1, model2) {
                        if (model1.get(prop) > model2.get(prop)) return -1; // before
                        if (model2.get(prop) > model1.get(prop)) return 1; // after
                        return 0; // equal
                    }
                }
            } else {
                return function (prop) {
                    return function (model1, model2) {
                        if (model1.get(prop) > model2.get(prop)) return 1; // after
                        if (model1.get(prop) < model2.get(prop)) return -1; // before
                        return 0; // equal
                    }
                }
            }
        },
        /**
         * Change the sort comparator
         */
        setSort: function (dir, name, doSort) {
            // Toggle between asc and desc if no direction specified
            // and this is not our first sort on the particular property name
            // otherwise we just make the default 'asc' or whatever direction they passed in.
            if ((this.sortName === name) && !dir) {
                this.sortDir = (this.sortDir === 'asc') ? 'desc' : 'asc';
            } else {
                this.sortDir = dir || 'asc';
            }

            // Track the sort property
            this.sortName = name;

            // Default to not sort automatically
            doSort = doSort || false;

            // Set the comparator and fire off a sort
            this.comparator = this.strategies(this.sortDir)(this.sortName);

            // Should we fired off a sort right away
            if (doSort) this.sort();
        },
    });

    // Export object
    return exports;
});