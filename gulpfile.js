const {
  src, dest, parallel, series,
} = require('gulp');
const babel = require('gulp-babel');

/** 源码目录 */
const scrPath = 'src/';
/** 开发目录 */
const devPath = 'dev/';
/** 构建发布目录 */
const buildPath = 'dist/';

/** 复制lib到开发目录 */
const TaskDevLib = () => src(`${scrPath}lib/*.*`, { allowEmpty: true }).pipe(dest(`${devPath}lib/`, { allowEmpty: true }));
/** 转换js后复制到开发目录 */
const TaskDevJS = () => src(`${scrPath}js/*.js`, { allowEmpty: true })
  .pipe(babel())
  .pipe(dest(`${devPath}js/`, { allowEmpty: true }));

/** 开发任务 */
const devTask = parallel(TaskDevLib, TaskDevJS);
/** 构建任务 */
const buildTask = () => null;

exports.default = buildTask;
exports.dev = devTask;
exports.build = buildTask;
