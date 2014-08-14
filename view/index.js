/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);

  // Location to write view
  this.option('path', {
    type: String,
    required: false,
    defaults: '/views'
  });

  // Set whether to use custom base for view
  this.option('uber', {
    type: Boolean,
    defaults: true
  });

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
  var viewPath = this.options.path;
  var templateFramework = this.getTemplateFramework();
  var templateExt = '.html';
  this.templatePath = path.join(this.options.path, '../tpls', this.name + templateExt);


  // Create either standard backbone view or our custom augmented view
  if (this.options.uber) {
    this.writeTemplate('uberView', path.join(this.env.options.appPath, '/js', viewPath, this.name));
  } else {
    this.writeTemplate('view', path.join(this.env.options.appPath, '/js', viewPath, this.name));
  }

  // Write template file for the view
  this.template('view.html', path.join(this.env.options.appPath, '/js', this.templatePath));
};
