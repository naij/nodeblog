var gulp = require('gulp');
var path = require('path');
var less = require('gulp-less');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-csso');
var clean = require('gulp-clean');

gulp.task('less', function() {
    return gulp.src('./public/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch_less', function() {
    gulp.watch(['./public/less/*.less'], ['less']);
});

gulp.task('clean', function(cb) {
    return gulp.src('./public/build', {read: false})
        .pipe(clean());
});

gulp.task('compress', function() {
    gulp.src('./public/app/**/*.js')
        .pipe(rename(function (path) {
            path.basename += "-min";
        }))
        .pipe(uglify({
            output:{ascii_only:true}
        }))
        .pipe(gulp.dest('./public/build/app/'))

    gulp.src('./public/css/*.css')
        .pipe(rename(function (path) {
            path.basename += "-min";
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public/build/css/'));
});

gulp.task('watch', [
    'less',
    'watch_less'
]);

gulp.task('build', ['less', 'clean'], function() {
    gulp.run('compress');
});