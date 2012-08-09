module.exports = function (grunt) {

    grunt.initConfig({
        less : {
            all : {
                src : "assets/less/main.less",
                dest : "assets/less/main.css"
            },
            firefox : {
                src : "assets/less/main-firefox.less",
                dest : "assets/less/main-firefox.css"
            }
        },
        watch : {
            files : 'assets/less/*.less',
            tasks : 'less'
        }
    });

    grunt.loadNpmTasks('grunt-less');

    grunt.registerTask('default', 'less');
};
