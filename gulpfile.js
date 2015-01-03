var gulp = require('gulp');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');

gulp.task('scripts', function() {
    gulp.src(['src/scripts/demo/demo.js'])
        .pipe(browserify({
          debug : true
        }))
        .pipe(gulp.dest('dist/scripts/'))
});

gulp.task('connect',function(){
	connect.server({
		root: 'dist',
		livereload: true
	});
});

gulp.task('html', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('sample', function () {
    gulp.src('src/sample/*')
        .pipe(gulp.dest('dist/sample/'));
});

// gulp.task('reload', function () {
//     gulp.src('src/**')
//         .pipe(connect.reload())
// });

gulp.task('watch', function () {
	gulp.watch(['src/scripts/**/*.js'], ['scripts']);
	gulp.watch(['src/*.html'], ['html']);
});

gulp.task('dev',['scripts', 'html', 'sample']);
gulp.task('default',['dev', 'watch', 'connect'])
