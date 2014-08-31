var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

// Used to exclude any test files caught in the vendor directory
var VENDOR_REGEXP = /base\/src\/public\/vendor.*/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '../../../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file) && !VENDOR_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/src/public/js',

  // Shortcuts
  paths: {
    jquery: '../vendor/jquery/dist/jquery',
    backbone: '../vendor/backbone/backbone',
    backbonePkg: 'helpers/backbonePkg',
    rivets: '../vendor/rivets/dist/rivets',
    tpl: '../vendor/requirejs-tpl/tpl',
    underscore: '../vendor/underscore/underscore',
    bootstrap: '../vendor/bootstrap/dist/js/bootstrap',
    uberbackbone: '../vendor/uberbackbone/uberbackbone'
  },

  // dynamically load all test files
  deps: allTestFiles,
  
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
