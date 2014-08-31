/*jshint latedef:false */
var path = require('path'),
  yeoman = require('yeoman-generator'),
  scriptBase = require('../script-base');


var BrbGenerator = scriptBase.extend({

  constructor: function () {
    scriptBase.apply(this, arguments);

    // Location to write router
    this.option('path', {
      type: String,
      required: false,
      defaults: '/routers'
    });

  },

  createRouterFiles: function () {
    // path to write file
    var filePath = path.join(this.env.options.appPath, '/js', this.options.path, this.name + 'Router');
    this.writeTemplate('router', filePath);

    // Generate test stubs
    if (this.generateTests()) {
      var testOptions = {
        type: 'Router',
        name: this.name,
        testPath: this.env.options.testPath,
        path: this.options.path,
        moduleSrc: path.join(this.options.path, this.name + 'Router').replace(/^\//, '')
      };

      this.writeTest(testOptions);
    }
  }

});

module.exports = BrbGenerator;
