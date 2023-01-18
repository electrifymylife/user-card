const {src, dest, series, watch} = require('gulp')

const include = require('gulp-file-include');
const minify = require('gulp-htmlmin')
const less = require('gulp-less')
const csso = require('gulp-csso')
const autoprefixer = require('gulp-autoprefixer')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const newer = require('gulp-newer')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const sync = require('browser-sync').create()

function html() {
  return src('src/**.html')
      .pipe(include({
          prefix: '@@'
      }))
    .pipe(minify({
      collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function compileLess() {
  return src('src/less/style.less')
    .pipe(less())
    .pipe(autoprefixer({
      overrideBrowserslist: ["last 2 version"]
    }))
    .pipe(csso())
    .pipe(concat('style.css'))
    .pipe(dest('dist'))
}

function js() {
  return src('src/js/*.js')
    .pipe(uglify())
    .pipe(dest('dist/js'))
}

function img() {
  return src('src/img/**/*.{png,jpg,svg}')
    .pipe(newer('dist/assets/img'))
    .pipe(imagemin({
      verbose: true
    }))
    .pipe(dest('dist/assets/img'))
}

function copyFonts() {
  return src('src/fonts/**')
    .pipe(dest('dist/assets/fonts'));
}

function copyLibs() {
  return src('src/libs/**')
    .pipe(dest('dist/assets/libs'));
}

function clear() {
  return src('dist', {read: false})
    .pipe(clean())
}

function clearAssets() {
  return src('dist/assets', {read: false})
    .pipe(clean())
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**/*.html', series(html)).on('change', sync.reload);
  watch('src/less/**/*.less', series(compileLess)).on('change', sync.reload);
  watch('src/js/**/*.js', series(js)).on('change', sync.reload);
  watch('src/img/**/*.*', series(img)).on('all', sync.reload);
  watch('src/fonts/**/*.*', series(copyFonts)).on('all', sync.reload);
  watch(['src/css/libs'], series(copyLibs)).on('all', sync.reload);
}

exports.serve = series(clear, copyFonts, copyLibs, img, js, compileLess, html, serve);

exports.clear = clear
exports.clearAssets = clearAssets