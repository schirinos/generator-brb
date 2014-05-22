/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);

  // XXX default and banner to be implemented
  this.argument('attributes', {
    type: Array,
    defaults: [],
    banner: 'field[:type] field[:type]'
  });

  // Basemodel or standard model
  this.argument('base', {
    type: boolean,
    defaults: true,
    banner: 'base[true|false]'
  });

  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function (attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      type: parts[1] || 'string'
    };
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

Generator.prototype.createModelFiles = function createModelFiles(modPath) {
  if (this.base) {
    this.writeTemplate('baseModel', path.join(this.env.options.appPath + '/js/models', this.name));
  } else {
    this.writeTemplate('model', path.join(this.env.options.appPath + '/js/models', this.name));
  }
};
