/**
 * 压缩 css js
 * 陆议
 */
"use strict";
module.exports = function (grunt) {
    var destDir = 'build/app/';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: destDir
            },
            options: {
                force: true
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true, 
                        cwd: 'assets/', 
                        src: ['**'], 
                        dest: 'build/assets/'
                    },
                    {
                        expand: true, 
                        cwd: 'app/', 
                        src: ['**'], 
                        dest: 'build/app/'
                    },                   
                    {
                        expand: true, 
                        cwd: 'boot/', 
                        src: ['**'], 
                        dest: 'build/boot/'
                    }
                ]
            }
        },
        combine: {
            build: {
                src: destDir
            }
        },
        minify: {
            build: {
                src: destDir,
                isBeautify: true
            }
        },
        concat: {
            dist: {
                src: [
                    'build/assets/css/global.css', 
                    'build/assets/css/manage.css'
                ],
                dest: 'build/assets/css/union.css'
            }
        },
        cssmin: {
            css: {
                expand: true,
                cwd: 'build/assets/',
                src: ['**/*.css','!**/*-min.css'],
                dest: 'build/assets/',
                ext: '-min.css'
            }
        },      
        template: {
            dev: {
                src: 'myunion.mustache',
                dest: 'myunion_debug_local.htm',
                variables: {
                    DEBUG: true,
                    TBCDN: 'http://isv.aitaobao.net/'
                }
            },
            pub: {
                src: 'myunion.mustache',
                dest: 'myunion.htm',
                variables: {
                    DEBUG: false,
                    TBCDN: 'http://g.tbcdn.cn/mm/aiisv/0.0.1/'
                }
            },
            pub_debug: {
                src: 'myunion.mustache',
                dest: 'myunion_debug.htm',
                variables: {
                    DEBUG: true,
                    TBCDN: 'http://g.tbcdn.cn/mm/aiisv/0.0.1/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-templater');
    grunt.loadTasks('tasks');

    // Build task 发布
    grunt.registerTask('build', [
        'copy',
        'combine',
        'minify',
        'concat',
        'cssmin',
        'template'
    ]);
};