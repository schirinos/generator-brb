'use strict';
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');
var backboneUtils = require('../util.js');
var exec = require('child_process').exec;

var BrbGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
  
    // Get name of application, we use this as the namespace for the
    // modules we create.
    this.argument('appname', { type: String, required: false });
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = backboneUtils.classify(this.appname);

    // Set paths for the app
    this.env.options.appPath = this.options.appPath || 'src/public';
    this.config.set('appPath', this.env.options.appPath);
    this.env.options.serverPath = this.options.serverPath || 'src/server';
    this.config.set('serverPath', this.env.options.serverPath);
    this.env.options.testPath = this.options.testPath || 'test/public';
    this.config.set('testPath', this.env.options.testPath);
    this.config.set('projectRoot', path.join(__dirname, '../'));

    // setup the test-framework property, Gruntfile template will need this
    this.testFramework = this.options['test-framework'] || 'mocha';
    this.templateFramework = this.options['template-framework'] || 'lodash';

    this.config.defaults({
      appName: this.appname,
      ui: this.options.ui || 'bdd',
      coffee: this.options.coffee,
      testFramework: this.testFramework,
      templateFramework: this.templateFramework,
      compassBootstrap: this.compassBootstrap,
      includeRequireJS: this.options.requirejs,
      includeVagrant: this.options.vagrant,
      useServer: false
    });

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  },

  // Ask questions
  prompting: function () {
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
      },{
        name: 'nodejs Server',
        value: 'useServer',
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
      this.useServer = hasFeature('useServer');
      this.includeRequireJS = true;

      // Set prompts
      this.config.set('compassBootstrap', this.compassBootstrap);
      this.config.set('vagrant', this.vagrant);
      this.config.set('useServer', this.useServer);
      this.config.set('includeRequireJS', this.includeRequireJS);

      cb();
    }.bind(this));
  },

  // Write Files
  writing: {
    git : function git() {
      this.template('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    vagrant : function vagrant() {
      if (!this.vagrant) {
        return;
      }

      this.template('Vagrantfile', 'Vagrantfile');

      // Add Puppet scaffolding
      this.mkdir('vagrant/puppet/modules');
      this.mkdir('vagrant/puppet/manifests');
      this.template('Puppetfile', 'vagrant/puppet/Puppetfile');

      // Add Chef scaffolding
      this.template('Berksfile', 'vagrant/chef/Berksfile');
    },

    bower : function bower() {
      this.template('bowerrc', '.bowerrc');
      this.copy('_bower.json', 'bower.json');
    },

    jshint : function jshint() {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig : function editorConfig() {
      this.copy('editorconfig', '.editorconfig');
    },

    karmaConfig : function karmaConfig() {
      this.copy('karma.conf.js', 'karma.conf.js');
    },

    testMain : function testMain() {
      this.copy('test-main.js', 'test/test-main.js');
    },

    gruntfile : function gruntfile() {
      this.template('Gruntfile.js');
    },

    packageJSON : function packageJSON() {
      this.template('_package.json', 'package.json');
    },

    backbonePkg : function backbonePkg() {
      this._ensureAppDir('js/helpers');
      this.template('app/backbonePkg.js', path.join(this.env.options.appPath, 'js', 'helpers/backbonePkg.js'));
    },

    vent : function vent() {
      this._ensureAppDir('js/helpers');
      this.template('app/vent.js', path.join(this.env.options.appPath, 'js', 'helpers/vent.js'));
    },

    appRouter : function appRouter() {
      this._ensureAppDir('js/routers');
      this.template('app/appRouter.js', path.join(this.env.options.appPath, 'js', 'routers/app.js'));
    },

    appView : function appView() {
      this._ensureAppDir('js/views');
      this.template('app/appView.js', path.join(this.env.options.appPath, 'js', 'app.js'));
    },

    mainStylesheet : function mainStylesheet() {
      this.template('main.css', this.env.options.appPath + '/css/main.css');
      this.template('main.less', this.env.options.appPath + '/less/main.less');
    },

    writeIndexWithRequirejs : function writeIndexWithRequirejs() {
      if (!this.includeRequireJS) {
        return;
      }
      this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
      this.indexFile = this.engine(this.indexFile, this);

      this.indexFile = this.appendScripts(this.indexFile, 'js/main.js', [
        'vendor/requirejs/require.js'
      ], {'data-main': 'js/main'});
    },

    setupEnv : function setupEnv() {
      this.mkdir(this.env.options.appPath);
      this.mkdir(this.env.options.appPath + '/js');
      this.mkdir(this.env.options.appPath + '/vendor');
      this.mkdir(this.env.options.appPath + '/css');
      this.mkdir(this.env.options.appPath + '/less');
      this.mkdir(this.env.options.appPath + '/img');
      this.write(this.env.options.appPath + '/index.html', this.indexFile);

      if (this.useServer) {
        this.mkdir(this.env.options.serverPath);
        this.template('app/server.js', path.join(this.env.options.serverPath, 'server.js'));
        this.template('app/routes.js', path.join(this.env.options.serverPath, 'routes.js'));
        this.template('app/config.js', path.join(this.env.options.serverPath, 'config.js'));
      }

      // Creating testing directory
      this.mkdir('test/spec');
    },

    createRequireJsAppFile : function createRequireJsAppFile() {
        if (!this.includeRequireJS) {
          return;
        }
        this.template('requirejs_main.js', this.env.options.appPath + '/js/main.js');
    },

    h5bp : function h5bp() {
      this.copy('app/404.html', this.env.options.appPath + '/404.html');
      this.copy('app/favicon.ico', this.env.options.appPath + '/favicon.ico');
      this.copy('app/robots.txt', this.env.options.appPath + '/robots.txt');
      this.copy('app/htaccess', this.env.options.appPath + '/.htaccess');
    }
  },
  /*
   * Ensure directory exists in the main app path.
   * @param String dir the directory to check existence for and to create if it doesn't exist
   * @return boolean
   */
  _ensureAppDir: function (dir) {
    var pathToCreate = path.join(this.env.options.appPath, dir);

    // Create directory if it is not there
    if (!fs.existsSync(pathToCreate)) {
      this.log.create(pathToCreate);
      this.mkdir(pathToCreate);
    }
  },

  // Install files (npm, bower, etc...)
  install: function () {
    if (this.options.namespace === 'brb:app') {
      // Try installing bower and npm dependenceis
      this.installDependencies({ skipInstall: this.options['skip-install'] });
    }
  }

});

module.exports = BrbGenerator;
