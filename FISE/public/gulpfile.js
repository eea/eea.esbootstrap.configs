var gulp = require('gulp');
var sass = require('gulp-sass');
var sassOptions = {
    includePaths: ['sass'],
    // outputStyle: 'compressed'
  };

var merge = require('merge-stream');
sass.compiler = require('node-sass');
var rename = require('gulp-rename');

gulp.task('sass', function () {
  var site = gulp.src('src/main.scss')
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(rename('custom.css'))
    .pipe(gulp.dest('.'));

    var details = gulp.src('src/details.scss')
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(rename('details.css'))
    .pipe(gulp.dest('.'));




  return merge(site, details)
});



gulp.task('sass:watch', function () {
  gulp.watch('src/*.scss', gulp.series('sass'));
});