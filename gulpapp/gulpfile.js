let gulp = require('gulp');
// let    sass = require('gulp-sass'); //Подключаем Sass пакет
let imagemin =require('gulp-imagemin');


    
// gulp.task('sass', function () { // Создаем таск "sass"
//     return gulp.src('app/sass/main.sass') // Берем источник
//         .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
//         .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
// });



gulp.task('compress', function() {
    gulp.src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
  });
  