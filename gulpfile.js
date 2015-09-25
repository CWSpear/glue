var gulp     = require('gulp'),
    mocha    = require('gulp-mocha'),
    babel    = require('babel'),
    plumber  = require('gulp-plumber'),
    istanbul = require('gulp-istanbul');

require('babel/register')

gulp.task('test', function () {
  return gulp.src('src/**/*.js', {read:false})
    .pipe(plumber())
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .pipe(runTests());

    function runTests() {
      return gulp.src('tests/**/*.test.js')
        .pipe(mocha({reporter: 'nyan'}))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }))
    }
})
