var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var config = {
	styles: {
		inFiles: './source/_scss/*.scss',
		outFiles: './source/css',
		watchPattern: './source/_scss/**/*.scss'
	}
};

gulp.task('styles', function() {
	return gulp.src(config.styles.watchPattern)
			.pipe(sourcemaps.init())
			.pipe(scss({
				includePaths: [
					//'./node_modules/sassline/assets/sass/',
					//'./node_modules/flexiblegs-scss',
					'./node_modules/foundation-sites/scss',
					'./node_modules/utility-opentype/css'
				]
			}).on('error', scss.logError))
			.pipe(sourcemaps.write())
			.pipe(autoprefixer())
			.pipe(gulp.dest(config.styles.outFiles));
});
gulp.task('styles:watch', ['styles'], function() {
	gulp.watch(config.styles.watchPattern, ['styles']);
});

gulp.task('clean', function() {
	// DEL
});

gulp.task('default', ['styles:watch']);

gulp.task('browserSync', function() {
	browserSync.init({
		files: ['public/**/*.*'],
		server: {
			baseDir: 'public'
		}
	})
});