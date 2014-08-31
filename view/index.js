/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

var BrbGenerator = scriptBase.extend({
  constructor: function () {
    scriptBase.apply(this, arguments);

    // Location to write view
    this.option('path', {
      type: String,
      required: false,
      defaults: '/views'
    });

    // Set whether to use uberbackbone objects
    this.option('uber', {
      type: Boolean,
      defaults: true
    });

  },

  createViewFiles: function () {
    // path to write file
    var filePath = path.join(this.env.options.appPath, '/js', this.options.path, this.name + 'View');
    var templateFramework = this.getTemplateFramework();
    var templateExt = '.html';
    this.templatePath = path.join(this.options.path, this.name + templateExt).replace(/^\//, '');

    // Which collection template to use
    var template = 'view';
    if (this.options.uber) {
      template = 'uberView';
    }

    // Write the view file
    this.writeTemplate(template, filePath);

    // Write template file for the view
    this.template('view.html', path.join(this.env.options.appPath, '/js', this.templatePath));

    // Generate test stubs
    if (this.generateTests()) {
      var testOptions = {
        type: 'View',
        name: this.name,
        testPath: this.env.options.testPath,
        path: this.options.path,
        moduleSrc: path.join(this.options.path, this.name + 'View').replace(/^\//, '')
      };

      this.writeTest(testOptions);
    }
  }

});

module.exports = BrbGenerator;
