// pages/edit/edit.js
var app = getApp();
Page({
  data: {
    name: '',
    gender: true,
    mobile: '',
    addresss: '',
    intro: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.util.getUserInfo(function (userInfo) {
      console.log(userInfo)
      that.setData({
        userInfo: userInfo.wxInfo
      });
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
  genderSel: function (e) {
    var type = e.currentTarget.dataset.type;
    if (type == 0) {
      this.setData({
        gender: true
      })
    } else if (type == 1) {
      this.setData({
        gender: false
      })
    }
  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindIntro: function (e) {
    this.setData({
      intro: e.detail.value
    })
  },
  submit: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/edit',
      data: {
        m: 'fujin_jiazheng',
        name:that.data.name,
        gender:that.data.gender,
        mobile:that.data.mobile,
        address:that.data.address,
        intro:that.data.intro
      },
      cachetime: 0,
      success: function (res) {
        if (res.data.errno == 0) {
          wx.showToast({
            title: '保存成功',
            duration:1500
          })
        } else {
          failGo(res.data.message);
        }
      },
      fail: function () {

      }
    })
  }

})