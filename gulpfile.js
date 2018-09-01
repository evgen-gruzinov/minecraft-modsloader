const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const insert = require('gulp-insert');
const rename = require('gulp-rename');
const removeFiles = require('gulp-remove-files');

gulp.task('css', () => gulp.src('./src/styles/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./src/styles')));

gulp.task('css:watch', () => {
  gulp.watch('./src/**/*.scss', ['css']);
});


gulp.task('set-prod', () => {
  gulp
        .src('./src/main.js')
        .pipe(rename('main_dev.js'))
        .pipe(gulp.dest('./src/'));

  gulp
        .src('./src/main.js')
        .pipe(insert.prepend('process.env.NODE_ENV = \'production\'; \r\n'))
        .pipe(gulp.dest('./src/'));
});

gulp.task('set-dev', () => {
  gulp
        .src('./src/main_dev.js')
        .pipe(rename('main.js'))
        .pipe(gulp.dest('./src/'));
  gulp
        .src('./src/main_dev.js')
        .pipe(removeFiles());
});
