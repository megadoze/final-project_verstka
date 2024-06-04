import gulp, { parallel } from "gulp";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import rename from "gulp-rename";
import { deleteAsync } from "del";
import svgSprite from "gulp-svg-sprite";
import webpack from "webpack-stream";
import htmlmin from "gulp-htmlmin";
import browserSync from "browser-sync";

const sass = gulpSass(dartSass);

function server() {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
}

function watch() {
  gulp.watch(
    [
      "src/assets/fonts/*",
      "src/assets/images/**/*",
      "!src/assets/images/!(icons)/*",
    ],
    copy
  );
  gulp.watch(["src/style.scss", "src/styles/**/*"], styles);
  gulp.watch(["src/assets/images/icons/*"], svg);
  gulp.watch(["src/*.js"], scripts);
  gulp.watch(["src/*.html"], html);
}

function html() {
  return gulp
    .src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function scripts() {
  // 1. найти все js файлы
  // 2. переписать новый синтаксис с учтом бразуерной поддержки
  // 3. минифицировать код
  // 4. переименовать, добавить суффикс min
  // 5. сохранить результат в новый файл
  return gulp
    .src("src/app.js")
    .pipe(
      webpack({
        mode: "production",
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", { targets: "defaults" }]],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function styles() {
  // 1. найти scss files
  // 2. преобразовать код в css
  // 3. сохранить результат
  return gulp
    .src("src/style.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(["last 15 version"]))
    .pipe(cleanCSS())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream());
}

function copy() {
  return gulp
    .src(
      [
        "src/assets/fonts/*",
        "src/assets/images/!(icons)/**/*",
        "src/assets/images/!(icons)",
      ],
      {
        base: "src",
        encoding: "binary",
      }
    )
    .pipe(gulp.dest("dist", { encoding: "binary" }))
    .pipe(browserSync.stream({ once: true }));
}

function clean() {
  return deleteAsync(["dist/**"]);
}

function svg() {
  return gulp
    .src("src/assets/images/icons/*.svg")
    .pipe(svgSprite({ mode: { stack: { sprite: "../sprite.svg" } } }))
    .pipe(gulp.dest("src/assets/images"));
}

export { svg };

export { styles, clean, copy, scripts, html, server, watch };

export let build = gulp.series(clean, html, styles, scripts, copy);

export default gulp.series(
  clean,
  parallel(html, styles, scripts, copy),
  parallel(server, watch)
);
