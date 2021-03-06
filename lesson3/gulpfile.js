var destDir = 'bin';
var gulp = require('gulp');
var bower = require('gulp-bower');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var less = require('gulp-less');
var argv = require('yargs').argv;
var debug = require('gulp-debug');
var clean = require('gulp-clean');
var livereload = require('gulp-livereload');
var csscomb = require('gulp-csscomb');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var minimist = require('minimist');
var htmlmin = require('gulp-htmlmin');
var htmlhint = require('gulp-htmlhint');
var autoprefixer = require('gulp-autoprefixer');

//var folders = {
//    styles: {
//        src: '/styles/',
//        dst: destDir + '/styles/'
//    },
//    images: {
//        src: '/images/',
//        dst: destDir + '/images/'
//    },
//    js: {
//        src: '/js/',
//        dst: destDir + '/js/'
//    }
//};

//gulp.task('default', ['css']);

//  [1] Runs 'libs' & 'build' task
//gulp.task('default', ['libs', 'build']);

//  [15] Default task gathers all css, js, html and images
gulp.task('default', ['css', 'html', 'images', 'js']);

//  [2] Add dependencies
gulp.task('bower', function () {
    return bower('libs');
});

//  [3] Runs 'copy-static' & 'css' task
gulp.task('build', ['copy-static', 'css']);

//  [4] Copy all *.min.js from libs to bin/libs
gulp.task('libs', function () {
    return gulp.src('libs/**/*.min.js')
        .pipe(gulp.dest(destDir + '/libs/'));
});

//  [5] Copy all *.png *.jpg *.svg to bin
gulp.task('images', function () {
    return gulp.src(['**/*.{png,jpg,svg}','!./node_modules/**'])
        .pipe(gulp.dest(destDir));
});

//  [6] Copy all *.html to bin
gulp.task('html', function () {
    return gulp.src(['*.html'])
        .pipe(gulpif(!argv.prod, htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest(destDir));
});

//  [7] Combine all .less files, run less preprocessor, minify with cssnano, write to bin/static/styles.css.
//  Run with --prod for production mode
//  Run without --prod to add sourcemap
gulp.task('css', function () {
    return gulp.src('styles/**/*.less')
        .pipe(concat('styles.css'))
        .pipe(gulpif(!argv.prod, sourcemaps.init())) // Add sourcemap if not production mode
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(argv.prod, cssnano()))
        .pipe(gulpif(!argv.prod, sourcemaps.write('.'))) // Add sourcemap if not production mode
        .pipe(gulp.dest(destDir + '/styles/'))
        .pipe(livereload());
    //.pipe(gulp.dest(folders.styles.dst));
});

gulp.task('copy-static', function () {
    return gulp.src(['**/*.{png,jpg,svg}', '*.html', '**.*.js', '!./node_modules/**'])
        .pipe(gulp.dest(destDir));
});

//gulp.task('copy-static', ['css', 'html', 'images', 'js']);

//  [8] Clears bin folder
gulp.task('clean', function () {
    return gulp.src(destDir + '/*', {read: false})
        .pipe(clean({force: true}));
});

//  [9] Watches project files changes, automatically runs a task if files were updated:
//  - *.png *.jpg *.svg: run 'images' task
//  - *.html: run 'html' task
//  - *.less run 'css' task
//  - *.js run 'js' task
gulp.task('watch', function () {
    gulp.watch('**/*.@(png|jpg|svg)', ['images']);
    gulp.watch('**/*.html', ['html']);
    livereload.listen();
    gulp.watch('**/*.less', ['css']);
    gulp.watch('**/*.js', ['js']);
});

//  [10.1 - 10.4] JS task
//  Run with --prod for production mode
//  Run without --prod to add sourcemap
gulp.task('js', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(concat('script.js'))
        .pipe(gulpif(!argv.prod, sourcemaps.init())) // Add sourcemap if not production mode
        .pipe(uglify())
        .pipe(gulpif(!argv.prod, sourcemaps.write('.'))) // Add sourcemap if not production mode
        .pipe(gulp.dest(destDir + '/js/'));
});

gulp.task('reload-page', function () {
});

//  [11.1] csscomb corrects styles in source *.less files
gulp.task('csscomb', function () {  // csscomb corrects styles in source *.less files
    return gulp.src('styles/*.less')
        .pipe(csscomb().on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

//  [11.2] JSCS corrects styles in source *.js files
gulp.task('jscs', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(jscs({
            fix: true,
            configPath: '.jscs.json'
        }).on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

//  [11.3] JSHint task shows errors
gulp.task('jshint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//  [11.4] htmlhint corrects styles in source *.html files
gulp.task('htmlhint', function () {
    return gulp.src(['**/*.html','!./node_modules/**','!./libs/**'])
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});

//  [12] html minification
gulp.task('htmlmin', function () {
    return gulp.src(['**/*.html','!./node_modules/**','!./libs/**'])
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(destDir));
});

//  [16] Style tasks runs all code style tasks
gulp.task('style', ['jscs', 'htmlhint', 'csscomb']);

//  End codestyle
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
    return this;
}
