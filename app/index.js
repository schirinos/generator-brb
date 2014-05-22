'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');
var backboneUtils = require('../util.js');

var Generator = module.exports = function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // Get name of application, we use this as the namespace for the 
  // modules we create.
  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());
  this.appname = backboneUtils.classify(this.appname);

  // Set path for the app front-end code
  this.env.options.appPath = this.options.appPath || 'src/public';
  this.config.set('appPath', this.env.options.appPath);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = this.options['test-framework'] || 'mocha';
  this.templateFramework = this.options['template-framework'] || 'lodash';

  if (this.options.namespace === 'backbone:app') {
    this.hookFor(this.testFramework, {
      as: 'app',
      options: {
        'skip-install': this.options['skip-install'],
        'ui': this.options.ui
      }
    });
  }

  this.config.defaults({
    appName: this.appname,
    ui: this.options.ui,
    coffee: this.options.coffee,
    testFramework: this.testFramework,
    templateFramework: this.templateFramework,
    compassBootstrap: this.compassBootstrap,
    includeRequireJS: this.includeRequireJS
  });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));

  // Execute steps after scafolding finishes
  this.on('end', function () {
    if (this.options.namespace === 'backbone:app') {

      // If we are in a test directory, go one up
      if (/^.*test$/.test(process.cwd())) {
        process.chdir('..');
      }

      // Try installing bower and npm dependenceis
      this.installDependencies({ skipInstall: this.options['skip-install'] });
    }
  });
};

util.inherits(Generator, scriptBase);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  console.log(this.yeoman);
  console.log('Out of the box I include HTML5 Boilerplate, jQuery, Backbone.js, RequireJs, Bootstrap and a Grunfile to build your app.');

  // Setup prompts for user to select generator options
  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Bootstrap for Sass',
      value: 'compassBootstrap',
      checked: false
    }]
  }];

  // Process the prompts a user selected
  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.compassBootstrap = hasFeature('compassBootstrap');
    this.includeRequireJS = true;
    this.config.set('compassBootstrap', this.compassBootstrap);

    if (!this.options.requirejs) {
      this.options.requirejs = this.includeRequireJS;
      this.config.set('includeRequireJS', this.includeRequireJS);
    }
    cb();
  }.bind(this));
};

Generator.prototype.git = function git() {
  this.template('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.template('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
  var contentText = [
    'body {\n    background: #fafafa;\n}',
    '\n.hero-unit {\n    margin: 50px auto 0 auto;\n    width: 300px;\n}'
  ];
  var ext = '.css';
  this.write(this.env.options.appPath + '/css/main' + ext, contentText.join('\n'));

  this.template('main.less', this.env.options.appPath + '/less/main.less');
};

Generator.prototype.writeIndexWithRequirejs = function writeIndexWithRequirejs() {
  if (!this.includeRequireJS) {
    return;
  }
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  this.indexFile = this.appendScripts(this.indexFile, 'js/main.js', [
    'vendor/requirejs/require.js'
  ], {'data-main': 'js/main'});
};

Generator.prototype.createRequireJsAppFile = function createRequireJsAppFile() {
    if (!this.includeRequireJS) {
      return;
    }
    this.template('requirejs_app.js', this.env.options.appPath + '/js/main.js');
};

Generator.prototype.setupEnv = function setupEnv() {
  this.mkdir(this.env.options.appPath);
  this.mkdir(this.env.options.appPath + '/js');
  this.mkdir(this.env.options.appPath + '/vendor/');
  this.mkdir(this.env.options.appPath + '/css');
  this.mkdir(this.env.options.appPath + '/less');
  this.mkdir(this.env.options.appPath + '/img');
  this.write(this.env.options.appPath + '/index.html', this.indexFile);
};

Generator.prototype.h5bp = function h5bp() {
  this.copy('app/404.html', this.env.options.appPath + '/404.html');
  this.copy('app/favicon.ico', this.env.options.appPath + '/favicon.ico');
  this.copy('app/robots.txt', this.env.options.appPath + '/robots.txt');
  this.copy('app/htaccess', this.env.options.appPath + '/.htaccess');
};
