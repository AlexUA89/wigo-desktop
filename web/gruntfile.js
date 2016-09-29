module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'node_modules/vue/dist/', src: 'vue.min.js', dest: 'static/'},
                    {expand: true, cwd: 'node_modules/gmaps/', src: 'gmaps.min.js', dest: 'static/'},
                    {expand: true, cwd: 'node_modules/vue-resource/dist/', src: 'vue-resource.min.js', dest: 'static/'},
                    {expand: true, cwd: 'src/js/', src: '*', dest: 'static/src/js/'},
                    {expand: true, cwd: 'images/', src: '*', dest: 'static/images/'}
                ]
            }
        },
        connect: {
            main: {
                options: {
                    port: 1337,
                    base: '',
                    livereload: true
                }
            }
        },
        watch: {
            main: {
                files: ['src/js/*.js'],
                tasks: ['copy'],
                options: {
                    spawn: false,
                }
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['copy', 'connect', 'watch']);

};