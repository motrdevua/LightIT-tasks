const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-group-css-media-queries': 'gcmq',
    'gulp-clean-css': 'cleanCSS'
  }
});

const {
  reload
} = browserSync;

const onError = err => {
  plugins.notify.onError({
    title: `Error in ${err.plugin}`,
    message: '<%= error.message %>',
    sound: 'Pop',
    onLast: true
  })(err);
  this.emit('end');
};

const dev = plugins.environments.development;
const prod = plugins.environments.production;

const paths = {
  src: {
    html: 'src/*.html',
    sass: 'src/sass/**/*.sass',
    js: 'src/js/**/*.js',
  },
  dist: 'dist/'
};

function serve() {
  browserSync.init({
    server: paths.dist
  });
}

function html() {
  return gulp
    .src(paths.src.html)
    .pipe(plugins.htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(paths.dist))
    .on('end', reload);
}

function css() {
  return gulp
    .src(paths.src.sass)
    .pipe(plugins.plumber({
      errorHandler: onError
    }))
    .pipe(dev(plugins.sourcemaps.init()))
    .pipe(
      plugins.sass({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      plugins.autoprefixer({
        browsers: ['last 10 versions'],
        cascade: true
      })
    )
    .pipe(dev(plugins.sourcemaps.write()))
    .pipe(plugins.gcmq())
    .pipe(prod(plugins.cleanCSS()))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(`${paths.dist}css`))
    .pipe(browserSync.stream())
}

function js() {
  return gulp
    .src(paths.src.js)
    .pipe(plugins.plumber({
      errorHandler: onError
    }))
    .pipe(dev(plugins.sourcemaps.init()))
    .pipe(plugins.babel({
      presets: ['@babel/env']
    }))
    .pipe(prod(plugins.uglify()))
    .pipe(dev(plugins.sourcemaps.write()))
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(`${paths.dist}js`))
};

function watchFiles() {
  gulp.watch(paths.src.sass, css);
  gulp.watch(paths.src.js, js).on('change', reload);
  gulp.watch(paths.src.html, html);
}

function clean() {
  plugins.cache.clearAll();
  return del(paths.dist).then(dir => {
    console.log('Deleted files and folders:\n', dir.join('\n'));
  });
}

const watch = gulp.parallel(watchFiles, serve);
const build = gulp.series(clean, gulp.parallel(html, css, js, watch));

exports.css = css;
exports.js = js;
exports.clean = clean;
exports.watch = watch;
exports.default = build;