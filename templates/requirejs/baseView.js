/**
    The base view from which all views in the app derive.
    @module views/base
    @extends Backbone.View
 */
define([
    'backbone',
    'text!tpls/loading.html',
    'text!tpls/alert.html',
    'text!tpls/info.html'
    ],
function(Backbone, TplLoading, TplAlert, TplInfo){
    /**
     * Automatically attaches child views when instantiated by calling <b>attachChildViews</b>
     * @constructor
     * @alias module:app/views/base
     * @param {Object} options To specify child views. Pass a views object under the "views" key to the options object.
     * The views object should be key value pairs where the key is a css selector (ex: .main) and the value is instance of a Backbone view.
     * <br /> `Ex: var myView = new BaseView(views : {'.main':new BakeView()});`
     */
    var exports = Backbone.View.extend({
        /**
         * Holds child views attached to different areas of the template
         * specified by a selector.
         * @type {Object}
         */
        views: {},
        /**
         * Holds ref to parent view
         * @type {Object}
         */
        parent: {},
        /**
         * Flag that tells whether to use the template's first child element as the view's root element or not.
         * By default backbone views automatically creates a <div> to wrap the view. 
         * Setting this to true will use the first child in the template's html as the view's element.
         * @type {Boolean}
         */
        replace: true,
        /**
         * Options for animation on the view
         * @type {Object}
         */
        animate: {},
        /**
         * The template for the view
         * @type {Object}
         */
        template: {},
        /**
         * Automatically called upon object construction
         */
        initialize: function (options) {
            // need to init local copy of child view
            // object to maintain proper protype chain
            this.views = {};

            // Merge selected options into object
            this.mergeOpts(options, ['views', 'animate', 'template', 'replace']);

            // Attach the view's template
            this._attachTemplate();

            // Generate a deferred for the view to update
            // when rendering is complete and the view has been added
            // to the DOM.
            this._rendering = $.Deferred();

            // Generate a promise object for outsiders to 
            // track when this view is added to the DOM.
            this.rendering = this._rendering.promise();

            // Cache bind elements as jQuery objects
            this.cacheBindRegions();

            // Attach child views specified in the constructor
            this.attachChildViews();
        },
        /**
         * Iterates through child views passed into constructor options and attaches them to the object.
         * Keys are based on the selector
         */
        attachChildViews: function() {
            if (this.views) {
                // Iterate through child view definitions and attachs to views object
                for(var selector in this.views) {
                    // Attach child view
                    this.attachView(this.views[selector], selector);
                }
            }
        },
        /**
         * Attach a child view
         * @param {Object} view The view object
         * @param {String} selector The CSS selector in the parent view markup to render the child view to
         */
        attachView: function(view, selector) {
            // Are we attaching the view to a certain selector in the parent view's template
            if (selector) {
                // Store reference to view, using the selector as the index
                this.views[selector] = view;
            } else {
                // Empty selector means we don't track as a normal child view.
                // But we still need to cleanup these created views, when the parent is cleaned up.
                // So have the view listen to the parent view's cleanup method in order to know when to clean itself up
                view.listenTo(this, "cleanUp", view.cleanUp);
            }

            // for chaining
            return this;
        },
        /**
         * Destroy view and remove it from DOM. Optionally animate the removal
         * @param {Object} options Options passed to the cleanup, such as animation settings
         */
        cleanUp: function (options) {
            // Merge view options with options arguments
            options = _.extend({}, {animate: this.animate}, options);

            // Fire cleanUp event for the view.
            // Child views that are attached without references in the 
            // "views" property are cleaned up this way, because they just listen to
            // the cleanup event of their parent.
            // We need to force the child views listening to not to animate
            // because we can't figure out when animation is finished.
            // NOTE: We probably could somehow figure out the animation, but it is not neccessary as of yet...
            this.trigger('cleanUp', {animate: {cleanUp: false}});

            // Init array to store deffered objects of the child views
            // in case they have animated cleanup. Those without animated cleanup
            // will just returned resolved deffered objects.
            var childq = [];

            // Do we have child views attached to certain selectors?
            if (this.views) {
                // Iterate through child views
                for (var n in this.views) {
                    // Call cleanup and add deffered objects to the array
                    childq.push(this.views[n].cleanUp());
                }
            }

            // For callbacks
            var self = this;

            // We remove this view onl when child views cleanup animations are complete.
            // At the same time we return the deffered object of this view, so the caller
            // knows when this view's cleanup is complete.
            return $.when.apply($, childq).then(function (){

                // Are we animating cleanup of this view
                if (options.animate && options.animate.cleanUp) {
                    // TODO: Ability to specify more animations
                    // Fade out view
                    //self.$el.fadeOut('fast'); 

                    // NOTE: May cause flickering on some Safari,
                    // see the webkit-backface-visibility hack
                    // Use CSS3 Fade transitions
                    self.$el.transition({opacity:0});
                }

                // Remove the view from the DOM once any animation is complete
                // this also passes up the deffered object through the chain 
                // so that to the caller so it knows when all animation is complete.
                return self.$el.promise().done(function () {
                    // Remove the view
                    self.remove();
                });
            });
        },
        /**
         * Called before the template is attached to the view.
         * You could override or munge the template before it is attached ot the view in this step.
         */
        preTemplate: function() {

        },
        /**
         * Called before the main rendering logic takes place, but after the template is attached
         */
        preRender: function() {

        },
        /**
         * Called after the main rendering logic takes place
         */
        postRender: function() {

        },
        /**
         * Attaches the template to the view
         */
        _attachTemplate: function() {
            // Pre template attachment actions
            this.preTemplate();

            // Check to see if template was compiled by seeing if it is a function
            if (_.isFunction(this.template)) {
                // Is a model set on the view?
                if (this.model) {
                    if (this.replace) {
                        // Create new dom element, and insert the template as innerhtml
                        var new_elem = document.createElement('div');
                        new_elem.innerHTML = this.template(this.model.toJSON());

                        // Extract the first child of the dom element and use it as the view's new root element
                        this.setElement(new_elem.firstChild);
                    } else {
                        this.$el.html(this.template(this.model.toJSON()));
                    }

                    // Generate a bindings array from template markup
                    // and merge with the views set binding
                    this.createStickitBindings();
                } else {
                    if (this.replace) {
                        // Create new dom element, and insert the template as innerhtml
                        var new_elem = document.createElement('div');
                        new_elem.innerHTML = this.template();
                        
                        // Extract the first child of the dom element and use it as the view's new root element
                        this.setElement(new_elem.firstChild);
                    } else {
                        this.$el.html(this.template());
                    }
                }
            }
        },
        /**
         * Render the view to the DOM. Rendering happens in top down fashion with the base view being added to the DOM first then each subsequent child.
         * @param {Object} domEl Passing a dom element will render the view to this element instead.
         * @param {Object} options Options for rendering
         * @returns this for chaining
         */
        render: function(domEl, options) {
            // Setup model view binding
            if (this.model) this.stickit();

            // For callbacks
            var self = this;

            // After template is attached but before view is added to DOM actions.
            this.preRender();

            // Was there a dom element passed we should immediately attach to?
            // Do we animate the render portion? 
            if (domEl && this.animate && this.animate.render) {
                // First we hide the view element
                this.$el.css('opacity', 0);

                // Do we replace the entire contents of the DOM element
                if (options && options.replace) {
                    $(domEl).html(this.$el);
                }
                // Otherwise just append into the DOM element
                else {
                    // Prepend?
                    if (options && options.prepend) {
                        this.$el.prependTo(domEl);
                    } else {
                        this.$el.appendTo(domEl);
                    }
                }

                // Regular jquery dom animaton
                this.$el.fadeIn('slow').done(function () {
                    // Notify that we have rendered the main view template.
                    // Use setTimeout to allow browser animation loop to catch up
                    // so that we get proper info from things like inspecting height and width of
                    // DOM elements
                    setTimeout(function() {
                        self._rendering.notifyWith(this, 'main');
                    }, 0);
                });
            }

            // Append to dom without animation
            else if (domEl) {
                // Do we replace the entire contents of the DOM element
                if (options && options.replace) {
                    $(domEl).html(this.$el);
                }
                // Otherwise just append to the DOM element
                else {
                    // Prepend?
                    if (options && options.prepend) {
                        this.$el.prependTo(domEl);
                    } else {
                        this.$el.appendTo(domEl);
                    }
                }

                // Notify that we have rendered the main view template.
                // Use setTimeout to allow browser animation loop to catch up
                // so that we get proper info from things like inspecting height and width of
                // DOM elements
                setTimeout(function() {
                    self._rendering.notifyWith(this, 'main');
                }, 0);
            }

            // For callbacks
            var self = this;

            // Only try to perform post render actions
            // when we know animation has completed.
            // By attaching to the done callback of the promise object
            // for the view's DOM element, it will be fired when animation is complete
            // or immediately if no animation was done.
            this.$el.promise().done(function () {
                // We start rendering child views once the 
                // main view is rendered.
                self.renderChildren();

                // Resolve the view's rendering deferred
                // in order to alert any watchers that the view has finished rendering.
                // Do within setTimeout to schedule withing natural browser repaint cycle.
                setTimeout(function() {
                    self._rendering.resolveWith(self);

                    // Post render actions take place after we render each child
                    self.postRender();
                }, 0);
            });

            // For chaining
            return this;
        },
        /**
         * Render a specific child view to DOM
         * @param {Object} selector A css selector used to find the dom elemnt to render to within the parent container
         * @param {Object} options Options passed to the render function
         */
        renderChild: function(selector, options) {
            // Check if child views is available
            if (this.views[selector]) {
                // Render view into the selector area of the parent view
                this.views[selector].render(this.$(selector)[0], options);
            }
        },
        /**
         * Render child views to DOM
         */
        renderChildren: function() {
            // Check if child views were set and render child views
            if(this.views) {
                for(var selector in this.views) {
                    this.renderChild(selector);
                }
            }
        },
        /**
         * Hide loading graphic
         * @param {Object} [animate] Animation settings for hiding loading graphic
         */
        hideLoading: function (animate) {
            // Are we animating?
            if (animate) {
                // remove loading bar from dom
                this.$('[data-loading-msg]').fadeOut(function () {
                    $(this).remove();
                });
            } else {
                // remove loading bar from dom
                this.$('[data-loading-msg]').remove();
            }
        },
        /**
         * Show the loading graphic
         * @param {String} [msgText] The message to display in the loading graphic
         */
        showLoading: function (msgText) {
            // Remove existing loading graphic
            this.hideLoading();

            // Compile template to html
            var html = _.template(TplLoading, {msg: msgText});

            // If we see this tag then we insert the loading message as its next sibiling
            var tag = this.$('[data-loading-location]');
            if (tag[0]) {
                tag.after(html);

            // Otherwise we just attach it to top of template
            } else {
                this.$el.prepend(html);
            }
        },
        /**
         * Hide alert box
         * @param {Object} [animate] Animation settings for hiding alert box
         */
        hideAlert: function (animate) {
            // Are we animating?
            if (animate) {
                // remove alert box from dom
                this.$('[data-alert-msg]').fadeOut(function () {
                    $(this).remove();
                });
            } else {
                // remove alert box from dom
                this.$('[data-alert-msg]').remove();
            }
        },
        /**
         * Show alert message
         * @param {String} [msgText] The message to display in the alert area
         */
        showAlert: function (msgText) {
            // Remove existing alert message
            this.hideAlert();

            // If we see a this tag then we insert the loading message as its next sibiling
            var tag = this.$('[data-alert-location]');
            if (tag[0]) {
                tag.after(_.template(TplAlert, {msg: msgText}));

            // Otherwise we just attach it to top of template
            } else {
                this.$el.prepend(_.template(TplAlert, {msg: msgText}));
            }
        },
        /**
         * Hide info message
         * @param {Object} [animate] Animation settings for hiding alert box
         */
        hideInfo: function (animate) {
            // Are we animating?
            if (animate) {
                // remove info box from dom
                this.$('[data-info-msg]').fadeOut(function () {
                    $(this).remove();
                });
            } else {
                // remove info box from dom
                this.$('[data-info-msg]').remove();
            }
        },
        /**
         * Show info message
         * @param {String} [msgText] The message to display in the alert area
         * @param {Integer} [timeout] Number of milliseconds in which to automatically fadeout the info box.
         */
        showInfo: function (msgText, timeout) {
            // Remove existing
            this.hideInfo();

            // If we see a data-msg-info tag then we insert the message as its next sibiling
            var tag = this.$('[data-info-location]');
            if (tag[0]) {
                tag.after(_.template(TplInfo, {msg: msgText}));

            // Otherwise we just attach it to top of template
            } else {
                this.$el.prepend(_.template(TplInfo, {msg: msgText}));

                // For callbacks
                var self = this;

                // Do we have auto removal set?
                if (timeout > 0) {
                    setTimeout(function () {
                        self.hideInfo(true);
                    }, timeout);
                }
            }
        },
        /**
         * Shows a popover for a target element.
         * @param {Object} elem The dom element to attach popover to
         * @param {Integer} timeout The number of milliseconds before the popover should autmatically fade out
         * @param {Object} options Options to pass to popover call
         */
        showPopover: function(elem, timeout, options) {
            // Initialize popover
            $(elem).popover(
                $.extend({
                    trigger: "manual",
                    placement: "left",
                    html: true,
                    content: '<span class="text-error">Action failed, try again.</span>'
                }, options)
            );

            // Show popover
            $(elem).popover('show');

            // Fade out popover after timeout period
            if (timeout && elem) {
                setTimeout(function () {
                    // We need to check if the element exists
                    // before we destory the popover or we crash the browser.
                    if ($(elem)[0]) {
                       $(elem).popover('destroy');
                   }
                }, timeout);
            }
        },
        /**
         * Your views should override this method when needed. Use as a convenience function to
         * fetch data from an attached model or collection while showing something in the UI to indicate waiting.
         * You can use the built in showLoading/hideLoading functions to facillitate this.
         */
        refresh: function () {},
        /**
         * Create cached jQuery objects from all "data-region" tags to use later.
         */
        cacheBindRegions: function () {
            // For callbacks
            var self = this;

            // Iterate through the "data-bind" tags
            this.$('[data-bind]').each(function (idx, elem) {
                // Cache a copy of the jquery object for that element
                self["$"+$(this).data("bind")] = $(this);
                
                // Attach the more precise selector, since it is lost by rewrapping element directly in jquery function ie: $(this)
                self["$"+$(this).data("bind")].selector = this.tagName.toLowerCase() + '[data-bind="' + $(this).data("bind") + '"]';
            });
        },
        /**
         * Create stickit bindings from data-stickit attributes in the HTML and merge
         * with any set on the view. This will create basic bindings.
         */
        createStickitBindings: function () {
            // For callbacks
            var self = this;

            // Init empty bindings
            var bindings = {};

            // Iterate through the "data-stickit" tags to find which attribute to observe
            this.$('[data-stickit]').each(function (idx, elem) {

                // Generate the default attribute to observe and the selector key
                var observe = $(this).attr("data-stickit");
                var selector = '[data-stickit="'+ observe +'"]';

                // Check for advanced stickit options
                var adv_opts = $(this).data("stickit-opts");
                adv_opts = adv_opts ? adv_opts.split('|') : undefined;

                // Iterate through advance options definitions
                var opt_def = {};
                _.each(adv_opts, function (opt) {
                    // Split options into key value pairs
                    var pairs = opt.split(":");

                    // Treat an option without a key as the observe option
                    if (pairs.length === 1) {
                        opt_def.observe = pairs[0];
                    }
                    // All other options need keys defined
                    else if (pairs.length > 1) {
                        if (pairs[0] === 'visible' || pairs[0] === 'updateView') {
                            // These options need to be converted to booleans
                            opt_def[pairs[0]] = pairs[1] == 'false' ? false : true;
                        } else {
                            opt_def[pairs[0]] = pairs[1];
                        }
                    }
                });

                // Check for stickit attribute options
                var attrs_opts = $(this).data('stickit-attrs');
                attrs_opts = attrs_opts ? attrs_opts.split('|') : undefined;

                // Iterate through attribute definitions
                var attrs_def = [];
                _.each(attrs_opts, function (def) {
                    // Definition is divided into `name` and `observe` by a colon
                    var parts = def.split(":");

                    // Push on the new attribute definition
                    attrs_def.push({name: parts[0], observe: parts[1]});
                });

                // No advanced options or attribute options, means we treat this 
                // as the most basic stickit binding type.
                // The stickit data tag value is the attribute on the model to observe
                if (_.isEmpty(opt_def) && attrs_def.length < 1) {
                    bindings[selector] = bindings[selector] || {};
                    bindings[selector].observe = observe;
                }
                // Otherwise the user needs to have defined either advanced options or attribute options on the element
                // for binding config the be generated properly.
                else if (!_.isEmpty(opt_def) || attrs_def.length > 0) {
                    bindings[selector] = bindings[selector] || {};
                    bindings[selector] = _.extend(bindings[selector], opt_def);
                    bindings[selector].attributes = attrs_def;
                }
            });

            // Add the stickit bindings generated from markup to the ones already set in the 
            // view code. Binding keys already set in view code will not be overwritten by markup generated bindings.
            this.bindings = _.defaults(this.bindings, bindings);
        },
        /**
         * Merge a specified set of options from the passed options object with properties on this object.
         * @param {Object} options The options to pick from when merging.
         * @param {Array} mergeOpts The option names to merge.
         */
        mergeOpts: function (options, mergeOpts) {
            // Make sure options is set to something
            options = options || {};

            // Merge the specified passed options with this object
            _.extend(this, _.pick(options, mergeOpts));
        },
        /**
         * Takes an event object and calls prevent default and stopPropogation on it to block the events from bubbling.
         * @param {object} e The event object for fired event
         */
        blockEvents: function (e) {
            // Do we have an event object
            if (e) {
                // Prevent default browser action
                e.preventDefault();
                e.stopPropagation();

                if (e.gesture) {
                    e.gesture.preventDefault();
                    e.gesture.stopPropagation();
                }

                // Blocking events was called without problems
                return true;
            } else {
                // There was no event object so blocking failed
                return false;
            }
        },
        /**
         * Takes an event object and call stopPropogation on it to block the events from bubbling.
         * @param {object} e The event object for fired event
         */
        blockProp: function (e) {
            // Do we have an event object
            if (e) {
                // Prevent default browser action
                e.stopPropagation();

                if (e.gesture) {
                    e.gesture.stopPropagation();
                }

                // Blocking events was called without problems
                return true;
            } else {
                // There was no event object so blocking failed
                return false;
            }
        },
        /**
         * Prevents default action on the passed event object
         * @param {object} e The event object for fired event
         */
        blockDefault: function (e) {
            // Do we have an event object
            if (e) {
                // Prevent default browser action
                e.preventDefault();

                if (e.gesture) {
                    e.gesture.preventDefault();
                }

                // Was called without problems
                return true;
            } else {
                // There was no event object so it failed
                return false;
            }
        },
        /**
         * Swap a child view from a region with a new view
         * @param {Object} newView The new view to display
         */
        swapView: function (selector, newView) {
            // For callbacks
            var self = this;

            // Check if we have a view for this selector already
            if (this.views[selector]) {
                // Clean up the most recently swapped out view
                this.views[selector].cleanUp().done(function () {
                    // Attach view as child and render it, replacing anything that might be there before
                    self.attachView(newView, selector).renderChild(selector, {replace:true});
                });
            } else {
                // Attach view as child and render it, replacing anything that might be there before
                this.attachView(newView, selector).renderChild(selector, {replace:true});
            }

            // Since swaping could take some time due to animation callbacks
            // we return the promise object of the old view so our
            // calling function knows when the view has been swapped and rendered to the page
            return this.views[selector].$el.promise();

        }
    });

    return exports;
});