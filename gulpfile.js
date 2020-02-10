const {
  src, dest, parallel, series, watch,
} = require('gulp');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const connect = require('gulp-connect'); // 开发服务器
const uglify = require('gulp-uglify'); // 混淆压缩js
const minCss = require('gulp-clean-css'); // 压缩css
const rev = require('gulp-rev'); // 生成版本号
const revCollector = require('gulp-rev-collector'); // 替换版本号
const clean = require('gulp-clean'); // 清理目录
const htmlmin = require('gulp-htmlmin'); // 压缩html

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
const TaskBuildClean = () => src(buildPath, { allowEmpty: true }).pipe(clean());
/** 复制lib内容到构建目录下 */
const TaskBuildLib = () => src(`${scrPath}lib/*.*`, { allowEmpty: true }).pipe(
  dest(`${buildPath}lib/`, { allowEmpty: true }),
);
/** 编译js，并且混淆压缩，复制到构建目录下 */
const TaskBuildJS = () => src(`${scrPath}js/*.js`, { allowEmpty: true })
  .pipe(babel())
  .pipe(uglify())
  .pipe(rev())
  .pipe(dest(`${buildPath}js/`, { allowEmpty: true }))
  .pipe(rev.manifest()) // - 生成一个rev-manifest.json
  .pipe(dest(`${buildPath}js`));
/** 替换js中的img为hash命名 */
const revJsImg = () => src([`${buildPath}img/rev-manifest.json`, `${buildPath}js/*.js`])
  .pipe(revCollector())
  .pipe(dest(`${buildPath}js/`));
/** css自动增加前缀混淆压缩后复制到构建目录 */
const TaskBuildCSS = () => src(`${scrPath}css/*.css`, { allowEmpty: true })
  .pipe(autoprefixer({ cascade: true }))
  .pipe(minCss())
  .pipe(rev())
  .pipe(dest(`${buildPath}css/`))
  .pipe(rev.manifest()) // - 生成一个rev-manifest.json
  .pipe(dest(`${buildPath}css`));
/** 替换css中的img为hash命名 */
const revCssImg = () => src([`${buildPath}img/rev-manifest.json`, `${buildPath}css/*.css`])
  .pipe(revCollector())
  .pipe(dest(`${buildPath}css/`));
/** img自动复制到开发目录 */
const TaskBuildImg = () => src(`${scrPath}img/**`, { allowEmpty: true })
  .pipe(rev())
  .pipe(dest(`${buildPath}img/`))
  .pipe(rev.manifest()) // - 生成一个rev-manifest.json
  .pipe(dest(`${buildPath}img`));

/** html自动复制到开发目录 */
const TaskBuildHTML = () => src([`${buildPath}**/rev-manifest.json`, `${scrPath}*.html`], { allowEmpty: true })
  .pipe(revCollector())
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(dest(buildPath));

/** 开发任务 */
const devTask = series(
  parallel(TaskDevLib, TaskDevJS, TaskDevCSS, TaskDevImg, TaskDevHTML),
  parallel(TaskDevWatch, TaskDevServe),
);
/** 构建任务 */
const buildTask = series(
  TaskBuildClean,
  TaskBuildImg,
  TaskBuildCSS,
  revCssImg,
  TaskBuildLib,
  TaskBuildJS,
  revJsImg,
  TaskBuildHTML,
);

exports.default = buildTask;
exports.dev = devTask;
exports.build = buildTask;
