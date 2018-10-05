"use strict";

var gulp = require("gulp");
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var importCss = require('gulp-import-css');
const image = require('gulp-image');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var browserify=require("browserify");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var tsify = require("tsify");
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var inject = require('gulp-inject');

gulp.task("copy-assets",function(){
    return gulp.src(["src/assets/*.jpg"])
	.pipe(gulp.dest('./build/assets/'));
});



gulp.task("transpile-ts", function () {
return browserify("src/app/product.component.ts")
.plugin(tsify)
.bundle()
.pipe(source('product.component.ts')) 
.pipe(rename("bundle.js"))
.pipe(buffer()) 
.pipe(sourcemaps.init())
.pipe(sourcemaps.write())
.pipe(gulp.dest('build'))
.pipe(reload({stream:true}));
});



gulp.task('styles', function() {
  gulp.src('src/styles/*.css')
    .pipe(importCss())
    .pipe(image())
    .pipe(concat('main.css'))
    .pipe(gulp.dest('build/css/'))
	.pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task ('watch', function(){
	gulp.watch('src/styles/*.css', ['styles']);
	gulp.watch('src/app/*.ts', ['scripts']);
  	gulp.watch('src/index.html', ['html']);
});

gulp.task('inject-js-css', function () {
    var target = gulp.src('./src/index.html');
    var sources = gulp.src(['./build/bundle.js', './build/css/main.css'], {read: false});
    return target.pipe(inject(sources))
      .pipe(gulp.dest('./'));

  });

  gulp.task('build', function(callback) {
    runSequence(["styles","transpile-ts","copy-assets"],
                'inject-js-css','browser-sync', 'watch',
                callback);
  });

gulp.task("default", ["build"]);