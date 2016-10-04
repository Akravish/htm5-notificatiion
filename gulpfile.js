'use strict';

//---Import Modules
var gulp = require('gulp'),
    del = require('del'),
    debug = require('gulp-debug'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    newer = require('gulp-newer'), //todo with 40ms, without 30ms....fix it
    jadeInheritance = require('gulp-jade-inheritance'),
    jade = require('gulp-jade');
//---END Base imports and vars

//---Error
var util = require('gulp-util'),
    ulog = util.log,
    ucolors = util.colors;
//---End error

//---Serve
var browsersync = require('browser-sync').create(),
    reload  = browsersync.reload;
//---End serve

//---VARS
var apiServerPort   = 3001,
    webServerPort   = 8000,
    autoOpenBrowser = false;

var devSrc = 'src',
    devDest = 'build',
    pathProject = {
        del: '/**/*.*',
        js: {
            input: '/js/**/*.js',
            output: '/js'
        },
        css: {
            input: '/css/*.css',
            output: '/css'
        },
        img: {
            input: '/img/**/*.*',
            output: '/img'
        },
        fonts: {
            input: '/fonts/**/**',
            output: '/fonts'
        },
        assets: {
            input: '/assets/**/*',
            output: '/assets'
        },
        vendor: {
            input: '',
            output: ''
        },
        sass: {
            input: '/sass/*.sass',
            output: '/css'
        },
        jade: {
            input1: '/jade/*.jade',
            input2: '/jade',
            watchPath: '/**/*.jade'
        }
    };

//---End VARS

//For Future
//-----
//can use in gulp v4.0 {since: gulp.lastRun('js')}
//gulp.src('temp/folder/css/*.css',{since: gulp.lastRun('name_task')})
//-----


// Error handler for gulp-plumber
var errorHandler = function (err) {
    ulog(ucolors.red("-------ERROR-----------------------"));
    ulog([ucolors.red((err.name + ' in ' + err.plugin)), '', ucolors.magenta(err.message), ''].join('\n'));
    this.emit('end');
    ulog(ucolors.red("-----------------------------------"));

};
//---DEL build directory
gulp.task('del', function(){
    return del([devDest + pathProject.del]).then(function(paths){
            console.log('Deleted:\n',paths.join('\n'));})
});
//---Copy JS
gulp.task('js', function () {
    return gulp.src(devSrc + pathProject.js.input)
        .on('error', errorHandler)
        .pipe(newer(devDest + pathProject.js.input))
        .pipe(gulp.dest(devDest + pathProject.js.output))
        .pipe(reload({stream:true}));
});
//---Copy CSS
gulp.task('css', function () {
    return gulp.src(devSrc + pathProject.css.input)
        .on('error', errorHandler)
        .pipe(newer(devDest + pathProject.css.input))
        .pipe(gulp.dest(devDest + pathProject.css.output))
        .pipe(reload({stream:true}));
});
//---Copy IMG
gulp.task('img', function () {
    return gulp.src(devSrc + pathProject.img.input)
        .on('error', errorHandler)
        .pipe(newer(devDest + pathProject.img.output))
        //todo insert imagemin here code
        .pipe(gulp.dest(devDest + pathProject.img.output))
        .pipe(reload({stream:true}));
});
//---Copy FONTS
gulp.task('fonts', function () {
    return gulp.src(devSrc + pathProject.fonts.input)
        .on('error', errorHandler)
        .pipe(newer(devDest + pathProject.fonts.output))
        .pipe(gulp.dest(devDest + pathProject.fonts.output))
        .pipe(reload({stream:true}));
});
//---Copy ASSETS
gulp.task('assets', function () {
    return gulp.src(devSrc + pathProject.assets.input)
        .on('error', errorHandler)
        .pipe(newer(devDest + pathProject.assets.output))
        //todo insert fontsmin here code
        .pipe(gulp.dest(devDest + pathProject.assets.output))
        .pipe(reload({stream:true}));
});
//---VENDORS
//todo add task for install vendor
//todo dest must be reload when files src added
//---SASS
gulp.task('sass', function(){
    //todo not show errors...fix it
    return gulp.src([devSrc + pathProject.sass.input +'','!src/sass/_*'])
        //.pipe(plumber())
        //.pipe(sourcemaps.init())//todo del in prod ...set some if and we have some problem in it...test in livereload
        .pipe(sass().on('error', errorHandler))
        //.pipe(sourcemaps.write({includeContent: false}))//todo we have some problem in it...test in livereload
        //.pipe(sourcemaps.init({loadMaps: true}))//todo we have some problem in browsersync
        .pipe(autoprefixer({ browser: ['last 2 version'] }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(devDest + pathProject.sass.output))
        .pipe(reload({stream:true}));
});
//---JADE
gulp.task('jade', function() {
    gulp.src([devSrc + pathProject.jade.input1,'!src/jade/_*'])
        .pipe(jadeInheritance({ basedir: devSrc + pathProject.jade.input2}))
        .on('error', errorHandler)
        .pipe(jade({
            pretty: '\t',
            basedir: devSrc + pathProject.jade.input1
        }))
        .pipe(gulp.dest(devDest + '/'))
        .pipe(reload({stream:true}));
});

//---WATCH
gulp.task('watch', function () {
    //js
    gulp.watch(devSrc + pathProject.js.input, ['js']);
    //css
    gulp.watch(devSrc + pathProject.css.input, ['css']);
    //img
    gulp.watch(devSrc + pathProject.img.input, ['img']);
    //fonts
    gulp.watch(devSrc + pathProject.fonts.input, ['fonts']);
    //public
    gulp.watch(devSrc + pathProject.assets.input, ['assets']);
    //sass
    gulp.watch(devSrc +'/**/*.sass', ['sass']);
    //jade
    gulp.watch(devSrc + pathProject.jade.watchPath, ['jade']);
});

//---Serve
gulp.task('serve', function(){
    browsersync.init({
        server: devDest,
        port: webServerPort,
        ui: {
            port: apiServerPort
        },
        open: autoOpenBrowser
    });
    //watch all for files in dest folder
    //browsersync.watch('temp/folder/**/*.*').on('change',reload);
});

//---BUILD
gulp.task('build',['js','css','img','fonts','assets','sass','jade'], function(){
    return ulog(ucolors.green("-------- Build DONE --------"));
});

gulp.task('default',['build','serve','watch'], function(){
    return ulog(ucolors.green("-------- Default RUN -------"));
});


//// Копируем и минимизируем изображения
//gulp.task('images', function() {
//    gulp.src(path.img.source)
//        .pipe(cache(imagemin({
//            optimizationLevel: 3,
//            progressive: true,
//            interlaced: true,
//            svgoPlugins: [{removeViewBox: false}],
//            use: [imageminPngquant()]
//        })))
//        .on('error', handleError)
//        .pipe(gulp.dest(path.img.destination));
//});
//
//// Копируем файлы
//gulp.task('copy', function() {
//    gulp.src(path.assets.source)
//        .on('error', handleError)
//        .pipe(gulp.dest(path.assets.destination))
//        .pipe(reload({stream:true}));
//});