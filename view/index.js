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
    as: 'view',
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

Generator.prototype.createViewFiles = function createViewFiles() {
  var templateFramework = this.getTemplateFramework();
  var templateExt = '.html';
  this.jst_path = this.env.options.appPath + '/js/templates/' + this.name + templateExt;
  this.template('view.html', this.jst_path);
  this.writeTemplate('view', path.join(this.env.options.appPath + '/js/views', this.name));
};
