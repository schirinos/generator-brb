/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);

  // Location to write model
  this.option('path', {
    type: String,
    required: false,
    defaults: '/models'
  });

  // Set whether to use custom base for model
  this.option('base', {
    type: Boolean,
    defaults: true
  });

  var testOptions = {
    as: 'model',
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

Generator.prototype.createModelFiles = function createModelFiles() {
  // path to write file
  var modelPath = this.options.path;

  if (this.options.base) {
    this.writeTemplate('baseModel', path.join(this.env.options.appPath, '/js', modelPath, this.name));
  } else {
    this.writeTemplate('model', path.join(this.env.options.appPath, '/js', modelPath, this.name));
  }
};
