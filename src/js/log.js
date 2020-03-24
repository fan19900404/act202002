$(() => {
  const tmAlert = new TmAlert('.main');
  let page = 0;
  let type = 0;
  let loading = false;
  const renderList = () => {
    // ajax请求列表
    const params = {
      type,
      limit: 20,
      page: page + 1,
    };
    $.get(
      window.tm.getAjaxUrl('/member/user/user-shop-exchange-log'),
      params,
      (res) => {
        loading = false;
        const data = res.data.info || [];
        page += 1;
        const html = etpl($('#tplList').html())({ data });
        $('#J_list').append(html);
        if ($('#J_list .li').length) {
          $('.none').hide();
        } else {
          $('.none').show();
        }
      },
      'json',
    );
  };

  // 监听滚动
  $('.main').on('scroll', (e) => {
    if (loading) {
      return;
    }
    const dom = e.target;
    if (dom.scrollHeight - 60 < dom.clientHeight + dom.scrollTop) {
      loading = true;
      renderList();
    }
  });

  // 监听tab切换
  // eslint-disable-next-line func-names
  $('#J_tabbar').on('click', 'div', function () {
    const ACTIVE_CLASS = 'active';
    const self = $(this);
    if (self.hasClass(ACTIVE_CLASS)) {
      return;
    }
    $(`#J_tabbar .${ACTIVE_CLASS}`).removeClass(ACTIVE_CLASS);
    self.addClass(ACTIVE_CLASS);
    type = +self.data('type');
    page = 0;
    $('#J_list').html('');
    setTimeout(renderList, 1000);
  });

  // 监听提取卡密
  // eslint-disable-next-line func-names
  $('.main').on('click', '.J_get', function () {
    const data = $(this).data('json');
    // 提取卡密的ajax
    $.get(
      window.tm.getAjaxUrl('/member/user/user-shop-exchange-card'),
      { id: data.id },
      (res) => {
        const { e_id: eId, e_pass: ePass } = res.data;
        tmAlert.show({
          title: '提取京东E卡卡密',
          cancelBtn: '确定',
          okBtnText: '复制',
          content: `<div style="font-size:0.28rem;color:#414156;line-height:0.48rem">
            <div>卡号：${eId}</div>
            <div>密码：${ePass}</div>
            <div style="line-height:0.32rem;margin-top:0.2rem;font-size:0.24rem;color: #B6B7C7;text-align: center;">
              有效期为自兑换成功日期起36个月
            </div>
          </div>`,
          ok() {
            window.tm.copy(
              `卡号：${eId} 密码：${ePass}`,
              () => window.tm.toast('复制成功'),
              () => window.tm.toast('复制失败，请自行手动复制'),
            );
          },
        });
      },
      'json',
    );
  });

  const init = () => {
    $('#J_tabbar div')
      .eq(0)
      .click();
  };

  init();
});
