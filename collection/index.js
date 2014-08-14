/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
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

  var testOptions = {
    as: 'collection',
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
  var collPath = this.options.path;

  if (this.options.uber) {
    this.writeTemplate('uberCollection', path.join(this.env.options.appPath, '/js', collPath, this.name));
  } else {
    this.writeTemplate('collection', path.join(this.env.options.appPath, '/js', collPath, this.name));
  }
};
