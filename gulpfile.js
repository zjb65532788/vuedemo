/**
 Gulpfile for gulp-webpack-demo
 created by fwon
*/

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    md5 = require('gulp-md5-plus'),
    clean = require('gulp-clean'),
    webpack = require('webpack'),
    spriter = require('gulp-css-spriter'),
    webpackConfig = require('./webpack.config.js'),
    replace = require('gulp-replace');
    connect = require('gulp-connect');

var host = {
    path: '',
    port: 3000,
    html: 'index.html'
};

//mac chrome: "Google chrome", 
/*var browser = os.platform() === 'linux' ? 'Google chrome' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));*/
/*var pkg = require('./package.json');
*/

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src('dist/vuejs/*.js')
        .pipe(md5(10, 'dist/Mobilenew/*.html'))
        .pipe(gulp.dest('dist/vuejs'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['spriter'], function (done) {
    gulp.src('dist/css/*.css')
        .pipe(md5(10, 'ThinkPHP.project/Tpl/Mobilenew/*.html'))
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});

//用于在html文件中直接include文件
gulp.task('fileinclude', function (done) {
    gulp.src('src/Mobilenew/*.html')
        .pipe(replace('/static/vuejs/','http://static-develop.clewm.me/static/vuejs/'))
        .pipe(gulp.dest('dist/Mobilenew'))
        .on('end', done);;
        // .pipe(connect.reload())
});

gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done);
});

gulp.task('watch', function (done) {
    gulp.watch('src/**/*', ['build-js'])
        .on('end', done);
});

gulp.task('connect', function () {
    console.log('connect------------');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

gulp.task('open', function (done) {
    gulp.src('')
        .pipe(gulpOpen({
            app: browser,
            uri: 'http://localhost:3000/app'
        }))
        .on('end', done);
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js", ['fileinclude'], function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

//发布
gulp.task('default', ['fileinclude', 'md5:js']);

//开发
gulp.task('dev', ['connect', 'build-js','watch']);