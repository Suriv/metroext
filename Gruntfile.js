'use strict';
const sass = require('sass');

module.exports = grunt => {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webContent: 'docs',
        sass: {
            options: {
                 implementation: sass,
                 outputStyle: 'compressed'

             },
             sourceMapSimple: {
                 options: {
                     sourceMap: false
                 }
             },
             compile: {
                 files: {
                    '<%= webContent %>/css/mext.css': 'src/sass/mext.scss',
                }
             },
        },
         uglify: {
            srcjs: {
                files: [
                  {expand: true, cwd: 'src/js/core', src: '**.js', dest: '<%= webContent %>/js/'},
                ]
            }
          },
          connect: {
            server: {
              options: {
                hostname: '*',
                livereload: true,
                open: {
                    target: 'http://127.0.0.1:8000'
                },
                port: 8000,
                useAvailablePort: true,
                base: '<%= webContent %>',
              }
            }
          },
          copy: {
            libassets:{
                files: [{expand: true, cwd: 'src/assets', src: '**/*', dest: '<%= webContent %>/assets'}]
            },
            htmlComponent:{
               files: [{expand: true, cwd: 'src/html', src: '**/*', dest: '<%= webContent %>/'}]
            },
            jsLib:{
              files: [{expand: true, cwd: 'src/js/lib', src: '**/*', dest: '<%= webContent %>/js/'}]
           },
            txtComponent:{
              files: [{expand: true, cwd: 'src/txt', src: '**/*', dest: '<%= webContent %>/'}]
           },
            json:{
              files: [{expand: true, cwd: 'src/json', src: '**/*', dest: '<%= webContent %>/json'}]
           },
          },
          clean: {
            options: {force:true},
            folderJsCore:{
              src:['<%= webContent %>/js/core/*']
            },
            folderJsLib:{
              src:['<%= webContent %>/js/lib/*']
            },
            folderJson:{
              src:['<%= webContent %>/json/*']
            },
            folderAssets:{
              src:['<%= webContent %>/assets/*']
            },
            folderhtm:{
              src:['<%= webContent %>/*.html']
            },
            foldertxt:{
              src:['<%= webContent %>/*.txt']
            },
        },

        watch: {
           
            gruntfile: {files: ['Gruntfile.js'], tasks: ['default']},
            sass: { files: ["src/sass/**/*.scss"], tasks: ["sass"] },
            jsCore: {files: ['src/js/core/**.js'], tasks: ['clean:folderJsCore','uglify:srcjs']},
            jsLib: {files: ['src/js/lib/**.js'], tasks: ['clean:folderJsLib','copy::jsLib']},
            libassets: {files: ['src/assets/**/*'], tasks: ['clean:folderAssets','copy:libassets']},
            htmlComponent: {files: ['src/html/**'], tasks: ['clean:folderhtm','copy:htmlComponent']},
            txtComponent: {files: ['src/txt/**'], tasks: ['clean:foldertxt','copy:txtComponent']},
            jsonFolder: {files: ['src/json/**'], tasks: ['clean:folderJson','copy:json']},
             options: {
              livereload: true,
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', ['sass', 'uglify']);

    grunt.registerTask('monitor', ['clean','connect','sass','uglify', 'copy','watch']);

  };
