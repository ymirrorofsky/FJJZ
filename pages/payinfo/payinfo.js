// pages/payinfo/payinfo.js
var format = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    date: '',
    name: '',
    mobile: '',
    address: '',
    message: '',
    price: '',
    classify: '',
    cart: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    hour = hour < 10 ? '0' + hour : hour
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    this.setData({
      time: hour + ":" + minute,
      date: year + "-" + month + "-" + day,
      price: options.price,
      classify: options.classify,
      cart: options.cart.split(",")
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    var that = this;
    that.setData({
      time: e.detail.value
    })
  },
  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // 成功返回函数
        var longitude = res.longitude
        var latitude = res.latitude
        //发送请求通过百度经纬度反查地址信息
        wx.request({
          //百度地图经纬度反查路径
          url: 'http://api.map.baidu.com/geocoder/v2/?ak=btsVVWf0TM1zUBEbzFz6QqWF&location=' + latitude + ',' + longitude + '&output=json&pois=0',
          data: {}, method: "get",
          header: { 'Content-Type': 'application/json' },
          success: function (ops) {
            //成功返回一个result集合
            console.log(ops)
            //把地址放入需要展示的地方
            _that.setData({
              merchAddr: ops.data.result.formatted_address
            })
          }, fail: function () {
            // util.msg("提示", "定位失败，请手动输入店铺地址")
          }
        })
      }
    })
  },
  bindName: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  bindMobile: function (e) {
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },
  bindAddress: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  bindMessage: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
  },
  submit: function () {
    var that = this
    var order = {}
    var order = {};
    order.classify = that.data.classify;
    order.cart = that.data.cart;
    console.log(order)
    if (!that.data.name) {
      wx.showModal({
        title: '提示',
        content: '请输入联系人姓名',
        showCancel: false
      });
    }
    if (!that.data.mobile) {
      wx.showModal({
        title: '提示',
        content: '请输入联系人电话',
        showCancel: false
      });
    }
    if (!that.data.address) {
      wx.showModal({
        title: '提示',
        content: '请输入联系人地址',
        showCancel: false
      });
    }
    app.util.request({
      url: 'entry/wxapp/createorder',
      data: {
        m: 'fujin_jiazheng',
        name: that.data.name,
        mobile: that.data.mobile,
        date: that.data.date,
        time: that.data.time,
        message: that.data.message,
        price: that.data.price,
        order: order
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          app.getUserOpenId(function (err, openid) {
            if (!err) {
              wx.request({
                url: 'entry/wxapp/pay',
                data: {
                  m: 'fujin_jiazheng',
                  openid: openid
                },
                method: 'POST',
                success: function (res) {
                  console.log('unified order success, response is:', res)
                  var payargs = res.data.payargs
                  wx.requestPayment({
                    timeStamp: payargs.timeStamp,
                    nonceStr: payargs.nonceStr,
                    package: payargs.package,
                    signType: payargs.signType,
                    paySign: payargs.paySign
                  })
                }
              })
            } else {
              console.log('err:', err)
            }
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
  pay: function () {
    app.getUserOpenId(function (err, openid) {
      if (!err) {
        wx.request({
          url: 'entry/wxapp/pay',
          data: {
            m: 'fujin_jiazheng',
            openid: openid
          },
          method: 'POST',
          success: function (res) {
            console.log('unified order success, response is:', res)
            var payargs = res.data.payargs
            wx.requestPayment({
              timeStamp: payargs.timeStamp,
              nonceStr: payargs.nonceStr,
              package: payargs.package,
              signType: payargs.signType,
              paySign: payargs.paySign
            })
          }
        })
      } else {
        console.log('err:', err)
      }
    })
  }

})


// app.util.request({
//   url: 'entry/wxapp/pay',
//   data: {
//     m: 'fujin_jiazheng',
//     sum: 1
//   },
//   cachetime: 0,
//   success: function (res) {
//     console.log(res);
//     wx.requestPayment({
//       'timeStamp': res.data.timeStamp,
//       'nonceStr': '',
//       'package': '',
//       'signType': 'MD5',
//       'paySign': '',
//       'success': function (res) {
//       },
//       'fail': function (res) {
//       }
//     })
//   },
//   fail: function () {

//   }
// })