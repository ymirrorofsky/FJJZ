// pages/tab/service/service.js
var app = getApp()
Page({
  data: {
    banner: [
      'http://img.zcool.cn/community/01acf15682a07b6ac7251bb644e597.jpg',
      'http://img.zcool.cn/community/01590358405483a801219c77e384b2.jpg',
      'http://img.zcool.cn/community/012cbb58099879a84a0d304fb763c1.jpg@900w_1l_2o_100sh.jpg'
    ],
    service: [
    ],
    userInfo: {},
    glo_is_load:true
  },
  onLoad: function (options) {
    this.getBanner();
    this.getService();

  },
  onPullDownRefresh: function () { 
    wx.showToast({
      icon:'loading',
      title: '正在加载'
    })
    this.getBanner();
    this.getService();
    setTimeout(function(){
      wx.stopPullDownRefresh()
      wx.hideToast()
    },1000)
   

  },
  //获取首页导航
  getBanner: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/slide',
      data: {
        m: 'fujin_jiazheng'
      },
      cachetime: 0,
      success: function (res) {

        if (res.data.errno == 0) {
          that.setData({
            banner: res.data.data
          })
        } else {
          failGo(res.data.message);
        }
        console.log(res)

      },
      fail: function () {
        failGo('请检查连接地址');
      }
    })
  },
  //获取首页服务
  getService: function () {
    var that = this;
    app.util.request({
      url: 'entry/wxapp/classify',
      data: {
        m: 'fujin_jiazheng',
      },
      cachetime: 0,
      success: function (res) {
        that.setData({
          glo_is_load:false
        })
        if (res.data.errno == 0) {
          console.log(res.data.data)
          that.setData({
            service: res.data.data
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {
        failGo('请检查连接地址');
      }
    })
  },
  refesh:function(){
    console.log('srolccddrefresh')
  },
  onReachBottom:function(){
    console.log('niaos')
  }
  
})