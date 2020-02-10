const {
  src, dest, parallel, series, watch,
} = require('gulp');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect');

/** 源码目录 */
const scrPath = 'src/';
/** 开发目录 */
const devPath = 'dev/';
/** 构建发布目录 */
const buildPath = 'dist/';

/**
 * 开发部分的
 */

/** 复制lib到开发目录 */
const TaskDevLib = () => src(`${scrPath}lib/*.*`, { allowEmpty: true })
  .pipe(dest(`${devPath}lib/`, { allowEmpty: true }))
  .pipe(connect.reload());
/** 转换js后复制到开发目录 */
const TaskDevJS = () => src(`${scrPath}js/*.js`, { allowEmpty: true })
  .pipe(babel())
  .pipe(dest(`${devPath}js/`, { allowEmpty: true }))
  .pipe(connect.reload());
/** css自动增加前缀后复制到开发目录 */
const TaskDevCSS = () => src(`${scrPath}css/*.css`, { allowEmpty: true })
  .pipe(autoprefixer({ cascade: true }))
  .pipe(dest(`${devPath}css/`))
  .pipe(connect.reload());
/** html自动复制到开发目录 */
const TaskDevHTML = () => src(`${scrPath}*.html`, { allowEmpty: true })
  .pipe(dest(devPath))
  .pipe(connect.reload());
/** img自动复制到开发目录 */
const TaskDevImg = () => src(`${scrPath}img/**`, { allowEmpty: true })
  .pipe(dest(`${devPath}img/`))
  .pipe(connect.reload());
/** 开发时的静态服务器 */
const TaskDevServe = () => {
  connect.server({
    root: devPath,
    livereload: true,
  });
};
/** 监听所有改变 */
const TaskDevWatch = () => {
  watch(`${scrPath}js/*.js`, TaskDevJS);
  watch(`${scrPath}css/*.css`, TaskDevCSS);
  watch(`${scrPath}*.html`, TaskDevHTML);
  watch(`${scrPath}img/**`, TaskDevImg);
};

/**
 * 构建部分
 */

/** 开发任务 */
const devTask = series(
  parallel(TaskDevLib, TaskDevJS, TaskDevCSS, TaskDevImg, TaskDevHTML),
  parallel(TaskDevWatch, TaskDevServe),
);
/** 构建任务 */
const buildTask = () => null;

exports.default = buildTask;
exports.dev = devTask;
exports.build = buildTask;
