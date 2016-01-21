# Adapted from http://pem-musing.blogspot.com/2014/02/a-gulp-of-coffee-your-gulpfile-in.html

# Load all required libraries.
gulp        = require 'gulp'
sass        = require 'gulp-ruby-sass'
prefix      = require 'gulp-autoprefixer'
cssmin      = require 'gulp-cssmin'
coffee      = require 'gulp-coffee'
jade        = require 'gulp-jade'
minifyHTML  = require 'gulp-minify-html'
svgmin      = require 'gulp-svgmin'
watch       = require 'gulp-watch'
browserSync = (require 'browser-sync').create()
gutil       = require('gulp-util')

gulp.task 'serve', () ->
  browserSync.init
      server:
          baseDir: "www/"
  (gulp.watch "www/*").on "change", browserSync.reload
  (gulp.watch "www/css/*").on "change", browserSync.reload
  (gulp.watch "www/js/*").on "change", browserSync.reload

# Create your CSS from Sass, Autoprexif it to target 99%
#  of web browsers, minifies it.
gulp.task 'css', ->
  sass('app/css/index.sass')
  .pipe(gulp.dest 'www/css')

gulp.task 'coffee', ->
  gulp.src 'app/coffee/*.coffee'
  .pipe (coffee({bare:true}).on 'error', gutil.log)
  .pipe(gulp.dest 'www/js')

# Create you HTML from Jade, Adds an additional step of
#  minification for filters (like markdown) that are not
#  minified by Jade.
gulp.task 'html', ->
  gulp.src 'app/*.jade'
    .pipe jade()
    .pipe minifyHTML()
    .pipe gulp.dest 'www/'

# Default task call every tasks created so far.
gulp.task 'default', ['watch', 'serve', 'coffee', 'css', 'html']
  
gulp.task 'watch', ->
  gulp.watch 'app/coffee/*', ['coffee']
  gulp.watch 'app/css/*', ['css']
  gulp.watch 'app/*.jade', ['html']
