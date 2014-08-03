# Backbone Require, Bootstrap web app generator

[Yeoman](http://yeoman.io) generator that scaffolds out a Backbone, Require, Bootstrap web app.

## Features

* Built-in preview server with LiveReload
* Automagically compile LESS
* Automagically lint your scripts
* Automagically wire up your Bower components with [grunt-bower-require](#third-party-dependencies).
* Awesome Image Optimization (via OptiPNG, pngquant, jpegtran and gifsicle)
* Mocha Unit Testing with PhantomJS
* Bootstrap for Sass (Optional)
* Leaner Modernizr builds (Optional)

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

To manually add dependencies, `bower install --save depName` to get the files, then add a the reference to the requirejs config file **public/js/main.js**

The components are installed at `/src/public/vendor`.

*Testing Note*: a project checked into source control and later checked out needs to have `bower install` run from the `test` folder as well as from the project root.

## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework=<framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)