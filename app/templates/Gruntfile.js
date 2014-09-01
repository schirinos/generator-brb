'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // Automatically load all grunt tasks by reading from package.json
    require('load-grunt-tasks')(grunt);

    // Configurable paths
    var appConfig = {
        pub: '<%= env.options.appPath %>'<% if (useServer) { %>,
        server: '<%= env.options.serverPath %>'<% } %>,
        dist: 'dist'
    };

    grunt.initConfig({
        appConfig: appConfig,
        watch: {
            // Default options for all watch tasks
            options: {
                nospawn: true,
                livereload: true
            },
            // Prevent livereload when compiling less, so that we don't force a browser refresh
            less: {
                options: {
                    livereload: false
                },
                files: ['<%%= appConfig.pub %>/less/{,*/}*.less'],
                tasks: ['less']
            },
            css: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: ['{.tmp,<%%= appConfig.pub %>}/css/{,*/}*.css']
            },
            frontend: {
                options: {
                    livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
                },
                files: [
                    '<%%= appConfig.pub %>/*.html',
                    '{.tmp,<%%= appConfig.pub %>}/js/{,*/}*.{js,html,tpl,mustache,hbs}',
                    '{.tmp,<%%= appConfig.pub %>}/vendor/{,*/}*.js',
                    '<%%= appConfig.pub %>/img/{,*/}*.{png,jpg,jpeg,gif,webp}',
                    'test/spec/**/*.js'
                ]
            }<% if (useServer) { %>,
            // For the express server reload we don't need to livereload the page
            // since the express server serves the backend api
            express: {
                options: {
                    nospawn: true,
                    atBegin: true,
                    livereload: false
                },
                files: ['<%%= appConfig.server %>/{,*/}*.js'],
                tasks:  ['express:dev']
            }<% } %>,
            test: {
                files: ['<%%= appConfig.server %>/{,*/}*.js', '<%%= appConfig.pub %>/js/{,*/}*.js', 'test/spec/**/*.js'],
                tasks: ['test:true']
            }
        }<% if (useServer) { %>,
        // Load the express server to provide api access
        // server also handles static files
        express: {
            options: {
                background: true,
                port: 3000
            },
            dev: {
                options: {
                    script: '<%%= appConfig.server %>/server.js',
                    node_env: 'development'
                }
            },
            dist: {
                options: {
                    background: false,
                    script: '<%%= appConfig.dist %>/server/server.js',
                    node_env: 'development'
                }
            }
        }<% } %>,
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
                            mountFolder(connect, appConfig.pub)
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
                            mountFolder(connect, appConfig.pub)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, appConfig.dist + '/public')
                        ];
                    }
                }
            }
        },
        open: {
            <% if (useServer) { %>
            server: {
                path: 'http://localhost:<%%= express.options.port %>',
                options: {
                    delay: 1000
                }
            }<%} else {%>
            server: {
                path: 'http://localhost:<%%= connect.options.port %>',
                options: {
                    delay: 1000
                }
            }
            <%}%>,
            test: {
                path: 'http://localhost:<%%= connect.test.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%%= appConfig.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%%= appConfig.pub %>/js/{,*/}*.js',
                '!<%%= appConfig.pub %>/vendor/*',
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
                src : '<%%= appConfig.pub %>/scripts/{,*/}*.js',
                options: {
                    keepRunner: true,
                    specs : 'test/spec/**/*.js',
                    vendor : [
                        '<%%= appConfig.pub %>/bower_components/jquery/dist/jquery.js',
                        '<%%= appConfig.pub %>/bower_components/underscore/underscore.js',
                        '<%%= appConfig.pub %>/bower_components/backbone/backbone.js',
                        '.tmp/scripts/templates.js'
                    ]
                }
            }
        }<% } %>,<% if (compassBootstrap) { %>
        compass: {
            options: {
                sassDir: '<%%=appConfig.pub %>/sass',
                cssDir: '.tmp/styles',
                imagesDir: '<%%=appConfig.pub %>/img',
                javascriptsDir: '<%%=appConfig.pub %>/js',
                fontsDir: '<%%=appConfig.pub %>/css/fonts',
                importPath: '<%%=appConfig.pub %>/vendor',
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
                    '<%%= appConfig.pub %>/css/main.css': '<%%= appConfig.pub %>/less/main.less'
                }
            }
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    almond: true,
                    // replace require script calls, with the almond modules
                    // in the following files
                    replaceRequireScript: [{
                        files: ['<%%= appConfig.dist %>/public/index.html'],
                        module: 'main'
                    }],
                    baseUrl: '<%%= appConfig.pub %>/js',
                    mainConfigFile: "<%%= appConfig.pub %>/js/main.js",
                    include: ["main"],
                    out: "<%%= appConfig.dist %>/public/js/main.js",
                    // Modify some modules as we optimize them
                    onBuildWrite   : function( name, path, contents ) {
                        // Backbone.NestedModel needs to be upgraded to an AMD
                        // module since by default it looks for Backbone as a global.
                        // An optimized build will fail since the global isn't created until
                        // the dependency is needed by a module
                        if (name === 'backboneNestedModel') {
                            return "define('"+name+"', ['backbone'],function(Backbone){"+contents+"})";
                        } else {
                            // Return module unmodifed
                            return contents;
                        }
                    },
                    preserveLicenseComments: false,
                    useStrict: false,
                    wrap: true
                }
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= appConfig.pub %>/img',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%%= appConfig.dist %>/public/img'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%%= appConfig.dist %>/public/css/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%%= appConfig.pub %>/css/{,*/}*.css'
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
                    cwd: '<%%= appConfig.pub %>',
                    src: '*.html',
                    dest: '<%%= appConfig.dist %>/public/'
                }]
            }
        },
        // Copies additional files to distrubution folder (other than .html and css files)
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%%= appConfig.pub %>',
                    dest: '<%%= appConfig.dist %>/public',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'img/{,*/}*.{webp,gif}',
                        'vendor/sp-bootstrap/fonts/*.*'
                    ]
                }<% if (useServer) { %>,{
                    expand: true,
                    dot: true,
                    cwd: '<%%= appConfig.server %>',
                    dest: '<%%= appConfig.dist %>/server',
                    src: [
                        '*'
                    ]
                }<%}%>]
            }
        },
        bower: {
            app: {
                rjsConfig: '<%%= appConfig.pub %>/js/main.js'
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            <% if (useServer) { %>
                return grunt.task.run(['build', 'open:server', 'express:dist']);
            <%} else {%>
                return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
            <%}%>
        }

        <% if (useServer) { %>
            if (target === 'test') {
                return grunt.task.run([
                    'clean:server',
                    'connect:test',
                    'open:test',
                    'watch'
                ]);
            }
        <%} else {%>
            if (target === 'test') {
                return grunt.task.run([
                    'clean:server',<% if (compassBootstrap) { %>
                    'compass:server',<% } %>
                    'connect:test',
                    'open:test',
                    'watch'
                ]);
            }
        <%}%>

        <% if (useServer) { %>
            grunt.task.run([
                'clean:server',
                'open:server',
                'watch'
            ]);
        <%} else {%>
            grunt.task.run([
                'clean:server',<% if (compassBootstrap) { %>
                'compass:server',<% } %>
                'connect:livereload',
                'open:server',
                'watch'
            ]);
        <%}%>
    });

    grunt.registerTask('test', function (isConnected) {
        isConnected = Boolean(isConnected);
        var testTasks = [
                'clean:server',
                'connect:test',
                'mocha',
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
        'htmlmin',
        'requirejs',
        'less',
        'imagemin',
        'cssmin',
        'copy'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
