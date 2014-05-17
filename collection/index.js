/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);
  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

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
  this.writeTemplate('collection', path.join(this.env.options.appPath + '/js/collections', this.name)); 
};
