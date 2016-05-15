var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsSource = "./src/main/typescript/**/*.ts";
var tsTarget = "./src/main/webapp/WEB-INF/resources/js";
var tsOptions = {
	module: "commonjs";//TODO build for browser (bundle), not for commonjs
}

/**
 * Compiles all typescript files to javascript modules (as specified in tsOptions).
 */
gulp.task('typescript', function() {
    console.log('Compiling typescript');
    return gulp.src([tsSource])
        .pipe(ts(tsOptions)).js.pipe(gulp.dest(tsTarget));
});

/**
 * Watches all typescript files and recompiles on change.
 */
gulp.task('watch', function() {
    gulp.watch(tsSource, ['typescript']);
});