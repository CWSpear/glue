var gulp      = require('gulp');
var mocha     = require('gulp-mocha');
var plumber   = require('gulp-plumber');
var eslint    = require('gulp-eslint');
var cache     = require('gulp-cached');
var istanbul  = require('gulp-istanbul');
var streamify = require('gulp-streamify');

require('babel/register')({
    nonStandard: true
});

var jsPaths = ['client/**/*.js', 'server/**/*.js'];

gulp.task('test', function () {
    return gulp.src(jsPaths, {read: false})
        .pipe(plumber())
        .pipe(streamify(istanbul()))
        .pipe(streamify(istanbul.hookRequire()))
        .pipe(runTests());

    function runTests() {
        return gulp.src('tests/**/*.test.js')
            .pipe(streamify(mocha({reporter: 'nyan'})))
            .pipe(streamify(istanbul.writeReports()))
            .pipe(streamify(istanbul.enforceThresholds({thresholds: {global: 80}})));
    }
});

gulp.task('integration-test', function () {
    return gulp.src(jsPaths, { read: false })
        .pipe(plumber())
        .pipe(mocha({reporter: 'nyan', grep: 'INTEGRATION-TESTS'}));
});

gulp.task('unit-test', function () {
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

gulp.task('ci', ['lint', 'test']);
