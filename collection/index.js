/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

var BrbCollectionGenerator = scriptBase.extend({
  constructor: function () {
    scriptBase.apply(this, arguments);

    // Location to write collection
    this.option('path', {
      type: String,
      required: false,
      defaults: '/collections'
    });

    // Set whether to use uberbackbone objects
    this.option('uber', {
      type: Boolean,
      defaults: true
    });

  },

  createCollectionFiles: function () {
    // path to write file
    var collPath = path.join(this.env.options.appPath, '/js', this.options.path, this.name + 'Coll');

    // Which collection template to use
    var collTemplate = 'collection';
    if (this.options.uber) {
      collTemplate = 'uberCollection';
    }

    // Write the template
    this.writeTemplate(collTemplate, collPath);

    // Generate test stubs
    if (this.generateTests()) {
      var testOptions = {
        type: 'Collection',
        name: this.name,
        testPath: this.env.options.testPath,
        path: this.options.path,
        moduleSrc: path.join(this.options.path, this.name + 'Coll').replace(/^\//, '')
      };

      this.writeTest(testOptions);
    }
  }

});

module.exports = BrbCollectionGenerator;