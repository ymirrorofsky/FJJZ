// pages/slists/slists.js


var app = getApp();
Page({
  data: {
    cart: [],
    classify: '',
    glo_is_load: true,
    disabled: false,
    service: [],
    page: 1,
    isShowToast: false,
    toastText: '没有更多了',
    noMore: false
  },
  //提交按钮是否可点
  setDisabled: function (e) {
    this.setData({
      disabled: !this.data.disabled
    })
  },
  //
  onLoad: function (options) {
    this.setData({
      classify: options.id
    })
    this.getSList(this.data.classify);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    that.setData({
      noMore: false
    })
    wx.showToast({
      icon: 'loading',
      title: '正在加载'
    })
    app.util.request({
      url: 'entry/wxapp/serve',
      data: {
        m: 'fujin_jiazheng',
        classify: that.data.classify,
        page: 1
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            service: res.data.data,
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {

      }
    })
    setTimeout(function () {
      wx.stopPullDownRefresh()
      wx.hideToast()
    }, 1000)
  },
  //上拉加载
  onReachBottom: function () {
    var that = this;
    if (that.data.noMore) {
      return;
    }
    if (that.data.service.length < 10) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page: ++that.data.page
    })
    app.util.request({
      url: 'entry/wxapp/serve',
      data: {
        m: 'fujin_jiazheng',
        classify: that.data.classify,
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
          that.setData({
            service: that.data.service.concat(res.data.data),
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {

      }
    })
  },
  //获取服务列表
  getSList: function (id) {
    var that = this
    app.util.request({
      url: 'entry/wxapp/serve',
      data: {
        m: 'fujin_jiazheng',
        classify: id,
        page: 1
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            service: res.data.data,
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
  //选择预约
  selectSer: function (event) {
    var that = this;
    let id = event.currentTarget.dataset.id;
    let flag = true;
    let cart = that.data.cart;
    if (cart.length > 0) {
      cart.forEach(function (item, index) {
        if (item == id) {
          cart.splice(index, 1);
          flag = false;
        }
      })
    }
    if (flag) cart.push(id);
    that.setStatus(id)
    that.setData({
      cart: cart
    })

  },
  //是否打钩
  setStatus: function (id) {
    var that = this;
    that.data.service.forEach((item) => {
      if (item.classify_id == id) {
        item.status = !item.status || false
      }
    })
    that.setData({
      service: that.data.service
    })

  },
  //提交预约
  submit: function (id) {
    var that = this
    wx.navigateTo({
      url: '../orderD/orderD?classify=' + that.data.classify + '&cart=' + that.data.cart
    })

  }

})