/* eslint-disable func-names */

/**
 * 本方法用于计算页面根 rem 的大小
 */
(function init() {
  const flexBox = () => {
    let fontSize = document.documentElement.clientWidth / 7.5;
    if (fontSize > 100) {
      fontSize = 100;
    }
    document.documentElement.style.fontSize = `${fontSize}px`;

    function flexTest() {
      if (!document.body) {
        setTimeout(flexTest, 1000);
        return;
      }
      /** 在部分浏览器中，设置fontSize只会，实际1rem不等于fontSize，所以这里多一个判断，获取实际大小值 */
      const div = document.createElement('div');
      div.setAttribute('style', 'height:1rem;width:1rem');
      document.body.appendChild(div);
      if (Math.abs(div.offsetHeight - fontSize) > 3) {
        fontSize = (fontSize * fontSize) / div.offsetHeight;
        document.documentElement.style.fontSize = `${fontSize}px`;
      }
      document.body.removeChild(div);
    }
    flexTest();
  };
  flexBox();
  window.addEventListener('resize', flexBox);
}());
(function () {
  if (!window.tm) {
    window.tm = {};
  }
  /**
   * 获取url上的参数
   */
  window.tm.getQuery = function () {
    const query = window.location.search.slice(1);
    if (!query) {
      return {};
    }
    const queryObj = {};
    query.split('&').forEach((v) => {
      // eslint-disable-next-line no-underscore-dangle
      const _a = v.split('=');
      const key = _a[0];
      const val = _a[1];
      queryObj[key] = val;
    });
    return queryObj;
  };
  /* 凭借ajax的url */
  window.tm.getAjaxUrl = function (url) {
    const base = /^http/g.test(url) ? '' : '//interface.baoshixingqiu.com';
    const query = window.tm.getQuery();
    return base + url + (url.indexOf('?') > 0 ? '&' : '?') + $.param(query);
  };
  window.tm.isIOS = function () {
    const query = window.tm.getQuery();
    return query.from === 'ios';
  };
  /**
   * 跳转到原生的页面
   * @param {string} type 跳转的类型
   */
  window.tm.jump2app = function (type) {
    try {
      // eslint-disable-next-line no-underscore-dangle
      if (window.Android && window.Android._jumpway) {
        // eslint-disable-next-line no-underscore-dangle
        window.Android._jumpway(type);
        return;
      }

      window[window.jsBridge].callHandler('jump', `{"jumpType":"${type}"}`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  /**
   * 千分号处理
   * @param {Number} num
   */
  window.tm.bitSeperator = (num) => {
    const n = Number(num);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(n)) {
      return '0';
    }

    const strNum = String(num).split('.'); // 处理小数
    strNum[0] = strNum[0].replace(/\B(?=(\d{3})+$)/g, ','); // 格式化正数部分

    return strNum.join('.'); // 合并正数+小数
  };

  /** 弹窗处理 */
  window.tm.toast = (text) => {
    // 1、创建构造器，定义好提示信息的模板
    const ToastTip = document.createElement('div');
    ToastTip.innerHTML = `<div class="d-toast d-flex"><div class="d-toast-tip">${text}</div></div>`;

    // 3、把创建的实例添加到body中
    document.body.appendChild(ToastTip);
    // 4.三秒后移除
    setTimeout(() => {
      document.body.removeChild(ToastTip);
    }, 3000);
  };

  // input自带的select()方法在苹果端无法进行选择，所以需要自己去写一个类似的方法
  // 选择文本。createTextRange(setSelectionRange)是input方法
  const selectText = (textbox, startIndex, stopIndex) => {
    textbox.setSelectionRange(startIndex, stopIndex);
    textbox.focus();
  };
  /**
   * 复制到剪切板的功能
   * @param {string} content 需要复制的内容
   * @param {() => null} success 成功后的回调
   * @param {() => null} error 失败后的回调
   */
  window.tm.copy = (content = '', success = () => null, error = () => null) => {
    // 不支持execCommand方法
    if (!document.execCommand) {
      error();
      return;
    }

    const oInput = document.createElement('input');
    oInput.value = content;
    oInput.readOnly = true;
    oInput.style.position = 'absolute';
    oInput.style.left = '-1000px';
    oInput.style.zIndex = '-1000';
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    selectText(oInput, 0, content.length);
    const result = document.execCommand('copy', false); // 执行浏览器复制命令
    document.body.removeChild(oInput);
    if (result) {
      success();
    } else {
      error();
    }
  };
}());

(function () {
  /** 调用app方法初始化函数 */
  function appInit() {
    const urlQuery = window.tm.getQuery();
    const isIOS = urlQuery.from === 'ios'; // 判断是否在ios中

    const jsBridgeReady = 'TooMeeWebViewJavascriptBridgeReady';
    const jsBridge = isIOS ? 'WebViewJavascriptBridge' : 'TooMeeWebViewJavascriptBridge';
    window.jsBridge = jsBridge; // 注册到全局
    const init = function () {
      window[jsBridge].init((msg, cb) => {
        if (cb) {
          cb('初始化');
        }
      });
    };

    if (window[jsBridge]) {
      if (!isIOS) {
        init(); // 安卓的需要init
      }
    } else if (isIOS) {
      const WVJBIframe = document.createElement('iframe');
      WVJBIframe.style.display = 'none';
      WVJBIframe.src = 'https://__bridge_loaded__';
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(() => {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
    } else {
      // 安卓需要特殊init
      document.addEventListener(
        jsBridgeReady,
        () => {
          init();
        },
        false,
      );
    }
  }

  /* app方法初始化 */
  appInit();
}());
