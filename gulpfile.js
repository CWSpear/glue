var path   = require('path');

var gulp   = require('gulp');
var gutil  = require('gulp-util');

var _      = require('lodash');
var bower  = require('bower');
var npm    = require('npm');
var rimraf = require('rimraf');
var q      = require('q');

// start config

var dest = '.tmp/public/';
var src = 'src/';

var destAbsPath = path.resolve(dest);

var npmConfig = require('./package.json');
var includeBrowserSync = true;

if (_.contains(gutil.env._, 'build')) { 
  if (!gutil.env.production) gutil.env.production = true;
  includeBrowserSync = false;
}

var scripts = [
  src + 'js/app.js',
  src + 'js/**/*.js',
  '!' + src + 'js/dependencies/*.js',
];

// end config

var onError = function (err) {
  gutil.beep();
  console.log(err.message, err);
};

gulp.task('styles', function () {
  return gulp.src(src + 'scss/style.scss')
    .pipe(plumber(onError))
    .pipe(sass({
      outputStyle: gutil.env.production ? 'compressed' : 'nested',
      // sourceComments: 'map', // won't work with autoprefixer
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gutil.env.production ? rev() : gutil.noop())
    .pipe(gulp.dest(dest + 'css/'))
    .pipe(gutil.env.production ? inject(dest + 'index.html', {
      transform: function (filepath) {
        return '<link rel="stylesheet" href="' + filepath.replace(dest.substr(0,2) == '..' ? destAbsPath : dest, '') + '">';
      }
    }) : gutil.noop())
    .pipe(gutil.env.production ? gulp.dest(dest) : gutil.noop())
    .pipe(browsersync.reload({ stream:true }));
});

gulp.task('copy', function () {
  // apparently gulp ignores dotfiles with globs
  gulp.src([src + 'copy/**/*', src + 'favicon.ico'], { dot: true })
    .pipe(gulp.dest(dest));

  gulp.src(src + 'img/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(dest + 'img/'))
    .pipe(browsersync.reload({ stream:true }));
});

// these files are require'd, so don't need to be linked, but do need to be copied
gulp.task('ace', ['usemin'], function () {
  return gulp.src([
      'mode-*',
      'theme-*',
      'worker-*',
    ], { 
      // note: NO src
      cwd: 'bower_components/ace-builds/src-min/' 
    })
    .pipe(gulp.dest(dest + 'js/ace/'));
});

gulp.task('templates', function () {
  return gulp.src([src + 'views/**/*.html'])
    .pipe(gulp.dest(dest + 'views/'))
    .pipe(browsersync.reload({ stream:true }));
});

gulp.task('scripts', _.union(['index', 'bower'], gutil.env.production ? ['styles'] : []), function () {
  return gulp.src(scripts)
    .pipe(plumber(onError))
    .pipe(traceur({ sourceMap: false })) // !gutil.env.production }))
    .pipe(gutil.env.production ? ngmin() : gutil.noop())
    .pipe(gutil.env.production ? concat('script.js') : gutil.noop())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rev())
    .pipe(gulp.dest(dest + 'js/'))
    .pipe(inject(dest + 'index.html', {
      transform: function (filepath) {
        return '<script src="' + filepath.replace(dest.substr(0,2) == '..' ? destAbsPath : dest, '') + '"></script>';
      }
    }))
    .pipe(gulp.dest(dest))
    .pipe(browsersync.reload({ stream:true }));
});

gulp.task('bower', _.union(['index'], gutil.env.production ? ['styles'] : []), function () {
  if (!gutil.env.production)
    bowerfiles().pipe(gulp.dest(dest + 'bower_components/'));

  return gulp.src([dest + 'index.html'])
    .pipe(plumber(onError))
    .pipe(wiredep.stream({
      ignorePath: /^\.\.\//,
      directory: 'bower_components',
      bowerJson: require('./bower.json'),
      fileTypes: {
        html: {
          replace: {
            js: '<script src="/{{filePath}}"></script>'
          }
        }
      }
    }))
    .pipe(replace('<!-- browser-sync -->', "<script>angular.module('glue').constant('debug', " + !gutil.env.production + ");<"+"/script>"))
    .pipe(gulp.dest(dest));
});

gulp.task('usemin', ['bower', 'scripts', 'styles'], function () {
  if (!gutil.env.production) return;

  return gulp.src(dest + 'index.html')
    .pipe(usemin({
      js: [uglify(), rev()]
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('index', function () {
  // returning makes task synchronous 
  // if something else depends on it
  return gulp.src(src + 'index.html')
    .pipe(gulp.dest(dest));
});

var loadModules = function () {
  _.each(npmConfig.devDependencies, function (version, module) {
    var name = module == 'gulp-util' ? 'gutil' : module.replace('gulp-', '').replace('-', '');
    global[name] = require(module);
  });
};

var prereqs = function () {
  var rimrafDeferred = q.defer();

  rimraf(dest, function (er) {
    if (er) throw er;
    rimrafDeferred.resolve();
    gutil.log("rimraf'd", gutil.colors.magenta(dest));
  });

  if (!gutil.env.install) {
    loadModules();
    return rimrafDeferred.promise;
  }

  var bowerDeferred = q.defer();
  var npmDeferred = q.defer();

  bower.commands.install().on('end', function (results) {
    bowerDeferred.resolve();
    gutil.log(gutil.colors.cyan('bower install'), 'finished');
  });

  npm.load(npmConfig, function (er) {
    npm.commands.install([], function (er, data) {
      gutil.log(gutil.colors.cyan('npm install'), 'finished');
      loadModules();
      npmDeferred.resolve();
    });
  });

  return q.all([
    rimrafDeferred.promise,
    bowerDeferred.promise,
    npmDeferred.promise
  ]);    
};

gulp.task('build', function () {
  prereqs().then(function () {
    gulp.start('run');
  });
});

var isWatching = false;
gulp.task('default', function () {
  prereqs().then(function () {
    gulp.start('run', function () {
      if (isWatching) return;
      isWatching = true;

      gulp.watch(src + 'scss/**/*.scss', ['styles']);
      gulp.watch(src + 'js/**/*.js', ['scripts']);
      gulp.watch(src + 'views/**/*.html', ['templates']);
      gulp.watch([
        src + 'copy/**/*', 
        src + 'img/**/*.{png,svg,gif,jpg}'
      ], { dot: true }, ['copy']);

      gulp.watch(src + 'index.html', ['index', 'scripts', 'bower']);

      var bs = browsersync.init(null, {
        ports: { min: 8888, max: 8890 },
        ghostMode: {
          clicks: false,
          links: false,
          forms: false,
          scroll: false,
        }
      });

      bs.events.on("file:changed", function (file) {
        terminalnotifier(file.path.replace(destAbsPath, ''), { title: 'File Changed' });
      });
    });
  });
});

gulp.task('run', ['copy', 'styles', 'templates', 'scripts', 'bower', 'usemin', 'ace']);
