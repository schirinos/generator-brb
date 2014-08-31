/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

var BrbGenerator = scriptBase.extend({
  constructor: function () {
    scriptBase.apply(this, arguments);

    // Location to write model
    this.option('path', {
      type: String,
      required: false,
      defaults: '/models'
    });

    // Set whether to use uberbackbone objects
    this.option('uber', {
      type: Boolean,
      defaults: true
    });

  },

  createModelFiles: function () {
    // path to write file
    var filePath = path.join(this.env.options.appPath, '/js', this.options.path, this.name + 'Model');

    // Which collection template to use
    var template = 'model';
    if (this.options.uber) {
      template = 'uberModel';
    }

    // Write the template
    this.writeTemplate(template, filePath);

    // Generate test stubs
    if (this.generateTests()) {
      var testOptions = {
        type: 'Model',
        name: this.name,
        testPath: this.env.options.testPath,
        path: this.options.path,
        moduleSrc: path.join(this.options.path, this.name + 'Model').replace(/^\//, '')
      };

      this.writeTest(testOptions);
    }
  }

});

module.exports = BrbGenerator;
