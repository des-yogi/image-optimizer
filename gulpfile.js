'use strict';

const gulp = require('gulp');
const rename = require("gulp-rename");
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const webp = require('imagemin-webp');
const mozjpeg = require('imagemin-mozjpeg');
const svgo = require('imagemin-svgo');
const gifsicle = require('imagemin-gifsicle');

// Очистка папки минификации
gulp.task('clean', function () {
  console.log('---------- Очистка папки сборки');
  return del('build');
});

gulp.task('pngquant', function () {
  return gulp.src('src/*.png')
    .pipe(imagemin([
      pngquant({
        quality: 85 //так жмет чуть лучше чем tiny-png
      })
    ]))
    .pipe(gulp.dest('build/'))
});

gulp.task('webp', function () {
  return gulp.src('src/*.{jpg,jpeg,png,JPG,JPEG,PNG}')
    .pipe(imagemin([
      webp({
        quality: 80, // 75 default
        preset: 'photo' // photo, picture, drawing, icon and text
      })
    ]))
    .pipe(rename(function (path) {
      path.extname = ".webp";
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('mozjpeg', function () {
  return gulp.src('src/*.{jpg,jpeg,JPG,JPEG}')
    .pipe(imagemin([
      mozjpeg({
        progressive: true,
        quality: 70,
        sample: ['2x1'] //['2x2'] - будет меньше
      })
    ]))
    .pipe(rename({
      //prefix: "g-",
      extname: ".jpg"
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('svgo', function () {
  return gulp.src('src/*.svg')
   .pipe(imagemin([
    svgo({
     removeViewBox: false
   })]))
  .pipe(gulp.dest('build/'))
});

gulp.task('gifsicle', function () {
  return gulp.src('src/*.gif')
   .pipe(imagemin([
      gifsicle({
        optimizationLevel: 3, // 1-3
        colors: 256 // 2-256
      })
   ]))
  .pipe(gulp.dest('build/'))
});

// Минификация
gulp.task('minify', gulp.series(
  'clean',
  gulp.parallel('pngquant', 'webp', 'mozjpeg', 'svgo', 'gifsicle')
));