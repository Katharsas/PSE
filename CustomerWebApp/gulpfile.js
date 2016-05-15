var gulp = require('gulp');
var ts = require('gulp-typescript');

var tsSource = "./src/main/typescript/**/*.ts";
var tsTarget = "./src/main/webapp/WEB-INF/resources/js";
var tsTargetFile = "index.bundle.js";
var tsOptions = {
	target: "es5",
	outFile: tsTargetFile,
	noImplicitAny: true,
	noExternalResolve : true
}

/**
 * Compiles all typescript files to javascript modules (as specified in tsOptions).
 */
gulp.task('typescript', function() {
	var fullTarget = tsTarget + '/' + tsTargetFile
    console.log('Compiling and bundling typescript to ' + fullTarget);
    return gulp.src([tsSource])
        .pipe(ts(tsOptions))
		.pipe(gulp.dest(tsTarget));
});

/**
 * Watches all typescript files and recompiles on change.
 */
gulp.task('watch', function() {
	console.log('Watching files at ' + tsSource + ' for changes...');
    gulp.watch(tsSource, ['typescript']);
});