"use strict";

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

var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");

//==================
// OPTIONS TS
// ==================

var tsFiles = ["main.ts"]

var jsSourceMaps = true;
var jsMinify = false;

var tsSource = "./src/main/typescript/";
var tsTarget = "./src/main/webapp/resources/js/";

//==================
//OPTIONS CSS
//==================

var cssSourceMaps = true;
var sassSource = "./src/main/scss/";
var sassTarget = "./src/main/webapp/resources/css/";
var sassFilter = "**/*.scss";

//==================
// BUILD TS
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
			.plugin(tsify)
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

//==================
//BUILD CSS
//==================

gulp.task("sass", function () {
	return gulp
		.src(sassSource + sassFilter)
		.pipe(gulpif(cssSourceMaps, sourcemaps.init()))
		.pipe(sass().on("error", sass.logError))
		.pipe(gulpif(cssSourceMaps, sourcemaps.write()))
		.pipe(gulp.dest(sassTarget));
});

//==================
//WATCH
//==================

/**
 * Watches all typescript files and recompiles on change.
 */
gulp.task('watch', function() {
	console.log('Watching files at ' + tsSource + ' for changes...');
    gulp.watch(tsSource + "**/*.ts", ['typescript']);
    console.log('Watching files at ' + sassSource + ' for changes...');
    gulp.watch(sassSource + sassFilter, ['sass']);
});