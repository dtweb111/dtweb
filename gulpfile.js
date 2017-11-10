var gulp = require('gulp');
var gulpDel = require('del');
var gulpSourceMaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var gulpConcat = require('gulp-concat');
var gulpUglify = require('gulp-uglify');
var gulpAutoPrefixer = require('gulp-autoprefixer');
var gulpCleanCss = require('gulp-clean-css');
var gulpImageMin = require('gulp-imagemin');

var config = require('./config/config');

//var production = process.env.NODE_ENV === 'production';
var production = config.env === 'prod';
var paths = {
    vendors: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/magnific-popup/dist/jquery.magnific-popup.js'
    ],
    libs: [
        'bower_components/videojs-youtube/dist/Youtube.min.js'
    ],
    scripts: [
        'public/js/common.js',
        'public/js/home.js',
        'public/js/search.js'
    ],
    images: ['public/img/**/*', 'public/favicon.ico'],
    styles: 'public/css/**/*',
    fonts: 'public/fonts/**/*'
};

// Combine all JS libraries into a single file
gulp.task('cleanVendor', function () {
    return gulpDel(['dist/js/vendor.js', 'dist/js/vendor.js.map']);
});
gulp.task('cleanLib', function () {
    return gulpDel(['dist/lib']);
});
gulp.task('cleanBundle', function () {
    return gulpDel(['dist/js/bundle.js', 'dist/js/bundle.js.map']);
});
gulp.task('cleanCss', function () {
    return gulpDel(['dist/css']);
});
gulp.task('cleanImg', function () {
    return gulpDel(['dist/img']);
});
gulp.task('cleanFont', function () {
    return gulpDel(['dist/fonts']);
});

gulp.task('vendors', ['cleanVendor'], function(){
    return gulp.src(paths.vendors)
        .pipe(gulpIf(!production, gulpSourceMaps.init()))
        .pipe(gulpConcat('vendor.js'))
        .pipe(gulpIf(production, gulpUglify({ie8:true})))
        .pipe(gulpIf(!production, gulpSourceMaps.write('.')))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('libs', ['cleanLib'], function(){
    return gulp.src(paths.libs)
        .pipe(gulp.dest('dist/lib'));
});

gulp.task('scripts', ['cleanBundle'], function(){
    return gulp.src(paths.scripts)
        .pipe(gulpIf(!production, gulpSourceMaps.init()))
        .pipe(gulpConcat('bundle.js'))
        .pipe(gulpIf(production, gulpUglify({ie8:true})))
        .pipe(gulpIf(!production, gulpSourceMaps.write('.')))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', ['cleanCss'], function(){
    return gulp.src(paths.styles)
        .pipe(gulpSourceMaps.init())
        .pipe(gulpAutoPrefixer())
        .pipe(gulpConcat('bundle.css'))
        .pipe(gulpCleanCss({compatibility: 'ie8', rebase: false}))
        .pipe(gulpSourceMaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('images', ['cleanImg'], function(){
    return gulp.src(paths.images, {base: 'public'})
        .pipe(gulpImageMin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', ['cleanFont'], function(){
    return gulp.src(paths.fonts)
        .pipe(gulp.dest('dist/fonts'));
});

// The watch task
gulp.task('watch', function () {
    gulp.watch(paths.vendors, ['vendors']);
    gulp.watch(paths.libs, ['libs']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.images, ['images']);
    gulp.watch(paths.fonts, ['fonts']);
});

// The build task (called when npm has finished install, `postinstall` in package.json)
gulp.task('build', ['vendors', 'libs', 'scripts', 'styles', 'images', 'fonts']);

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch']);
