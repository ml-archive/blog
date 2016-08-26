var gulp = require('gulp');
var del = require('del');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var size = require('gulp-size');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var babel = require('gulp-babel');
var uglify = require('gulp-uglify');

var shell = require('shelljs');

var config = {
	styles: {
		inFiles: './themes/nodes/source/_scss/*.scss',
		outFiles: './themes/nodes/source/css',
		watchPattern: './themes/nodes/source/_scss/**/*.scss'
	},
	scripts: {
		inFiles: [
			'./themes/nodes/source/_js/vendor/jquery.min.js',
			'./themes/nodes/source/_js/client/app.js',
			'./themes/nodes/source/_js/client/file.js'
		],
		outFiles: './themes/nodes/source/js',
		watchPattern: './themes/nodes/source/_js/**/*.js'
	}
};

gulp.task('styles', function() {
	return gulp.src(config.styles.inFiles)
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [
				'./node_modules/foundation-sites/scss',
				'./node_modules/utility-opentype/css'
			]
		}).on('error', sass.logError))
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(size({title: 'styles'}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(config.styles.outFiles));
});

gulp.task('scripts', function() {
	return gulp.src(config.scripts.inFiles)
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe(concat('app.min.js'))
		.pipe(uglify({preserveComments: 'some'}))
		.pipe(size({title: 'scripts'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.scripts.outFiles));
});

gulp.task('clean', function() {
	del(['.tmp'], {dot: true});
});

gulp.task('serve', ['styles', 'scripts'], function() {
	browserSync({
		notify: false,
		files: ['public/**/*.*'],
		server: {
			baseDir: 'public',
			routes: {
				'/': 'public'
			}
		}
	});
	
	gulp.watch([config.styles.watchPattern], ['styles', reload]);
	gulp.watch([config.scripts.watchPattern], ['scripts', reload]);
});

gulp.task('serve:static', ['styles', 'scripts'], function() {
	browserSync({
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

gulp.task('default', ['clean', 'serve']);

gulp.task('build', ['clean', 'styles', 'scripts'], function() {
	shell.exec('hexo generate');
});
