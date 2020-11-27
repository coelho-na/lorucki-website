// PATHS //////
const sassFolder = "./src/sass/**/*.scss";
const sassSRC = "./src/sass/style.scss";
const folderDist = "./dist/css/";
const htmlPath = "./index.html";

const cssComp = "./dist/css/style.css";

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
exports.default = watchForChanges;
