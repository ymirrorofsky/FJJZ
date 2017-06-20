//app.js
var util = require('we7/resource/js/util.js');
App({
  data: {
    userInfo: false
  },
  onLaunch: function () {
  

  },
  onShow: function () { },
  onHide: function () { },
  onError: function (msg) { },
  //加载微擎工具类
  util: require('we7/resource/js/util.js'),
  //导航菜单，微擎将会自己实现一个导航菜单，结构与小程序导航菜单相同
  tabBar: {
    "color": "#292929",
    "selectedColor": "#09BB07",
    "backgroundColor": "#fff",
    "borderStyle": "black",
    "list": [{
      "pagePath": "pages/tab/service/service",
      "text": "服务下单",
      "iconPath": "images/tabbar/reservation.png",
      "selectedIconPath": "images/tabbar/reservation_in.png"
    }, {
      "pagePath": "pages/tab/evaluate/evaluate",
      "text": "客服评价",
      "iconPath": "images/tabbar/weiye.png",
      "selectedIconPath": "images/tabbar/weiye_in.png"
    }, {
      "pagePath": "pages/tab/center/center",
      "text": "会员中心",
      "iconPath": "images/tabbar/user.png",
      "selectedIconPath": "images/tabbar/user_in.png"
    }]
  },
  //用户信息，sessionid是用户是否登录的凭证
  userInfo: {
    sessionid: null,
  },
  //站点信息
  siteInfo: {
    'uniacid': '26', //公众号uniacid
    'acid': '26',
    'multiid': '8907',  //小程序版本id
    'version': '1.0.0',  //小程序版本
    'siteroot': 'https://xcx.weishang6688.com/app/index.php',  //站点URL
    'token': 'GkgxGUmn5qEIMTixu0ZiWn55Q52m5GwI' //将用于接口中的数据安全校验
  },

  getUserOpenId: function (callback) {
    var self = this
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo.openid) {
      callback(null, userInfo.openid)
    } else {
      //调用登录接口
      var userInfo = {
        'sessionid': '',
        'openid': '',
      };
      wx.login({
        success: function (res) {
          util.request({
            url: 'auth/session/openid',
            data: { code: res.code },
            cachetime: 0,
            success: function (session) {
              if (session.data.errno == 0) {
                userInfo.openid = session.data.data.openid;
                callback(null, userInfo.openid)
              } else {
                console.log('获取openid失败')
              }
            },
            fail: function (res) {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            },
          });
        },
        fail: function () {
          wx.showModal({
            title: '获取信息失败',
            content: '请允许授权以便为您提供给服务',
            success: function (res) {
              if (res.confirm) {
                util.getUserInfo();
              }
            }
          })
        }
      });
    }
  }
});