import gulp from 'gulp';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import minify from 'gulp-minify-css';
import uglify from 'gulp-uglify';
import rev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import imagemin from "gulp-imagemin";
import connect from "gulp-connect";
import del from 'del';

gulp.task('css', () => {
  return gulp.src('app/css/**/*.css')
    .pipe(autoprefixer({
      overrideBrowserslist: ['> 5%'],
      cascade: false
    }))
    .pipe(minify())
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'))
});

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(babel()) 
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rev())
    .pipe(gulp.dest('dist/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
});

gulp.task('pic', function () {
  return gulp.src('app/pic/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/pic'));
});

gulp.task('html', function() {
  return gulp.src(['rev/**/*.json', 'app/*.html'])
    .pipe(revCollector({
      replaceReved: true
      // dirReplacements: {
      //   'css': 'css',
      //   'js': 'js'
      // }
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('clear', function () {
  return del(['dist/*']);
});

gulp.task("reload", function () {
  return gulp.src('app/*.html')
    .pipe(connect.reload());
})

gulp.task('watch', function() {
  gulp.watch('app/*.html', gulp.series('html'));
  gulp.watch('app/css/**/*.css', gulp.series('css'));
  gulp.watch('app/js/**/*.js', gulp.series('js'));
  gulp.watch('dist/**/*', gulp.series('reload'));
});
 
gulp.task('connect', function () {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true
  });
});

gulp.task('default', gulp.series('clear', gulp.parallel('css', 'js', 'pic'), 'html'));

gulp.task('server', gulp.series('default', gulp.parallel('connect', 'watch')));