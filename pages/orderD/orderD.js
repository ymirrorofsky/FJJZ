
var app = getApp();

Page({
  data: {
    info: '',
    order:{},
    classify:'',
    cart:'',
    glo_is_load:true
  },
  onLoad: function (options) {
    var order = {};
    order.classify = options.classify;
    order.cart=options.cart.split(",");
    this.setData({
      classify: options.classify,
      cart: options.cart
    })
    this.getOrder(order);
    
  },
  getOrder: function (order) {
    var that = this;
    app.util.request({
      url: 'entry/wxapp/book',
      data: {
        m: 'fujin_jiazheng',
        order:order
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            info:res.data.data,
            glo_is_load: false
          })
        } else {

        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: "wrong啦",
          showCancel: false
        })
      }
    })
  },
  submit: function () {
    var that = this;
    wx.navigateTo({
      url: '../payinfo/payinfo?price=' + that.data.info.totalPrice + '&classify=' + that.data.classify + '&cart=' + that.data.cart
    })
  }
})