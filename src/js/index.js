/* 动画载入 */
(() => {
  const { Downloader, Parser, Player } = SVGA;
  /** 默认调用 WebWorker 解析，可配置 new Parser({ disableWorker: true }) 禁止 */
  const downloader = new Downloader();
  /** 解析 */
  const parser = new Parser();
  /** 动画执行 */
  const player = new Player('#svga');

  downloader
    .get('../lib/svga.svga')
    .then((fileData) => parser.do(fileData))
    .then((svgaData) => {
      player.set({
        loop: 0,
        fillMode: 'forwards',
      });
      player.mount(svgaData).then(() => {
        player.start();
      });
    });
})();
/* 载入页面 */
$(() => {
  /** 格式化红钻总数 */
  const farmatNum = (num) => {
    let n = String(num);
    if (n.length > 8) {
      // 超过8位数，改为万
      n = `${n.slice(0, -4).replace(/\B(?=(\d{3})+$)/g, 'd')}w`;
    } else {
      n = n.replace(/\B(?=(\d{3})+$)/g, 'd');
    }
    return n;
  };
  /** 渲染总数 */
  const renderTotal = (num) => {
    const html = farmatNum(num)
      .split('')
      .map((v) => `<div class="head-total-num-${v}"></div>`);
    $('#J_total').html(html);
  };

  let t = null;

  /**
   * 倒计时
   * @param {number} diffTime 与服务器的时间差（毫秒）
   */
  const downTime = (diffTime) => {
    const now = Date.now() + diffTime;
    const today = new Date(now);
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const end = +new Date(year, month, day + 1);
    const $dom = $('#J_time');

    const dt = () => {
      clearTimeout(t);
      let time = end - (Date.now() + diffTime);
      if (time < 0) {
        // 如果不刷新页面，那么倒计时停留在00:00:00
        time = 0;
      }
      const timeStr = new Date(time).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/g, '$1');
      $dom.html(timeStr);
      t = setTimeout(dt, 1e3);
    };

    dt();
  };

  // 请求详细信息
  $.get(
    window.tm.getAjaxUrl('/may/march-red-diamond/index'),
    (res) => {
      const { data } = res;

      // 执行渲染总额
      renderTotal(data.platfrom_red_diamond);
      // 渲染期数
      $('#J_period').html(data.period_member);
      // 执行倒计时
      downTime(data.end_time * 1e3 - Date.now());

      // 渲染用户信息
      const tplUser = etpl($('#tplUser').html());
      $('#J_user').html(
        tplUser({
          data: {
            userTotol: window.tm.bitSeperator(data.user_red_diamond),
            ratio: +(data.user_percentage * 100).toFixed(2),
            num: data.user_expect_red_diamod,
          },
        }),
      );

      // 渲染用户完成进度
      const tplProgress = etpl($('#tplProgress').html());
      // 1000万
      const progress = Math.min(+(data.user_red_diamond / 1e5).toFixed(2), 100);
      $('#J_progress').html(
        tplProgress({
          data: {
            ratio: progress,
            ready: progress >= 100,
          },
        }),
      );

      // 渲染排行榜
      const tplRank = etpl($('#tplRank').html());
      $('#J_rank').html(
        tplRank({
          data: data.rank.rank.map((v) => ({
            rank: v.rank,
            pic: v.headimg === '--' ? '' : `//img.baoshixingqiu.com/${v.headimg}`,
            name: v.nickname,
            award: window.tm.bitSeperator(v.red_diamond || '--'),
          })),
        }),
      );

      // data.first_come = {
      //   // 用户第一次进此字段存在
      //   period: 20, // 昨日期数
      //   date: '2020-02-20',
      //   all_red_diamond: 36191026, // 昨日全星球累计
      //   profit_diamond: 1010000, // 昨日用户单期累计
      //   point: 0.2791, // 占比
      //   red_diamond: 139550, // 获得奖励红钻
      // };

      // 渲染昨日战况
      if (data.first_come) {
        const tplAlertFirst = etpl($('#tplAlertFirst').html());
        $('#J_alert_first').html(
          tplAlertFirst({
            data: {
              period: data.first_come.period,
              date: data.first_come.date,
              all_red_diamond: window.tm.bitSeperator(data.first_come.all_red_diamond),
              profit_diamond: window.tm.bitSeperator(data.first_come.profit_diamond),
              point: +(data.first_come.point * 100).toFixed(2),
              red_diamond: window.tm.bitSeperator(data.first_come.red_diamond),
              ready: +data.first_come.profit_diamond >= 1e7,
            },
          }),
        );
        $('#J_alert_first').show();
      }
    },
    'json',
  );
});

$(() => {
  // 跳转到红钻大厅
  $('.main').on('click', '#gotored', () => {
    window.tm.jump2app(5);
  });
  // 刷新按钮
  $('.main').on('click', '#J_refresh', () => {
    window.history.go(0);
  });
  // 关闭弹窗
  $('.main').on('click', '.alert-close', () => {
    $('.alert').hide();
  });
  // 打开规则弹窗
  $('.main').on('click', '#J_btn_rule', () => {
    $('#J_alert_rule').show();
  });
  // 打开记录弹窗
  $('.main').on('click', '#J_log', () => {
    $.get(
      window.tm.getAjaxUrl('/may/march-red-diamond/user-red-diamond-log'),
      (res) => {
        const { data } = res;
        // const data = [
        //   {
        //     period: 19,
        //     date: '2020-02-20',
        //     all_red_diamond: '36191026',
        //     profit_diamond: 1000000000,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 18,
        //     date: '2020-02-19',
        //     all_red_diamond: '66665',
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 17,
        //     date: '2020-02-18',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: '0.0000',
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 16,
        //     date: '2020-02-17',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 15,
        //     date: '2020-02-16',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 14,
        //     date: '2020-02-15',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 13,
        //     date: '2020-02-14',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 12,
        //     date: '2020-02-13',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 11,
        //     date: '2020-02-12',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 10,
        //     date: '2020-02-11',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 9,
        //     date: '2020-02-10',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 8,
        //     date: '2020-02-09',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 7,
        //     date: '2020-02-08',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 6,
        //     date: '2020-02-07',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 5,
        //     date: '2020-02-06',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 4,
        //     date: '2020-02-05',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 3,
        //     date: '2020-02-04',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 2,
        //     date: '2020-02-03',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        //   {
        //     period: 1,
        //     date: '2020-02-02',
        //     all_red_diamond: 0,
        //     profit_diamond: 0,
        //     point: 0,
        //     red_diamond: 0,
        //   },
        // ];

        const tplAlertLog = etpl($('#tplAlertLog').html());
        $('#J_alert_log').html(
          tplAlertLog({
            data: data.map((v) => ({
              period: v.period,
              date: v.date,
              all_red_diamond: window.tm.bitSeperator(v.all_red_diamond),
              profit_diamond: window.tm.bitSeperator(v.profit_diamond),
              point: +(v.point * 100).toFixed(2),
              red_diamond: window.tm.bitSeperator(v.red_diamond),
              ready: +v.profit_diamond >= 1e7,
            })),
          }),
        );
        $('#J_alert_log').show();
      },
      'json',
    );
  });
});
