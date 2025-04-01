const gulp = require('gulp');
var args = process.argv[2];
gulp.task('watch', function(){
    gulp.watch([
		'gulpfile.js', 
		'./src/*.js'
	], {usePolling: true});
})
if (args == '--build') {
	gulp.task('default', gulp.series('watch'));
} else if (args == '--watch'){
	gulp.task('default', gulp.series('watch'));
}
gulp.task('default', gulp.series('watch'));