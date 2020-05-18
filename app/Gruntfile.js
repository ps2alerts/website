module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        uglify: {
            jsDeps: {
                options: {
                    beautify: true,
                    mangle: false
                },
                files: {
                    'public/assets/js/deps.js': [
                        'public/bower_components/jquery/dist/jquery.min.js',
                        'public/bower_components/angular/angular.min.js',
                        'public/bower_components/angular-cookies/angular-cookies.min.js',
                        'public/bower_components/angular-route/angular-route.min.js',
                        'public/bower_components/jquery.countdown/dist/jquery.countdown.min.js',
                        'public/assets/js/jsloader.js',
                        'public/bower_components/lodash/dist/lodash.min.js',
                        'public/bower_components/datatables.net/js/jquery.dataTables.min.js',
                        'public/bower_components/highcharts/highstock.js'
                    ]
                }
            },
            jsApp: {
                options: {
                    beautify: true,
                    mangle: false
                },
                files: {
                    'public/assets/js/main.js': [
                        'public/config.js',
                        'public/app.js',
                        'public/controllers/**/*.js',
                        'public/directives/**/*.js',
                        'public/services/**/*.js',
                        'public/assets/js/change-log.js',
                    ]
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'public/assets/css/main.css': [
                        'public/bower_components/SpinKit/css/spinners/7-three-bounce.css',
                        'public/bower_components/datatables.net-dt/css/jquery.dataTables.css',
                        'public/assets/css/compiled/main.css'
                    ]
                }
            }
        },
        less: {
            development: {
                files: {
                    'public/assets/css/compiled/main.css': 'public/assets/less/main.less'
                }
            }
        },
        watch: {
            less: {
                files: ['public/assets/less/**/*.less'],
                tasks: ['css'],
                options: {
                    nospawn: true,
                    atBegin: true
                }
            },
            scripts: {
                files: [
                    'public/app.js',
                    'public/controllers/**/*.js',
                    'public/directives/**/*.js',
                    'public/services/**/*.js',
                    'public/assets/js/change-log.js'
                ],
                tasks: ['jsApp'],
                options: {
                    atBegin: true
                }
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n{%= __ngModule %}',
                name: 'config',
            },
            // Environment targets
            development: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'development',
                        baseUrl: 'http://dev.ps2alerts.com',
                        apiUrl: 'http://dev.api.ps2alerts.com/v2',
                        websocketUrl: 'ws://127.0.0.1:1337?apikey=FOOBAR'
                        //websocketUrl: 'ws.ps2alerts.com:1337?apikey=FOOBAR'
                    }
                }
            },
            staging: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'staging',
                        baseUrl: 'https://staging.ps2alerts.com',
                        apiUrl: 'https://staging.api.ps2alerts.com/v2',
                        websocketUrl: 'wss://ws.ps2alerts.com:1337?apikey=FOOBAR'
                    }
                }
            },
            production: {
                options: {
                    dest: 'public/config.js'
                },
                constants: {
                    ENV: {
                        environment: 'production',
                        baseUrl: 'https://www.ps2alerts.com',
                        apiUrl: 'https://api.ps2alerts.com/v2',
                        websocketUrl: 'wss://ws.ps2alerts.com:1337?apikey=FOOBAR'
                    }
                }
            },
        },
    });

    grunt.loadNpmTasks('grunt-ng-constant');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['css', 'js']);
    grunt.registerTask('envDev', ['ngconstant:development', 'jsApp']);
    grunt.registerTask('envStaging', ['ngconstant:staging']); // no jsApp as it's rare it to change
    grunt.registerTask('envProduction', ['ngconstant:production']);
    grunt.registerTask('css', ['less', 'cssmin']);
    grunt.registerTask('js', ['uglify:jsDeps', 'uglify:jsApp']);
    grunt.registerTask('jsApp', ['uglify:jsApp']);
    grunt.registerTask('jsDeps', ['uglify:jsDeps']);
};
