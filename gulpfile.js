var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var clean = require('gulp-clean');
gulp.task('less', function() {
    return gulp.src('./less/pub.less')
        .pipe(less())
        .pipe(gulp.dest('./css/'));
});

gulp.task('watch_less', function() {
    gulp.watch(['./less/*.less'], ['less']);
});

gulp.task('clean', function(cb) {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

gulp.task('compress', function() {
    gulp.src('./app/**/*.js')
        .pipe(gulp.dest('build/app/'))

    gulp.src('./app/**/*.js')
        .pipe(rename(function (path) {
            path.basename += "-min";
        }))
        .pipe(uglify({
            output:{ascii_only:true}
        }))
        .pipe(gulp.dest('build/app/'))

    gulp.src('./css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css/'));
});

gulp.task('watch', [
    'less',
    'watch_less'
]);

gulp.task('build', ['less', 'clean'], function() {
    gulp.run('compress');
});