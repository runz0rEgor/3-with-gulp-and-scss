const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const fileInclude  = require('gulp-file-include')


// TASKS
const browsersync = () => {
  browserSync.init({
    server: {
      baseDir: 'app/',
    },
    notify: false
  });
}


const styles = () => {
  return src('app/scss/*.scss')
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}





const images = () => {
  return src('app/img/**/*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
  ]))
    .pipe(dest('dist/img'))
}


const build = () => {
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/js/main.min.js',
    'app/**/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}


const delDist = () => {
  return del('dist')
}


// WATCH
const startWatch = () => {
  watch('app/scss/*.scss', styles)
  watch('app/**/*.html').on('change', browserSync.reload)
}


// TASK EXPORTS

exports.browsersync = browsersync;
exports.startwatch = startWatch;
// exports.script = script;
exports.styles = styles;
exports.images = images;
exports.delDist = delDist;
exports.build = series(delDist, images, build);
exports.default = parallel(browsersync, startWatch , styles)