/**
 * 弹窗插件，为了星球制作的相关插件
 */
// eslint-disable-next-line no-unused-vars
class TmAlert {
  /**
   * 弹窗初始化
   * @param {string} select 弹窗插入的位置，默认为body
   */
  constructor(select = 'body') {
    /** 插件的id */
    this.id = `tmalert${Date.now()}`;

    // 创建弹窗dom
    const AlertDOM = document.createElement('div');
    AlertDOM.setAttribute('id', this.id);
    AlertDOM.setAttribute('class', 'tm-alert');
    // 插入到指定dom下
    const parent = document.querySelector(select);
    parent.appendChild(AlertDOM);
  }

  /**
   *
   * @param {object} option 弹窗参数
   * @param {string} option.title 弹窗标题，默认值：通知
   * @param {() => void} option.close 关闭时的回调
   * @param {() => void} option.ok 确定按钮的回调
   * @param {() => void} option.cancel 取消按钮的回调
   * @param {boolean} option.head 是否显示头部（默认：true 显示)
   * @param {boolean} option.okBtn 是否显示确定按钮（默认：true 显示）
   * @param {boolean} option.cancelBtn 是否显示取消按钮（默认：false 不显示）
   * @param {boolean} option.closeBtn 是否显示关闭按钮（默认：true 显示）
   * @param {string} option.okBtnText 确定按钮文案，默认：确定
   * @param {string} option.cancelBtnText 取消按钮文案，默认：取消
   * @param {string} option.content 需要在弹窗中央显示的html内容（允许使用html标签）
   * @param {string} option.mainCSS main框的CSS样式
   */

  show({
    title = '通知',
    close = () => null,
    ok = () => null,
    cancel = () => null,
    head = true,
    okBtn = true,
    cancelBtn = false,
    closeBtn = true,
    okBtnText = '确定',
    cancelBtnText = '取消',
    content = '',
    mainCSS = '',
  } = {}) {
    const dom = document.querySelector(`#${this.id}`);
    dom.style.display = 'block';

    /** 头部标题 */
    const headHtml = head
      ? `<div class="tm-alert-head d-flex">
      <div>${title}</div>
      ${closeBtn ? '<div class="tm-alert-close"></div>' : ''}
    </div>`
      : '';

    /** 取消按钮 */
    const cancelBtnHtml = cancelBtn
      ? `<div class="tm-alert-btn d-flex tm-alert-gray J_tm-alert-btn-cancel" >${cancelBtnText}</div>`
      : '';

    /** 确定按钮 */
    const okBtnHtml = okBtn
      ? `<div class="tm-alert-btn d-flex J_tm-alert-btn-ok">${okBtnText} </div>`
      : '';

    const tpl = `<div class="tm-alert-main" style="${mainCSS}">
      <div class="tm-alert-figure"></div>
      ${headHtml}
      <div class="tm-alert-body">
        ${content ? `<div class="tm-alert-content d-flex">${content}</div>` : ''}
        <div class="tm-alert-btns d-flex">
          ${cancelBtnHtml}
          ${okBtnHtml}
        </div>
      </div>
    </div>`;
    dom.innerHTML = tpl;
    // 监听关闭按钮
    const domClose = document.querySelector(`#${this.id} .tm-alert-close`);
    if (domClose) {
      domClose.addEventListener(
        'click',
        () => {
          this.close();
          close();
        },
        false,
      );
    }

    // 监听取消按钮按钮
    const domCancel = document.querySelector(`#${this.id} .J_tm-alert-btn-cancel`);
    if (domCancel) {
      domCancel.addEventListener(
        'click',
        () => {
          this.close();
          cancel();
        },
        false,
      );
    }

    // 监听确定按钮按钮
    const domOk = document.querySelector(`#${this.id} .J_tm-alert-btn-ok`);
    if (domOk) {
      domOk.addEventListener(
        'click',
        () => {
          this.close();
          ok();
        },
        false,
      );
    }
  }

  close() {
    const dom = document.querySelector(`#${this.id}`);
    dom.style.display = 'none';
  }
}
