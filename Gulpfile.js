var gulp        = require('gulp');
var minifyCss   = require('gulp-minify-css');
var coffee      = require('gulp-coffee');
var sass        = require('gulp-sass');
var notify      = require('gulp-notify');
var browserSync = require('browser-sync');
var preprocess = require('gulp-preprocess');
var flatten = require('gulp-flatten');
var reload      = browserSync.reload;


// configuring paths

var paths = {

    html:['index.html'],
    views:['resources/views/*.html', 'resources/views/partials/*.html'],
    css:['resources/sass/jqm-custom.scss'],
    script:['resources/coffee/**/*.coffee']
};



// Process CSS into SASS and notify on error 

gulp.task('sass', function(){
    return gulp.src(paths.css)
        .pipe(sass({ errLogToConsole: false, }))
        .on('error', function(err) {
            notify().write(err);
            this.emit('end');
        })
        .pipe(minifyCss())
        .pipe(gulp.dest('app/css'))
        .pipe(reload({stream:true}));
});


// Javascrit task

gulp.task('scripts', function(){
    return gulp.src(paths.script)
        .pipe(coffee())
        .pipe(gulp.dest('app/js'))
        .pipe(reload({stream:true}));

});


// HTML tasks and view processing

gulp.task('html', function(){
    gulp.src(paths.html)
    .pipe(reload({stream:true}));
});


//Preprocess views and partials

gulp.task('views', function() {
  gulp.src('./resources/views/index.html')
    .pipe(preprocess({context: { NODE_ENV: 'production', DEBUG: true}})) //To set environment variables in-line 
    .pipe(gulp.dest('app'))
});




// Browser-Sync Tasks with app as base directory

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "app",
            directory: false
        },
        port: 8080,
        open: true,
        notify: false
    });
});



// Watch all the tasks and perform reload on any changes to keep browser up-to-date

gulp.task('watcher',function(){
    gulp.watch(paths.css, ['sass']).on('change', reload); 
    gulp.watch(paths.script, ['scripts']).on('change', reload); 
    gulp.watch(paths.html, ['html']).on('change', reload); 
    gulp.watch(paths.views, ['views']).on('change', reload);  

});




gulp.task('default', ['watcher',  'browserSync']);