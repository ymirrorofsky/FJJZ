// pages/tab/evaluate/evaluate.js
var WxParse = require('../../../wxParse/wxParse.js');
var format = require('../../../utils/util.js');

var app = getApp()

Page({
  data: {
    status: '1',
    detailS: [],
    detailI: '',
    comment: [],
    avescore: '',
    glo_is_load: true,
    page: 1,
    noMore: false,
    replyArrLength: ''

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    // this.getNotice();
    this.getDetailS();
    this.getDetailI();
    this.getComment();
    this.getAveScore();

    // var timestamp4 = new Date(1497409740000)
    // console.log(format.formatTime(timestamp4));
  },
  getNotice: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/service',
      data: {
        m: 'fujin_jiazheng',
        op: 'getNotice'
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {

        } else {

        }
      },
      fail: function () {

      }
    })
  },
  //获取定位
  getLocation: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    })
  },
  //获取详情服务
  getDetailS: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/kefu',
      data: {
        m: 'fujin_jiazheng',
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            detailS: res.data.data
          })
        } else {

        }
      },
      fail: function () {

      }
    })
  },
  //获取详情介绍
  getDetailI: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/content',
      data: {
        m: 'fujin_jiazheng',
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            detailI: res.data.data.content,
          })
          WxParse.wxParse('detailI', 'html', that.data.detailI, that, 5);
        } else {

        }
      },
      fail: function () {
        failGo('请检查连接地址');
      }
    })
  },
  //获取点评
  getComment: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/dianping',
      data: {
        m: 'fujin_jiazheng',
        page: 1
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          var replyArr = []
          res.data.data.forEach((item, index) => {
            var time = new Date(item.updatetime * 1000)
            item.updatetime = format.formatTime(time);
            replyArr.push(item.content);
          })
          that.setData({
            replyArr: replyArr
          })
          if (replyArr.length > 0) {
            for (let i = 0; i < replyArr.length; i++) {
              WxParse.wxParse('reply' + i, 'html', replyArr[i], that);
              if (i === replyArr.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
              }
            }
          }
          that.setData({
            comment: res.data.data
          })
        } else {
          failGo(res.data.message)
        }
      },
      fail: function () {
        failGo('请检查连接地址');
      }
    })
  },
  //获取总分和评论条数
  getAveScore: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/avescore',
      data: {
        m: 'fujin_jiazheng',
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          that.setData({
            avescore: res.data.data,
            glo_is_load: false
          })
        } else {
          failGo(res.data.message)
        }
      },
      fail: function () {

      }
    })
  },

  setStatus: function (event) {
    var that = this;
    that.setData({
      status: event.currentTarget.dataset.type
    })
  },
  //吊起客服电话
  call: function () {
    wx.makePhoneCall({
      phoneNumber: '1340000' //仅为示例，并非真实的电话号码
    })
  },
  onPullDownRefresh: function () {
    wx.showToast({
      icon: 'loading',
      title: '加载中'
    })
    this.getDetailS();
    this.getDetailI();
    this.getComment();
    this.getAveScore();

    setTimeout(function () {
      wx.stopPullDownRefresh();
      wx.hideToast()
    }, 1000)
  },
  onReachBottom: function () {
    var that = this;
    if (that.data.status != 2) {
      return;
    }
    if (that.data.comment.length < 10) {
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      page: ++that.data.page
    })
    app.util.request({
      url: 'entry/wxapp/dianping',
      data: {
        m: 'fujin_jiazheng',
        page: that.data.page
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          if (res.data.data.length == 0) {
            that.setData({
              noMore: true
            })
            return;
          }
          var replyArr = [];
          res.data.data.forEach((item, index) => {
            var time = new Date(item.updatetime * 1000)
            item.updatetime = format.formatTime(time);
            replyArr.push(item.content);
          })
          var newReplyArr = that.data.replyArr.concat(replyArr);
          that.setData({
            replyArr: newReplyArr
           })
          if (newReplyArr.length > 0) {
            for (let i = 0; i < newReplyArr.length; i++) {
              WxParse.wxParse('reply' + i, 'html', newReplyArr[i], that);
              if (i === replyArr.length - 1) {
                WxParse.wxParseTemArray("replyTemArray", 'reply', newReplyArr.length, that)
              }
            }
          }
          that.setData({
            comment: that.data.comment.concat(res.data.data),
          })
        } else {
          failGo(res.data.message)
        }
      },
      fail: function () {
        failGo('请检查连接地址');
      }
    })

  }


})