'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: '<%= templateFramework %>'

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // configurable paths
    var yeomanConfig = {
        app: '<%= env.options.appPath %>',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },<% if (compassBootstrap) { %>
            compass: {
                files: ['<%%= yeoman.app %>/sass/{,*/}*.{scss,sass}'],
                tasks: ['compass']
            },<% } else { %>
            less: {
                files: ['<%%= yeoman.app %>/less/{,*/}*.{less}'],
                tasks: ['less']
            },<% } %>
            livereload: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%%= yeoman.app %>/*.html',
                    '{.tmp,<%%= yeoman.app %>}/css/{,*/}*.css',
                    '{.tmp,<%%= yeoman.app %>}/js/{,*/}*.{js,html,tpl,mustache,hbs}',
                    '{.tmp,<%%= yeoman.app %>}/vendor/{,*/}*.js',
                    '<%%= yeoman.app %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    'test/spec/**/*.js'
                ]
            },
            test: {
                files: ['<%%= yeoman.app %>/js/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%%= connect.options.port %>'
            },
            test: {
                path: 'http://localhost:<%%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/js/{,*/}*.js',
                '!<%%= yeoman.app %>/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        }<% if (testFramework === 'mocha') { %>,
        mocha: {
            all: {
                options: {
                    run: true,
                    src: ['http://localhost:<%%= connect.test.options.port %>/index.html']
                }
            }
        }<% } else { %>,
        jasmine: {
            all:{
                src : '<%= yeoman.app %>/scripts/{,*/}*.js',
                options: {
                    keepRunner: true,
                    specs : 'test/spec/**/*.js',
                    vendor : [
                        '<%%= yeoman.app %>/bower_components/jquery/dist/jquery.js',
                        '<%%= yeoman.app %>/bower_components/underscore/underscore.js',
                        '<%%= yeoman.app %>/bower_components/backbone/backbone.js',
                        '.tmp/scripts/templates.js'
                    ]
                }
            }
        }<% } %>,<% if (compassBootstrap) { %>
        compass: {
            options: {
                sassDir: '<%%= yeoman.app %>/sass',
                cssDir: '.tmp/styles',
                imagesDir: '<%%= yeoman.app %>/img',
                javascriptsDir: '<%%= yeoman.app %>/js',
                fontsDir: '<%%= yeoman.app %>/css/fonts',
                importPath: '<%%= yeoman.app %>/vendor',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },<% } %>
        less: {
            development: {
                files: {
                    '<%%= yeoman.app %>/css/main.css': '<%%= yeoman.app %>/less/main.less'
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%%= yeoman.app %>/js',
                    optimize: 'none',
                    wrapShim: true,
                    paths: {
                        'jquery': '../../<%%= yeoman.app %>/vendor/jquery/dist/jquery',
                        'underscore': '../../<%%= yeoman.app %>/vendor/underscore/underscore',
                        'backbone': '../../<%%= yeoman.app %>/vendor/backbone/backbone'
                    },
                    // TODO: Figure out how to make sourcemaps work with grunt-usemin
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true<% if (templateFramework !== 'handlebars') { %>,
                    wrap: true<% } %>
                }
            }
        },
        useminPrepare: {
            html: '<%%= yeoman.app %>/index.html',
            options: {
                dest: '<%%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%%= yeoman.dist %>/css/{,*/}*.css'],
            options: {
                dirs: ['<%%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%%= yeoman.dist %>/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/css/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%%= yeoman.app %>/css/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= yeoman.app %>',
                    dest: '<%%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'img/{,*/}*.{webp,gif}',
                        'css/fonts/{,*/}*.*',<% if (compassBootstrap) { %>
                        'vendor/sass-bootstrap/fonts/*.*'<% } else { %>
                        'vendor/bootstrap/fonts/*.*'<% } %>
                    ]
                }]
            }
        },
        bower: {
            all: {
                rjsConfig: '<%%= yeoman.app %>/js/main.js'
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%%= yeoman.dist %>/js/{,*/}*.js',
                        '<%%= yeoman.dist %>/css/{,*/}*.css',
                        '<%%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/css/fonts/{,*/}*.*',<% if (compassBootstrap) { %>
                        'vendor/sass-bootstrap/fonts/*.*'<% } %>
                    ]
                }
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'clean:server',<% if (compassBootstrap) { %>
                'compass:server',<% } %>
                'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',<% if (compassBootstrap) { %>
            'compass:server',<% } %>
            'connect:livereload',
            'open:server',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',<% if (compassBootstrap) { %>
                'compass',<% } %><% if(testFramework === 'mocha') { %>
                'connect:test',
                'mocha',<% } else { %>
                'jasmine'<% } %>
            ];

        if(!isConnected) {
            return grunt.task.run(testTasks);
        } else {
            // already connected so not going to connect again, remove the connect:test task
            testTasks.splice(testTasks.indexOf('connect:test'), 1);
            return grunt.task.run(testTasks);
        }
    });

    grunt.registerTask('build', [
        'clean:dist',<% if (compassBootstrap) { %>
        'compass:dist',<% } %>
        'useminPrepare',
        'requirejs',
        'less',
        'imagemin',
        'htmlmin',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'rev',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
