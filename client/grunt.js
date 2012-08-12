module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-less');
    grunt.loadNpmTasks('grunt-coffee');

    grunt.initConfig({
        less:{
            all:{
                src:"assets/less/main.less",
                dest:"assets/less/main.css"
            },
            firefox:{
                src:"assets/less/main-firefox.less",
                dest:"assets/less/main-firefox.css"
            }
        },
        coffee : {
            app : {
                src : 'src-coffee/*',
                dest : 'src-coffee/js'
            }
        },
        watch:{
            less:{
                files:'assets/less/*.less',
                tasks:'less'
            },
            coffee : {
                files : '<config:coffee.app.src>',
                tasks : 'coffee'
            }
        }
    });

    grunt.registerTask('default', 'less');
};
