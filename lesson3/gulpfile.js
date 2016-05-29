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

gulp.task('default', ['css']);

gulp.task('copy-static', function () {
    return gulp.src(['images/**/*.{png,jpg,svg}', '*.html', '**.*.js'])
        .pipe( gulp.dest(destDir) );
});

gulp.task('bower', function () {
    return bower('libs');
});

gulp.task('css', function () {
    return gulp.src('styles/**/*.less')
        .pipe(concat('styles.css'))
        .pipe(less())
        .pipe(gulpif(argv.prod, minifyCss()))
        .pipe(gulp.dest(destDir));
});

gulp.task('reload-page', function () {
} );

//  Clears bin folder
gulp.task('clean', function (cb) {
    return gulp.src( destDir + '/*', { read: false } )
        .pipe( clean( { force: true } ) );
} );

//  Watches project files changes, automatically runs rebuilding of ...!!!
gulp.task('watch', function () {
    gulp.watch('**/*.@(less)', [ 'css' ] );
} );


//CODESTYLE
gulp.task('csscomb', function () {  // csscomb - поправить стили в исходных файлах.
    return gulp.src('styles/*.less')
        .pipe(csscomb().on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('htmlhint', function () {  // htmlhint — поправить стили в исходных файлах.
});

gulp.task('jscs', function () {  // JSCS — поправить стили в исходных файлах.
});

gulp.task('jshint', function () {  // JSHint — вывести ошибки.
});

gulp.task('style', function () {
});

//CODESTYLE//

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
    return this;
}

