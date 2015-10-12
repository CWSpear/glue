var gulp      = require('gulp');
var mocha     = require('gulp-mocha');
var plumber   = require('gulp-plumber');
var eslint    = require('gulp-eslint');
var cache     = require('gulp-cached');

require('babel/register')({
    nonStandard: true
});

var jsPaths = ['client/**/*.js', 'server/**/*.js'];

gulp.task('integration-test', function () {
    return gulp.src(jsPaths, { read: false })
        .pipe(plumber())
        .pipe(mocha({reporter: 'nyan', grep: 'INTEGRATION-TESTS'}));
});

gulp.task('test', function () {
    return gulp.src(jsPaths, { read: false })
        .pipe(plumber())
        .pipe(mocha({reporter: 'nyan', grep: 'UNIT-TESTS'}));
});

gulp.task('lint', function () {
    return gulp.src(jsPaths)
        .pipe(plumber())
        .pipe(cache('linting'))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('ci', ['lint', 'test', 'integration-test']);
