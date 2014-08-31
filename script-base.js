'use strict';
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var backboneUtils = require('./util.js');

var ScriptBase = yeoman.generators.NamedBase.extend({

  constructor: function (name) {
    yeoman.generators.NamedBase.apply(this, arguments);

    // Get name of application, we use this as the namespace for the
    // modules we create.
    this.appname = this.config.get('appName') || path.basename(process.cwd());

    // Set needed paths
    this.env.options.appPath = this.config.get('appPath') || 'src/public';
    this.env.options.serverPath = this.config.get('serverPath') || 'src/server';
    this.env.options.testPath = this.config.get('testPath') || 'test/public';
    this.env.options.projectRoot = __dirname;

    // check if --requirejs option provided or if require is setup
    if (typeof this.env.options.requirejs === 'undefined') {
      this.option('requirejs');
      this.options.requirejs = true; // always force requirejs

      this.env.options.requirejs = this.options.requirejs;
    }

    this.setupSourceRootAndSuffix();

    this._.mixin({ 'classify': backboneUtils.classify });  
  },
  /*
   * Check whether the App is a RequireJS app or not
   *
   * @return boolean
   */
  checkIfUsingRequireJS: function () {
    if (typeof this.env.options.requirejs !== 'undefined') {
      return this.env.options.requirejs;
    }

    var ext = '.js';
    var filepath = path.join(process.cwd(), this.env.options.appPath + '/js/main' + ext);

    try {
      this.env.options.requirejs = (/require\.config/).test(this.read(filepath));
      return this.env.options.requirejs;
    } catch (e) {
      return false;
    }
  },

  /*
   * Get the template library framework for the project
   * @return string
   */
  getTemplateFramework: function () {
    if (!(require('fs').existsSync(path.join(process.cwd(), 'Gruntfile.js')))) {
      return 'lodash';
    }
    var ftest = (/templateFramework: '([^\']*)'/);
    var match = ftest.exec(this.read(path.join(process.cwd(), 'Gruntfile.js')));
    if (match) {
      return match[1];
    } else {
      return 'lodash';
    }
  },

  /*
   * Set the root folder to find templates to generate code from. Also set script suffix for generated files.
   * @return string
   */
  setupSourceRootAndSuffix: function () {
    var sourceRoot = '/templates/requirejs';
    this.scriptSuffix = '.js';
    this.sourceRoot(path.join(__dirname, sourceRoot));
  },

  /*
   * Writes a new file using a template
   * @return null
   */
  writeTemplate: function (source, destination, data) {
    var ext = this.scriptSuffix;
    this.template(source + ext, destination + ext, data);
  },

  /*
   * Create tests scafolding?
   * @return boolean
   */
  generateTests: function () {
    return this.config.get('testFramework') === 'mocha';
  },

  /*
   * Ensure directory exists in the main app path.
   * @param String dir the directory to check existence for and to create if it doesn't exist
   * @return boolean
   */
  ensureAppDir: function (dir) {
    var pathToCreate = path.join(this.env.options.appPath, dir);

    // Create directory if it is not there
    if (!fs.existsSync(pathToCreate)) {
      this.log.create(pathToCreate);
      this.mkdir(pathToCreate);
    }
  },

  writeTest: function (options) {
    this.setupSourceRootAndSuffix();

    var ext = this.scriptSuffix;
    this.template('testSpec' + ext, path.join(options.testPath, 'spec', options.path, options.name + options.type + '.spec' + ext), 
      {name: this.name, src: options.moduleSrc, type: options.type}
    );
  }

});

module.exports = ScriptBase;