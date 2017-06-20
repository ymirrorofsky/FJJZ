
var app = getApp();
Page({
  data: {
    list: [],
    glo_is_load: true,
    page: 1,
    isShowToast: false,
    toastText: '没有更多了',
    noMore:false
  },
  onLoad: function () {
    this.getMyOrder()
  },
  getMyOrder: function () {
    var that = this;
    app.util.request({
      url: 'entry/wxapp/myorder',
      data: {
        m: 'fujin_jiazheng',
        page: 1
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          res.data.data.forEach((item) => {
            var time = new Date(item.order_time * 1000)
            var year = time.getFullYear();
            var month = time.getMonth() + 1
            var day = time.getDate()
            month = month < 10 ? '0' + month : month
            day = day < 10 ? '0' + day : day
            var formatTime = year + "-" + month + "-" + day;
            item.order_time = formatTime
          })
          that.setData({
            list: res.data.data,
            glo_is_load: false
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {

      }
    })
  },
  //上拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      noMore: false
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.getMyOrder();
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideLoading()
    }, 1000)



  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    if (that.data.noMore) {
      return;
    }
    if (that.data.list.length < 10) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page: ++that.data.page
    })
   
    app.util.request({
      url: 'entry/wxapp/myorder',
      data: {
        m: 'fujin_jiazheng',
        page: that.data.page
      },
      cachetime: 0,
      success: function (res) {
        wx.hideLoading()
        if (res.data.errno == 0) {
          if (res.data.data.length == 0) {
            that.setData({
              noMore: true
            })
            return;
          }
          res.data.data.forEach((item) => {
            var time = new Date(item.order_time * 1000)
            var year = time.getFullYear();
            var month = time.getMonth() + 1
            var day = time.getDate()
            month = month < 10 ? '0' + month : month
            day = day < 10 ? '0' + day : day
            var formatTime = year + "-" + month + "-" + day;
            item.order_time = formatTime
          })
          that.setData({
            list: that.data.list.concat(res.data.data),
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {

      }
    })
  },



})