const {src, dest, series, watch} = require('gulp')
const less = require('gulp-less')
const csso = require('gulp-csso')
const include = require('gulp-file-include');
const minify = require('gulp-htmlmin')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
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

function copyImg() {
  return src([
    "src/img/**/*.{png,jpg,svg}"
  ])
    .pipe(dest("dist/media/img"));
}

function copyFonts() {
  return src([
    "src/fonts/**"
  ])
    .pipe(dest("dist/media/fonts"));
}

function copyLibs() {
  return src([
    "src/libs/**"
  ])
    .pipe(dest("dist/libs"));
}

function clear() {
  return src('dist', {read: false})
    .pipe(clean())
}

function clearMedia() {
  return src('dist/media', {read: false})
    .pipe(clean())
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**/*.html', series(html)).on('change', sync.reload)
  watch('src/less/**/*.less', series(compileLess)).on('change', sync.reload)
}

exports.serve = series(clear, copyImg, copyFonts, copyLibs, compileLess, html, serve)

exports.clear = clear
exports.clearMedia = clearMedia
