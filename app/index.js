'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');
var backboneUtils = require('../util.js');
var exec = require('child_process').exec;

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
  this.config.set('serverPath', 'src/server');
  this.config.set('projectRoot', path.join(__dirname, '../'));

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = this.options['test-framework'] || 'mocha';
  this.templateFramework = this.options['template-framework'] || 'lodash';

  // Enable test framework setup if we are setting up the full app
  if (this.options.namespace === 'brb:app') {
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
    includeRequireJS: this.options.requirejs,
    includeVagrant: this.options.vagrant
  });

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));

  // Execute steps after scafolding finishes
  this.on('end', function () {
    if (this.options.namespace === 'brb:app') {

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
    },{
      name: 'Vagrant',
      value: 'vagrant',
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
    this.vagrant = hasFeature('vagrant');
    this.includeRequireJS = true;

    // Set prompts
    this.config.set('compassBootstrap', this.compassBootstrap);
    this.config.set('vagrant', this.vagrant);
    this.config.set('includeRequireJS', this.includeRequireJS);

    cb();
  }.bind(this));
};

Generator.prototype.git = function git() {
  this.template('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.vagrant = function vagrant() {
  if (!this.vagrant) {
    return;
  }

  this.template('Vagrantfile', 'Vagrantfile');
  this.mkdir('vagrant/puppet/modules');
  this.mkdir('vagrant/puppet/manifests');
  this.template('Puppetfile', 'vagrant/puppet/Puppetfile');
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

Generator.prototype.backbonePkg = function backbonePkg() {
  this.ensureAppDir('js/helpers');
  this.template('app/backbonePkg.js', path.join(this.env.options.appPath, 'js', 'helpers/backbonePkg.js'));
};

Generator.prototype.baseView = function baseView() {
  this.ensureAppDir('js/views');
  this.template('app/baseView.js', path.join(this.env.options.appPath, 'js', 'views/base.js'));
};

Generator.prototype.tpls = function tpls() {
  this.ensureAppDir('js/tpls');
  this.template('app/loading.html', path.join(this.env.options.appPath, 'js', 'tpls/loading.html'));
  this.template('app/alert.html', path.join(this.env.options.appPath, 'js', 'tpls/alert.html'));
  this.template('app/info.html', path.join(this.env.options.appPath, 'js', 'tpls/info.html'));
};

Generator.prototype.baseModel = function baseModel() {
  this.ensureAppDir('js/models');
  this.template('app/baseModel.js', path.join(this.env.options.appPath, 'js', 'models/base.js'));
};

Generator.prototype.baseCollection = function baseCollection() {
  this.ensureAppDir('js/collections');
  this.template('app/baseCollection.js', path.join(this.env.options.appPath, 'js', 'collections/base.js'));
};

Generator.prototype.vent = function vent() {
  this.ensureAppDir('js/helpers');
  this.template('app/vent.js', path.join(this.env.options.appPath, 'js', 'helpers/vent.js'));
};

Generator.prototype.appBase = function appBase() {
  this.template('app/appBase.js', path.join(this.env.options.appPath, 'js', 'app.js'));
};

Generator.prototype.appRouter = function appRouter() {
  this.ensureAppDir('js/routers');
  this.template('app/appRouter.js', path.join(this.env.options.appPath, 'js', 'routers/app.js'));
};

Generator.prototype.appView = function appView() {
  this.ensureAppDir('js/views');
  this.template('app/appView.js', path.join(this.env.options.appPath, 'js', 'views/app.js'));
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
  this.template('main.css', this.env.options.appPath + '/css/main.css');
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

Generator.prototype.setupEnv = function setupEnv() {
  this.mkdir(this.env.options.appPath);
  this.mkdir(this.env.options.appPath + '/js');
  this.mkdir(this.env.options.appPath + '/vendor');
  this.mkdir(this.env.options.appPath + '/css');
  this.mkdir(this.env.options.appPath + '/less');
  this.mkdir(this.env.options.appPath + '/img');
  this.write(this.env.options.appPath + '/index.html', this.indexFile);
};

Generator.prototype.createRequireJsAppFile = function createRequireJsAppFile() {
    if (!this.includeRequireJS) {
      return;
    }
    this.template('requirejs_app.js', this.env.options.appPath + '/js/main.js');
};

Generator.prototype.h5bp = function h5bp() {
  this.copy('app/404.html', this.env.options.appPath + '/404.html');
  this.copy('app/favicon.ico', this.env.options.appPath + '/favicon.ico');
  this.copy('app/robots.txt', this.env.options.appPath + '/robots.txt');
  this.copy('app/htaccess', this.env.options.appPath + '/.htaccess');
};
