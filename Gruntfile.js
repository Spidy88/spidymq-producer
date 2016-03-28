"use strict";

module.exports = function(grunt) {
    grunt.registerTask('default', ['development', 'concurrent:dev']);
    grunt.registerTask('development', ['clean', 'copy', 'build.js.dev', 'build.css.dev']);
    grunt.registerTask('production', ['clean', 'copy', 'build.js.prod', 'build.css.prod', 'minify']);
    grunt.registerTask('build.js.dev', ['browserify', 'bower_concat:dev']);
    grunt.registerTask('build.js.prod', ['browserify', 'bower_concat:dev']);
    grunt.registerTask('build.css.dev', ['sass:dev', 'autoprefixer']);
    grunt.registerTask('build.css.prod', ['sass:prod', 'autoprefixer']);
    grunt.registerTask('minify', ['uglify', 'cssmin']);
    grunt.registerTask('test', ['jshint', 'mochaTest']);

    grunt.initConfig({
        browserify: {
            prod: {
                files: {
                    './webapp.build/js/producer.js': ['./client/js/producer.js']
                }
            }
        },

        sass: {
            prod: {
                options: {
                    style: 'compressed'
                },
                files: {
                    './webapp.build/css/producer.css': ['./client/sass/producer.scss']
                }
            },

            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    './webapp.build/css/producer.css': ['./client/sass/producer.scss']
                }
            }
        },

        autoprefixer: {
            prod: {
                files: {
                    './webapp.build/css/producer.css': './webapp.build/css/producer.css'
                }
            }
        },

        uglify: {
            prod: {
                options: {
                    report: 'gzip',
                    sourceMap: true
                },
                files: {
                    './webapp.build/js/producer.min.js': ['./webapp.build/js/producer.js']
                }
            }
        },

        cssmin: {
            prod: {
                options: {
                    report: 'gzip',
                    sourceMap: true
                },
                files: {
                    './webapp.build/css/producer.min.css': ['./webapp.build/css/producer.css']
                }
            }
        },

        clean: ['./webapp.build'],

        bower_concat: {
            // TODO: Fix concatenation of minified files
            prod: {
                dest: {
                    js: './webapp.build/js/vendors.min.js',
                    css: './webapp.build/css/vendors.min.css'
                },
                exclude: [
                    'jquery'
                ],
                mainFiles: {
                    'angular': 'angular.min.js',
                    'bootstrap': 'dist/css/bootstrap.min.css'
                }
            },

            dev: {
                dest: {
                    js: './webapp.build/js/vendors.js',
                    css: './webapp.build/css/vendors.css'
                },
                exclude: [
                    'jquery'
                ],
                mainFiles: {
                    'angular': 'angular.js',
                    'bootstrap': 'dist/css/bootstrap.css'
                }
            }
        },

        // TODO: Make replace a feature and not a fix-hack
        copy: {
            jsTemplates: {
                expand: true,
                src: './client/js/**/*.html',
                dest: './webapp.build/templates/',
                rename: function(dest, src) {
                    console.log('src: ', src);
                    console.log('dest: ', dest);
                    return dest + src.replace('./client/js', '.');
                }
            },

            public: {
                expand: true,
                src: './client/static/**',
                dest: './webapp.build/',
                rename: function(dest, src) {
                    return dest + src.replace('./client/static', '.');
                }
            },

            fonts: {
                expand: true,
                src: './client/vendor/bootstrap/dist/fonts/*',
                dest: './webapp.build/fonts/',
                rename: function(dest, src) {
                    return dest + src.replace('./client/vendor/bootstrap/dist/fonts', '.');
                }
            },

            maps: {
                files: {
                    './webapp.build/css/bootstrap.css.map': './client/vendor/bootstrap/dist/css/bootstrap.css.map',
                    './webapp.build/js/angular.min.js.map': './client/vendor/angular/angular.min.js.map',
                    './webapp.build/js/socket.min.js.map': './client/vendor/angular-socket-io/socket.min.js.map'
                }
            }
        },

        watch: {
            js: {
                files: [ './client/js/**/*.js' ],
                tasks: [ 'build.js.dev' ]
            },

            sass: {
                files: [ './client/sass/**/*.scss' ],
                tasks: [ 'build.css.dev' ]
            },

            templates: {
                files: [ './client/js/**/*.html' ],
                tasks: [ 'copy:jsTemplates' ]
            },

            static: {
                files: [ './client/static/**/*.*' ],
                tasks: [ 'copy:public' ]
            },

            vendor: {
                files: [ './client/vendor/**/*.*' ],
                tasks: [ 'bower_concat:dev' ]
            }
        },

        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    nodeArgs: [ '--harmony' ],
                    ext: 'js,ejs,html,css',
                    watch: [ 'index.js', 'config', 'server', 'worker', 'webapp.build' ],
                    delay: 2500
                }
            }
        },

        concurrent: {
            dev: {
                tasks: [ 'watch', 'nodemon' ],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        mochaTest: {
            test: {
                src: ['test/**/*.js'],
                options: {
                    reporter: 'list'
                }
            }
        },

        // TODO: Add jscs for code style validation. JSHint will no longer support this need.
        jshint: {
            all: [
                'Gruntfile.js',
                'index.js',
                'client/js/**/*.js',
                'server/**/*.js',
                'config/**/*.js',
                'worker/**/*.js'
            ],
            options: {
                esversion: 6,
                curly: true,
                eqeqeq: true,
                expr: true,
                strict: true,
                undef: true,
                mocha: true,
                node: true,
                predef: ['angular'],
                validthis: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');
};