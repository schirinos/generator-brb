# Brb (Backbone Require, Bootstrap) web app generator

[Yeoman](http://yeoman.io) generator that scaffolds out a Backbone, RequireJs, Bootstrap web app.

## Features

* Built-in preview server with LiveReload
* Automagically compile LESS
* Automagically lint your scripts
* Automagically wire up your Bower components with [grunt-bower-require](#third-party-dependencies).
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing
* Karma test runner configured for RequireJs
* Bootstrap for Sass (Optional)

For more information on what `generator-brb` can do for you, take a look at the [Grunt tasks](https://github.com/schirinos/generator-brb/blob/master/app/templates/_package.json) used in the `package.json`.


## Getting Started

- Install: Clone repo then npm link it.
- Run: `yo brb`
- Run `grunt` for building and `grunt serve` for preview.

#### Third-Party Dependencies

*(HTML/CSS/JS/Images/etc)*

Third-party dependencies are managed with bower. Add new dependencies using **Bower** and then run the **Grunt** task to load them into
your RequireJs config file:

```sh
$ bower install --save jquery
$ grunt bower
```

This works if the package author has followed the [Bower spec](https://github.com/bower/bower.json-spec). If the files are not automatically added to your source code, check with the package's repo for support and/or file an issue with them to have it updated.

To manually add dependencies, `bower install --save depName` to get the files, then add a the reference to the requirejs config file **src/public/js/main.js**

The components are installed at `/src/public/vendor`.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.

## Sub Generators

These sub-generators will create application objects and generate test stubs.
* brb:controller
* brb:collection
* brb:model
* brb:view
* brb:router

### Sub Generator Options
* `--path`

  Specify the location of where to create the applicaiton object. Use to create logical module groupings for your application objects. 
  ie: put all your collections, models and views for a video in the same folder.

```sh
$ yo brb:model video --path=path/to/dir

```

* `--uber` (on by default)

  Whether to create application objects using [uberbackbone](https://github.com/schirinos/uberbackbone). 
  By default uberbackbone will be used. You can set this option to false, to use plain Backbone objects.

```sh
$ yo brb:model video --uber=false

```

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)