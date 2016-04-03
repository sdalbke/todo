var gulp = require('gulp');
var uglify = require('gulp-uglify');
 
gulp.task('default', function() {
    // Uglify all client side scripts
    return gulp.src('client_src/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});
