var gulp     = require('gulp');
var mocha    = require('gulp-mocha');
var plumber  = require('gulp-plumber');
var istanbul = require('gulp-istanbul');
var eslint   = require('gulp-eslint');
var cache    = require('gulp-cached');

require('babel/register')({
    nonStandard: true
});

var jsPaths = ['client/**/*.js', 'server/**/*.js'];

gulp.task('test', function () {
    return gulp.src(jsPaths, {read:false})
        .pipe(plumber())
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .pipe(runTests());

    function runTests() {
        return gulp.src('tests/**/*.test.js')
            .pipe(mocha({reporter: 'nyan'}))
            .pipe(istanbul.writeReports())
            .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }));
    }
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
