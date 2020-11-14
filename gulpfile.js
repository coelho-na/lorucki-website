// PATHS //////
const sassFolder = "./src/sass/**/*.scss";
const sassSRC = "./src/sass/style.scss";
const folderDist = "./dist/css/";
const htmlPath = "./index.html";
const featurePath = "./features.html";
const docsPath = "./docs.html";
const cssComp = "./dist/css/style.css";
const htmlFiles = "./**/*.html";

//// PLUGINS //////
const { src, series, dest, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const mode = require("gulp-mode")();
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cleanCss = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const htmlMinify = require("gulp-html-minify");

////// WATCH FILES FOR CHANGES //////////

function watchForChanges() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./",
    },
  });

  watch(sassFolder, series(Sass, minifyCSS, cssInject));
  watch(htmlPath).on("change", browserSync.reload);
  watch(featurePath).on("change", series(htmlminify), browserSync.reload);
  watch(docsPath).on("change", series(htmlminify), browserSync.reload);
}

function htmlminify() {
  return src(htmlFiles).pipe(htmlMinify()).pipe(dest("./dist"));
}

///////  COMPILE SASS TO REGULAR CSS //////////////

function Sass() {
  return src(sassSRC)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest(folderDist));
}

/////// COMPRESS AND MINIFY SASS ALREADY COMPILED FOR SASS TASK//////

function minifyCSS() {
  return src(cssComp)
    .pipe(mode.development(sourcemaps.init()))
    .pipe(cleanCss({ compatibility: "ie8" }))
    .pipe(concat("style.css"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest(folderDist));
}

//////// INJECT STYLE DIRECTLY IN "style.min.css" /////

function cssInject() {
  return src(folderDist + "style.min.css").pipe(browserSync.stream());
}

exports.watchForChanges = watchForChanges;
exports.Sass = Sass;
exports.minifyCSS = minifyCSS;
exports.cssInject = cssInject;
exports.htmlminify = htmlminify;
exports.default = watchForChanges;
