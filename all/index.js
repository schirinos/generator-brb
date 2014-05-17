var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // Directories to create
  this.dirs = 'modules models collections views routes helpers templates'.split(' ');

  this.env.options.appPath = this.options.appPath || 'src/public';
  this.config.set('appPath', this.env.options.appPath);

  args = ['application'];
  args.push('--requirejs');

  this.option('requirejs');
  this.options.requirejs = true; // always force requirejs
  this.env.options.requirejs = this.options.requirejs;

  if (this.options['template-framework']) {
    this.env.options['template-framework'] = this.options['template-framework'];
  }

  this.testFramework = this.options['test-framework'] || 'mocha';

  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('brb:app', {
    args: args
  });
  this.hookFor('brb:router', {
    args: args
  });
  this.hookFor('brb:view', {
    args: args
  });
  this.hookFor('brb:model', {
    args: args
  });
  this.hookFor('brb:collection', {
    args: args
  });

  this.hookFor(this.testFramework, {
    as: 'app',
    options: {
      options: {
        'skip-install': this.options['skip-install']
      }
    }
  });

  this.on('end', function () {
    if (/^.*test$/.test(process.cwd())) {
      process.chdir('..');
    }
    this.installDependencies({ skipInstall: this.options['skip-install'] });
  });
}

util.inherits(Generator, yeoman.generators.Base);


Generator.prototype.createDirLayout = function createDirLayout() {
  this.dirs.forEach(function (dir) {
    this.log.create(path.join(this.env.options.appPath, 'js', dir));
    this.mkdir(path.join(this.env.options.appPath, 'js', dir));
  }.bind(this));
};
