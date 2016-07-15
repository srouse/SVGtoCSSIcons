

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadTasks('../tasks');

    var configObj = {
        pkg: '<json:package.json>'
    };

    var project = "svgtocssicons_example";


    configObj.svgtocssicons = configObj.svgtocssicons || {};
    configObj.svgtocssicons["icons-all"] = {
        files:{
            'dist/icons-all':[
                'source/_export/*.svg'
            ]
        },
        options:{
            prefix:"o-icon-",
        }
    };
    /*configObj.svgtocssicons["icons-16-32-64"] = {
        files:{
            'dist/icons-16-32-64':[
                'source/_export/*.svg'
            ]
        },
        options:{
            type:"css",
            prefix_filter:"",
            suffix_filter:"-64",
            prefix:"o-icon-",
            sizes:[16,32,64]
        }
    };
    configObj.svgtocssicons["icons-24-48-96"] = {
        files:{
            'dist/icons-24-48-96':[
                'source/_export/*.svg'
            ]
        },
        options:{
            type:"css",
            prefix_filter:"",
            suffix_filter:"-96",
            prefix:"o-icon-",
            sizes:[24,48,96]
        }
    };*/

    configObj.watch = configObj.watch || {};
    configObj.watch[project] = {
        files:[
            'source/_export/**/*.svg'
        ],
        tasks: ["default"]
    };

    grunt.initConfig( configObj );

    grunt.registerTask( 'default' , [
        'svgtocssicons'
    ]);

}
