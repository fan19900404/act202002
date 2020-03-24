/* eslint-disable no-nested-ternary */
/* eslint-disable func-names */
$(() => {
  /**
   * RAS加密交易密码
   * @param {string} pwd 需要加密的交易密码
   */
  const encryption = (pwd) => {
    const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFOYti3ibW46EXAKXeLNHeOE7t
O6JHTQGRlt00nnF5gSPrMo75VGMJBIZ9yHPgJnK6TaMiKja7AhTH3g1rrIjfFBiL
86Gy11e3AS7ZYC4cDt73Y7T73pRza6qLZOhoXadP0T1m/r4gE1yjkCF2CHlFr2b4
cs70Ba1Gpcy+QdP9wQIDAQAB
-----END PUBLIC KEY-----`;
    // Encrypt with the public key...
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    /** 加密后的密文 */
    const encrypted = encrypt.encrypt(pwd);
    /** php的加号要提前处理 */
    return encrypted; // ajax会转不需要自己在encodeURI了 encodeURI(encrypted).replace(/\+/g, '%2B');
  };

  const tmAlert = new TmAlert('.main');
  const Data = {};
  // 渲染用户信息
  const renderUser = (callBack) => {
    $.get(
      window.tm.getAjaxUrl('/member/user/user-shop-info'),
      (res) => {
        const { code, msg, data } = res;
        if (code === 0) {
          Data.blueDiamond = data.blueDiamond;
          // 是否绑定手机
          Data.phone = data.phone;
          // 是否实名
          Data.is_auth_id = data.is_auth_id;
          // 是否还有q币兑换次数
          Data.is_exchangeTime_q = data.is_exchangeTime_q;
          // 是否还有京东E卡兑换次数
          Data.is_exchangeTime_e = data.is_exchangeTime_e;
          // 是否已经设置交易密码
          Data.isPassword = data.is_trade_password_has;
          // q币列表
          Data.qGoods = data.qGoods || [];
          // E卡列表
          Data.eGoods = data.eGoods || [];
          // 上一次充值的qq号码
          Data.qq = data.qq;
          const tpl = etpl($('#tplUser').html());
          $('#J_user').html(
            tpl({
              data: {
                blueDiamond: window.tm.bitSeperator(data.blueDiamond),
                rmb: Math.floor(data.blueDiamond / 1e4),
              },
            }),
          );
          if (callBack) {
            callBack();
          }
        } else {
          window.tm.toast(msg);
        }
      },
      'json',
    );
  };

  /** 渲染Q币 */
  const renderQ = () => {
    const data = {
      list: Data.qGoods,
      phone: Data.phone,
      qq: Data.qq,
    };
    const html = etpl($('#tplQ').html())({ data });
    $('#J_tabcontent').html(html);
  };

  /** 渲染京东e卡 */
  const renderE = () => {
    const data = { list: Data.eGoods, phone: Data.phone };
    const html = etpl($('#tplE').html())({ data });
    $('#J_tabcontent').html(html);
  };

  // 更新相应页面数据
  const updatedPage = () => {
    // 更新相应页面数据
    renderUser(() => {
      const isQQ = !!$('.J_input-qq').length;
      if (isQQ) {
        renderQ();
      } else {
        renderE();
      }
    });
  };

  /** 发送交易密码 */
  const sendPwd = () => {
    /** 激活的class名称 */
    const ACTIVE_CLASS = 'active';
    // 是否为兑换q币
    const isQQ = !!$('.J_input-qq').length;
    const tipHtml = isQQ
      ? `<div class="pwd-title">
      <div>充值QQ号：<span>${$('.J_input-qq').val()}</span></div>
      <div>兑换额度：<span>${$(`.goods-li.${ACTIVE_CLASS}`).data('json').value} Q币</span></div>
    </div>`
      : '';
    // 显示交易密码输入弹窗
    tmAlert.show({
      title: '请输入交易密码',
      content: `<div class="pwd">
        ${tipHtml}
        <div class="pwd-tip">请输入当前账号的交易密码</div>
        <div class="pwd-box d-flex">
          <input type="tel"/>
          <div class="pwd-num ${ACTIVE_CLASS}"></div>
          <div class="pwd-num"></div>
          <div class="pwd-num"></div>
          <div class="pwd-num"></div>
          <div class="pwd-num"></div>
          <div class="pwd-num"></div>
        </div>
        <div class="pwd-forget J_pwd-forget">忘记密码？</div>
      </div>`,
      okBtn: false,
      mainCSS: 'width:5.9rem;top:2.5rem;transform: translate(-50%,0);',
    });

    setTimeout(() => {
      /** 打开后默认，监听focus,保证光标永远在最后 */
      $('.pwd input').on('focus', function () {
        const inpObj = $(this)[0];
        if (inpObj.setSelectionRange) {
          inpObj.setSelectionRange(0, inpObj.value.length);
        }
      });
      /** 打开后默认首位选中 */
      $('.pwd input')[0].focus();
      // 监听输入事件
      $('.pwd input').on('keyup', function (e) {
        const val = e.target.value;

        /** 去除密码中的非数字内容 */
        const nowVal = val.substring(0, 6).replace(/[^\d]/g, '');
        $(this).val(nowVal);
        const len = nowVal.length;
        // 统一去除active与内容
        $('.pwd-box .pwd-num')
          .removeClass(ACTIVE_CLASS)
          .html('');
        $('.pwd-box .pwd-num').each(function (index) {
          if (index < len) {
            $(this).html('<div class="dot"></div>');
          } else if (index === len) {
            $(this).addClass(ACTIVE_CLASS);
          }
        });

        if (len >= 6) {
          // 发送ajax到后端，进行验证
          /** 加密后的密码 */
          const pwd = encryption(nowVal.substring(0, 6));
          const params = {
            id: $('.goods-li.active').data('json').id,
            code: pwd,
          };
          if (isQQ) {
            params.qq_num = $('.J_input-qq').val();
          }
          // 清空数字(防止问题)
          $('.pwd input').val('');
          $.get(
            window.tm.getAjaxUrl('/member/user/user-shop-exchange'),
            params,
            (res) => {
              const { code, msg, data } = res;

              if (code === 0) {
                // 交易成功;
                tmAlert.show({
                  head: false,
                  content: `<div class="result">
                <div class="result-title">兑换成功</div>
                <div class="result-tip">请耐心等待审核</div>
              </div>`,
                });
                // 更新页面数据，防止无法拦截超过上限问题
                updatedPage();
              } else if (code === 507) {
                // 如果交易密码错误
                $('.pwd .pwd-tip')
                  .addClass('pwd-error')
                  .html(`交易密码错误，还有${data.num}次机会`);

                // 重置密码框样式
                $('.pwd-box .pwd-num')
                  .removeClass(ACTIVE_CLASS)
                  .html('')
                  .eq(0)
                  .addClass(ACTIVE_CLASS);
              } else if (code === 506) {
                //  交易密码已经锁定
                tmAlert.show({
                  title: '交易密码已锁定',
                  content:
                    '<div style="font-size: 0.28rem;color: #414156;line-height:0.48rem;text-align: center;">交易密码已被锁定，<br>请10分钟后再试。</div>',
                  cancelBtnText: '忘记密码',
                  cancel() {
                    // 跳转到忘记密码
                    window.tm.jump2app('36');
                  },
                  cancelBtn: true,
                  okBtnText: '我知道了',
                });
              } else {
                window.tm.toast(msg);
              }
            },
            'json',
          );
        }
      });
    }, 0);
  };

  // 监听 忘记密码 按钮
  $('.main').on('click', '.J_pwd-forget', () => {
    window.tm.jump2app('36');
  });

  // 切换兑换商品
  // eslint-disable-next-line func-names
  $('#J_tabcontent').on('click', '.goods-li', function () {
    /** 激活时的class名称 */
    const ACTIVE_CLASS = 'active';
    $('#J_tabcontent .active').removeClass(ACTIVE_CLASS);
    $(this).addClass(ACTIVE_CLASS);
  });

  // tab切换到Q币
  // eslint-disable-next-line func-names
  $('#J_tabbar').on('click', '.bar-q,.bar-e', function () {
    const self = $(this);
    /** 激活时的class名称 */
    const ACTIVE_CLASS = 'active';
    if (self.hasClass(ACTIVE_CLASS)) {
      return;
    }

    $('#J_tabbar .active').removeClass(ACTIVE_CLASS);
    self.addClass(ACTIVE_CLASS);
    // tab内容渲染
    if (self.hasClass('bar-q')) {
      renderQ();
    } else {
      renderE();
    }
  });

  // 前往绑定手机号码
  $('#J_tabcontent').on('click', '.J_goods-phone', () => {
    // 缺少跳转到
    window.tm.jump2app('34');
  });

  // 前往客服
  $('#J_tabcontent').on('click', '.J_server', () => {
    // 缺少跳转到
    window.tm.jump2app('37');
  });

  // 确定兑换按钮相关逻辑
  $('#J_tabcontent').on('click', '.J_goods-ok', () => {
    // 是否为兑换q币
    const isQQ = !!$('.J_input-qq').length;
    // 检测是否输入qq号
    if (isQQ) {
      const qq = $('.J_input-qq').val();
      if (!qq) {
        window.tm.toast('请输入要充值的QQ号');
        return;
      }
    }
    // 检测是否选择了额度
    if ($('.goods-li.active').length === 0) {
      window.tm.toast('请选择要兑换的额度');
      return;
    }
    // 检测是否实名
    if (!Data.is_auth_id) {
      tmAlert.show({
        title: '兑换提示',
        content: '兑换需要认证身份信息，是否去认证',
        okBtnText: '去认证',
        ok() {
          // 跳转到实名认证
          window.tm.jump2app('35');
        },
      });
      return;
    }

    // 检测是否设置交易密码
    if (!Data.isPassword) {
      tmAlert.show({
        title: '交易密码设置提示',
        content:
          '<div style="font-size: 0.28rem;color: #414156;">兑换需要交易密码，<br>请先去设置吧～</div>',
        okBtnText: '去设置',
        ok() {
          // 跳转到交易密码
          window.tm.jump2app('36');
        },
      });
      return;
    }

    // 如果是q币，判断q币是否还有兑换次数
    if (isQQ && !Data.is_exchangeTime_q) {
      window.tm.toast('今日兑换Q币次数已用完，<br>请尝试其他兑换方式或明日再来吧');
      return;
    }

    // 如果是e卡，判断e卡是否还有兑换次数
    if (!isQQ && !Data.is_exchangeTime_e) {
      window.tm.toast('今日兑换京东E卡次数已用完，<br>请尝试其他兑换方式或明日再来吧');
      return;
    }

    // 判断蓝钻数量
    const blue = +$('.goods-li.active').data('json').blue;
    if (+Data.blueDiamond < blue) {
      tmAlert.show({
        head: false,
        content: `<div class="result result-fail">
            <div class="result-title">兑换失败</div>
            <div class="result-tip">当前账户蓝钻不足</div>
          </div>`,
      });
      return;
    }
    sendPwd();
  });

  $('.main').on('click', '#J_gotoLog', () => {
    window.location.href = `./log.html${window.location.search}`;
    // window.tm.jump2app('16');
  });

  /** 监听页面显示 */
  const visibility = () => {
    const hiddenProperty = 'hidden' in document
      ? 'hidden'
      : 'webkitHidden' in document
        ? 'webkitHidden'
        : 'mozHidden' in document
          ? 'mozHidden'
          : null;

    const visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');

    const onVisibilityChange = function () {
      if (!document[hiddenProperty]) {
        updatedPage();
      }
    };

    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
  };

  const init = () => {
    renderUser(() => {
      // 应为e卡未好的原因，暂时隐藏e卡
      // $('.bar-q').click();
      renderQ();
    });
    visibility();
  };
  init();
});
