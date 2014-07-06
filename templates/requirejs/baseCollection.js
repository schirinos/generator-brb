define([
        'underscore',
        'collections/base',
        'models/base'
],
function (_, BaseColl, BaseModel) {
    'use strict';

    var <%= _.classify(name) %>Coll = BaseColl.extend({
        url: '',

        model: BaseModel,

        parse: function(response, options)  {
                return response;
        }
    });

    return <%= _.classify(name) %>Coll;
});
