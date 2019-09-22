const gulp = require('gulp');
const concatenate = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const gulpSASS = require('gulp-sass');
const rename = require('gulp-rename');

const sassFiles = ['./src/scss/variables.scss', './src/scss/custom.scss'];

const vendorJsFiles = [
  './node_modules/jquery/dist/jquery.min.js',
  './src/bootstrap/dist/js/bootstrap.min.js'
];

gulp.task('sass', done => {
  gulp
    .src(sassFiles)
    .pipe(gulpSASS())
    .pipe(concatenate('styles.css'))
    .pipe(gulp.dest('./public/css/'))
    .pipe(
      autoPrefix({
        cascade: false
      })
    )
    .pipe(cleanCSS())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./public/css/'));
  done();
});

gulp.task('js:vendor', done => {
  gulp
    .src(vendorJsFiles)
    .pipe(concatenate('vendor.min.js'))
    .pipe(gulp.dest('./public/js/'));
  done();
});

gulp.task('default', gulp.series('sass', 'js:vendor'));
