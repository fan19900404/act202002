/* eslint-disable no-underscore-dangle */
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
    /** 在部分浏览器中，设置fontSize只会，实际1rem不等于fontSize，所以这里多一个判断，获取实际大小值 */
    const div = document.createElement('div');
    div.style = 'height:1rem;width:1rem';
    document.body.appendChild(div);
    if (Math.abs(fontSize - div.offsetHeight) > 2) {
      fontSize = (fontSize * fontSize) / div.offsetHeight;
      if (fontSize > 100) {
        fontSize = 100;
      }
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
    document.body.removeChild(div);
  };
  flexBox();
  window.addEventListener('resize', flexBox);
}());

if (!window.tm) {
  window.tm = {};
}

window.tm.getQuery = () => {
  const query = window.location.search.slice(1);
  if (!query) return {};
  const o = {};
  return (
    query.split('&').forEach((e) => {
      const t = e.split('=');
      const n = t[0];
      const i = t[1];
      o[n] = i;
    }),
    o
  );
};

window.tm.getAjaxUrl = (e) => {
  const t = /^http/g.test(e) ? '' : 'http://act.baoshixingqiu.com';
  const n = window.tm.getQuery();
  return t + e + (e.indexOf('?') > 0 ? '&' : '?') + $.param(n);
};

window.tm.isIOS = () => window.tm.getQuery().from === 'ios';

window.tm.jump2app = (e) => {
  try {
    if (window.Android && window.Android._jumpway) {
      window.Android._jumpway(e);
      return;
    }

    window[window.jsBridge].callHandler('jump', '{"jumpType":"'.concat(e, '"}'));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

window.tm.bitSeperator = (e) => {
  const t = Number(e);
  if (Number.isNaN(t)) return '0';
  const n = String(e).split('.');
  n[0] = n[0].replace(/\B(?=(\d{3})+$)/g, ',');
  return n.join('.');
};

(() => {
  const e = window.tm.getQuery().from === 'ios';
  const t = e ? 'WebViewJavascriptBridge' : 'TooMeeWebViewJavascriptBridge';
  window.jsBridge = t;
  function n() {
    window[t].init((env, cb) => {
      if (cb) {
        cb('初始化');
      }
    });
  }
  if (window[t]) {
    // eslint-disable-next-line no-unused-expressions
    e || n();
  } else if (e) {
    const i = document.createElement('iframe');
    i.style.display = 'none';
    i.src = 'https://__bridge_loaded__';
    document.documentElement.appendChild(i);
    setTimeout(() => {
      document.documentElement.removeChild(i);
    }, 0);
  } else {
    document.addEventListener(
      'TooMeeWebViewJavascriptBridgeReady',
      () => {
        n();
      },
      !1,
    );
  }
})();
