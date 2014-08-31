/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

var BrbControllerGenerator = scriptBase.extend({
  constructor: function () {
    scriptBase.apply(this, arguments);

    // Location to write controller
    this.option('path', {
      type: String,
      required: false,
      defaults: '/controllers'
    });

  },

  createControllerFiles: function () {
    // path to write file
    var filePath = path.join(this.env.options.appPath, '/js', this.options.path, this.name + 'Ctrl');

    // Write the template
    this.writeTemplate('controller', filePath);

    // Generate test stubs
    if (this.generateTests()) {
      var testOptions = {
        type: 'Controller',
        name: this.name,
        testPath: this.env.options.testPath,
        moduleSrc: path.join(this.options.path, this.name + 'Ctrl').replace(/^\//, '')
      };

      this.writeTest(testOptions);
    }
  }

});

module.exports = BrbControllerGenerator;
