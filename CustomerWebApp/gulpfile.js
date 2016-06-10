// ==================
// IMPORTS
// ==================
var gulp = require('gulp');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");

var browserify = require('browserify');
var tsify = require('tsify');
var uglify = require('gulp-uglify');

var walkSync = require('walk-sync');
var sourceStream = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var rename = require("gulp-rename");
var eventStream = require("event-stream");

//==================
// OPTIONS
// ==================

var tsFiles = ["index.ts"]

var jsSourceMaps = true;
var jsMinify = false;

var tsSource = "./src/main/typescript/";
var tsTarget = "./src/main/webapp/resources/js/";

var tsOptions = {
	target: "es5",
	noImplicitAny: true,
	noExternalResolve : true
};

//==================
// BUILD SCRIPTS
//==================

function handleErrors() {
	var args = Array.prototype.slice.call(arguments);
	notify.onError({
		title: "Compile Error in line <%= error.lineNumber %>",
		message: "<%= error.message %>"
	}).apply(this, args);
	this.emit("end"); // Keep gulp from hanging on this task
}

/**
 * Compiles specified ts files to javascript modules (as specified in tsOptions).
 */
gulp.task('typescript', function() {
	var tasks = tsFiles.map(function(file) {
		
		var configBrowserify = {
			entries: [tsSource + file],
			debug: jsSourceMaps
		};
		var bundler = browserify(configBrowserify);
		
		var typingsFolder = tsSource + "typings";
		walkSync(typingsFolder).forEach(function(file) {
		    if (file.match(/\.d\.ts$/)) {
		    	bundler.add(typingsFolder + "/" + file);
		    }
		});
		
		return bundler
			.plugin(tsify, tsOptions)
			.bundle()
			.on("error", handleErrors)
			.pipe(sourceStream(file))
			.pipe(gulpif(jsMinify, buffer()))
			.pipe(gulpif(jsMinify, uglify()))
			.pipe(rename({
				extname: ".bundle.js"
			}))
			.pipe(gulp.dest(tsTarget));
	});
	return eventStream.merge.apply(null, tasks);
});

/**
 * Watches all typescript files and recompiles on change.
 */
gulp.task('watch', function() {
	console.log('Watching files at ' + tsSource + ' for changes...');
    gulp.watch(tsSource, ['typescript']);
});