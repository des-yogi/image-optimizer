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
        quality: [0.3, 0.8] // требуется сравнение с тини-пнг
      })
    ]))
    .pipe(gulp.dest('build/'))
});

gulp.task('webp', function () {
  return gulp.src('src/*.{jpg,jpeg,JPG,JPEG,png,PNG}')
    .pipe(imagemin([
      webp({
        quality: 75, // 75 default
        preset: 'photo' // photo, picture, drawing, icon and text
      })
    ]))
    .pipe(rename(function (path) {
      path.extname = ".webp";
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('webp-lossless', function () {
  return gulp.src('src/*.{png,PNG}')
    .pipe(imagemin([
      webp({
        lossless: true // Losslessly encode images
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
        quality: 75,
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

gulp.task('lossless', gulp.series(
  'clean',
  gulp.parallel('webp-lossless')
));