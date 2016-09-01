/**
 *  Nodes Engineering Blog
 */

'use strict';

import gulp from 'gulp';
import del from 'del';
import path from 'path';
import runSequence from 'run-sequence';
import newer from 'gulp-newer';

import browserSync from 'browser-sync';
const reload = browserSync.reload;

import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import size from 'gulp-size';

import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'gulp-cssnano';

import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import jscs from 'gulp-jscs';

import imagemin from 'gulp-imagemin';

import swPrecache from 'sw-precache';

const PATHS = {
	styles: {
		inFiles: './themes/nodes/source/_scss/*.scss',
		outFiles: './themes/nodes/source/css',
		tmpPath: '.tmp/styles'
	},
	scripts: {
		inFiles: [
			'./themes/nodes/source/_js/vendor/jquery.min.js',
			'./themes/nodes/source/_js/client/app.js',
			'./themes/nodes/source/_js/client/file.js'
		],
		outFiles: './themes/nodes/source/js',
		tmpPath: '.tmp/scripts',
		lintFiles: [
			'./themes/nodes/source/_js/client/**/*.js',
		]
	},
	images: {
		inFiles: './themes/nodes/source/_img/**/*',
		outFiles: './themes/nodes/source/img'
	}
};

const CLEAN_PATHS = [
	'.tmp'
];

const WATCH_PATTERNS = {
	styles: './themes/nodes/source/_scss/**/*.scss',
	scripts: ['./themes/nodes/source/_js/client/**/*.js', './themes/nodes/source/_js/vendor/**/*.js'],
	images: './themes/nodes/source/_img/**/*',
	fonts: '',
	serviceWorker: './themes/nodes/source/_js/sw/*.js'
};

// Sass Modules which is to be @import'ed in our stylesheets.
// Add any module you install through npm (or bower, but please don't) here,
// and @import them without their full file path in style.scss file.
const SASS_MODULES = [
	'./node_modules/foundation-sites/scss',
	'./node_modules/utility-opentype/css'
];

const AUTOPREFIXER_BROWSERS = [
	'ie >= 10',
	'ie_mob >= 10',
	'ff >= 30',
	'chrome >= 34',
	'safari >= 7',
	'opera >= 23',
	'ios >= 7',
	'android >= 4.4',
	'bb >= 10'
];

// Javascript Modules which is to be included in concatination and uglification.
// Add any module you install through npm (or bower, but please don't) here.
const JS_MODULES = [];

// Compile, prefix and minify styles
gulp.task('styles', () => {
	return gulp.src(PATHS.styles.inFiles)
		.pipe(newer(PATHS.styles.tmpPath))
		.pipe(sourcemaps.init())
		.pipe(sass({includePaths: SASS_MODULES})
			.on('error', sass.logError))
		.pipe(postcss([
			autoprefixer(AUTOPREFIXER_BROWSERS)
		]))
		.pipe(gulp.dest(PATHS.styles.tmpPath))
		.pipe(cssnano())
		.pipe(size({title: 'styles'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(PATHS.styles.outFiles));
});

// Transpile ES2015 code, concatinate and uglify the generated scripts
gulp.task('scripts', () => {
	return gulp.src(PATHS.scripts.inFiles)
		.pipe(newer(PATHS.scripts.tmpPath))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.scripts.tmpPath))
		.pipe(concat('app.min.js'))
		.pipe(uglify({preserveComments: 'some'}))
		.pipe(size({title: 'scripts'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(PATHS.scripts.outFiles));
});

// Optimize theme related images
gulp.task('images', () => {
	gulp.src(PATHS.images.inFiles)
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(PATHS.images.outFiles))
		.pipe(size({title: 'images'}));
});

gulp.task('copy', () => {
	gulp.src([
			'themes/nodes/source/*',
			'!themes/nodes/source/*.html'
		], {dot: true})
		.pipe(gulp.dest('public'))
		.pipe(size({title: 'copy'}));
});

// Run theme related javascript through jscs linter
gulp.task('lint', () => {
	return gulp.src(PATHS.scripts.lintFiles)
		.pipe(jscs())
		.pipe(jscs.reporter('fail'));
});

// Clean up the temporary folder
gulp.task('clean', () => {
	del(CLEAN_PATHS, {dot: true});
});

gulp.task('copy-sw-scripts', () => {
	return gulp.src([
			'node_modules/sw-toolbox/sw-toolbox.js',
			'themes/nodes/source/_js/sw/runtime-caching.js'
		])
		.pipe(gulp.dest('themes/nodes/source/js/sw'));
});
gulp.task('generate-service-worker', ['copy-sw-scripts'], () => {
	const rootDir = 'public';
	const filePath = path.join(rootDir, 'service-worker.js');
	
	return swPrecache.write(filePath, {
		cacheId: 'nodes-engineering-blog',
		importScripts: [
			'js/sw/sw-toolbox.js',
			'js/sw/runtime-caching.js'
		],
		staticFileGlobs: [
			// Add/remove glob patterns to match your directory setup.
			`${rootDir}/img/**/*`,
			`${rootDir}/js/*.js`,
			`${rootDir}/css/**/*.css`,
			`${rootDir}/**/*.{html,json}`
		],
		stripPrefix: rootDir + '/'
	});
});

// Start a browserSync server and start concurrent watch tasks
gulp.task('serve', ['build'], () => {
	browserSync({
		// https: true,
		notify: false,
		files: ['public/**/*.*'],
		server: {
			baseDir: 'public',
			routes: {
				'/': 'public'
			}
		}
	});
	
	gulp.watch([WATCH_PATTERNS.styles], ['styles', reload]);
	gulp.watch([WATCH_PATTERNS.scripts], ['scripts', reload]);
	gulp.watch([WATCH_PATTERNS.serviceWorker], ['generate-service-worker', reload]);
});

// Start a browserSync server and start concurrent watch tasks
// There is currently no difference between the normal serve and the static task.
gulp.task('serve:static', ['build'], () => {
	browserSync({
		// https: true,
		notify: false,
		files: ['public/**/*.*'],
		server: {
			baseDir: 'public',
			routes: {
				'/': 'public'
			}
		}
	});
});

// Convenience tasks
gulp.task('default', ['build', 'serve']);
gulp.task('build', ['clean'], cb => {
	runSequence(
		'styles',
		['scripts', 'images'],
		cb
	);
});
gulp.task('build:post', ['copy', 'generate-service-worker']);
