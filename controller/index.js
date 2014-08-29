/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);

  // Location to write controller
  this.option('path', {
    type: String,
    required: false,
    defaults: '/controllers'
  });

  // Set whether to use custom base for model
  this.option('base', {
    type: Boolean,
    defaults: true
  });

  var testOptions = {
    as: 'controller',
    args: [this.name],
    options: {
      ui: this.config.get('ui')
    }
  };

  if (this.generateTests()) {
    this.hookFor('backbone-mocha', testOptions);
  }
}

util.inherits(Generator, scriptBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  // path to write file
  var controllerPath = this.options.path;

  this.writeTemplate('controller', path.join(this.env.options.appPath, '/js', controllerPath, this.name + 'Ctrl));
};
