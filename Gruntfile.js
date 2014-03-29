module.exports = function(grunt) {

    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        banner : '/*!\n' + 
                ' * <%= pkg.name %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version 1.0.0\n' +
                ' */\n',
        jshint : {
            options : {
                jshintrc: '.jshintrc'
            },
            src: ['Gruntfile.js', 'src/**/*.js'],
        },
        concat: {
            js: {
                src: ['src/**/*.js'],
                dest: 'release/<%= pkg.name %>.js'
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'release/<%= pkg.name %>.css'
            }
        },
        uglify: {
            build: {
                src: ['release/<%=pkg.name %>.js'],
                dest: 'release/<%= pkg.name %>.min.js'
            }               
        },
        // watch: {
        //     script : {
        //         src: ['src/**/*.js'],
        //         tasks: ['jshint', 'uglify']
        //     }
        // },
        watch: {

        },
        connect: {
            server: {
                options: {
                    hostname: '*',//设置所有的host都能访问
                    port: 1234
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //默认connect随着grunt结束，watch需要手动终止，将connect放在watch之前 ,可以使connect一直运行
    grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'connect', 'watch']);
    grunt.registerTask('debug', ['jshint', 'connect' ,'watch']);

};
