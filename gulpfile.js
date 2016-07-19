var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var scss = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

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
			.pipe(scss({
				includePaths: [
					'./themes/nodes/node_modules/foundation-sites/scss',
					'./themes/nodes/node_modules/utility-opentype/css'
				]
			}).on('error', scss.logError))
			.pipe(sourcemaps.write())
			.pipe(autoprefixer())
			.pipe(gulp.dest(config.styles.outFiles));
});
gulp.task('styles:watch', function() {
	gulp.watch(config.styles.watchPattern, ['styles']);
});

gulp.task('clean', function() {
	// DEL
});

gulp.task('browserSync', function() {
	browserSync.init({
		files: ['public/**/*.*'],
		// server: {
		// 	baseDir: 'public'
		// },
		proxy: 'http://localhost:4000/nhexo'
	})
});

gulp.task('default', ['styles:watch', 'browserSync']);