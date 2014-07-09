/**
 *  List view - Generic list view
 *  @module views/list
 *  @extends views/base
 */
define([
    'views/base',
    'helpers/vent',
],
function(BaseView, Vent){
    /**
     * @constructor
     * @alias module:views/list
     * @param {Object} options Initialization options
     */
    var exports = BaseView.extend({
        /**
         * String to generate filter regular expression from
         */
        filter : null,
        /**
         * Name of the property to filter on
         */
        filterName : null,
        /**
         * Wire up events
         */
        events : {
            'click [data-action="sort"]' : 'actionSort'
        },
        /**
         * Automatically called upon object construction
         */
        initialize: function (options) {
            // Call parent to to setup stuff
            BaseView.prototype.initialize.apply(this, arguments);

            // Merge certain options
            this.mergeOpts(options, ['itemView', 'template']);

            // Listen for collection events
            this.listenTo(this.collection, 'add', this.addItem);
            this.listenTo(this.collection, 'reset', this.resetItems);
            this.listenTo(this.collection, 'sort', this.resetItems);

            // Refresh our list
            this.refresh();
        },
        /**
         * Toggles sort direction on the collection
         */
        actionSort: function (e) {
            this.collection.setSort(null, $(e.currentTarget).attr('data-sort-key'), true);
        },
        /**
         * Add an item
         * @param {Object} model Model added to the collection
         * @param {Object} collection The collection model was added to
         * @param {Object} options Options passed to the add event
         */
        addItem: function (model, collection, options) {
            var view = new this.itemView({model: model});
            this.$list.append(view.render().el);
        },
        /**
         * Reset the items
         * @param {Object} collection The collection model was added to
         * @param {Object} options Options passed to the add event
         */
        resetItems: function (collection, options) {
            // Empty the services list
            this.$list.empty();

            // For callbacks
            var self = this;

            // Do we have filter criteria set?
            if (this.filter && this.filterName) {
                var filterRegex = new RegExp(this.filter,'gi');
            }

            // Iterate through collection
            _.each(collection.models, function (item, idx, list){
                // Is there a filter set?
                if (filterRegex) {
                    if (item.get(self.filterName).match(filterRegex)) {
                        self.addItem(item, list, options);
                    }
                } else {
                    self.addItem(item, list, options);
                }
            });
        },
        /**
         * Refresh the view data
         */
        refresh: function (model, collection, options) {
            // show loading
            this.showLoading('Loading');

            // For callbacks
            var self = this;

            // Get data from server
            this.collection.fetch({reset: true})
            .always(function () {
                self.hideLoading();
            })
            .done(function () {
                self.collection.sort();
            })
            .fail(function () {
            });
        }
    });

    // Export module
    return exports;
});
