module.exports = function (grunt) {
	grunt.initConfig({
		svgtocssicons: {
			'icons-all': {
				options: {
					prefix: 'o-icon-',
				},
				files: {
					'dist/icons-all':[ 'source/_export/*.svg' ],
				},
			},
		},
		watch: {
			svgtocssicons: {
				files: 'source/_export/**/*.svg',
				tasks: 'default',
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadTasks('../tasks');

	grunt.registerTask( 'default' , ['svgtocssicons']);
	grunt.registerTask( 'dev' , ['svgtocssicons', 'watch:svgtocssicons']);
}
