var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

var config = {
	styles: {
		inFiles: './themes/nodes/source/_scss/*.scss',
		outFiles: './themes/nodes/source/css',
		watchPattern: './themes/nodes/source/_scss/**/*.scss'
	}
};

gulp.task('styles', function() {
	return gulp.src(config.styles.inFiles)
			.pipe(sourcemaps.init())
			.pipe(sass({
				includePaths: [
					'./themes/nodes/node_modules/foundation-sites/scss',
					'./themes/nodes/node_modules/utility-opentype/css'
				]
			}).on('error', sass.logError))
			.pipe(postcss([
				autoprefixer()
			]))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(config.styles.outFiles));
});

gulp.task('styles:watch', function() {
	gulp.watch(config.styles.watchPattern, ['styles']);
});

gulp.task('browserSync', function() {
	browserSync.init({
		files: ['public/**/*.*'],
		proxy: 'http://localhost:4000/blog'
	})
});

gulp.task('default', ['styles:watch', 'browserSync']);