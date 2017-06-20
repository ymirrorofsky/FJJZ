var app = getApp()
Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/star-off.png',
    selectedSrc: '../../images/star-on.png',
    key: 1,//评分
    uploadimgs: [],
    editable: true,
    message: '',
    userInfo: ''
  },
  onLoad: function () {
    var that = this
    app.util.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo.wxInfo
      });
    })

  },
  starSel: function (event) {
    var num = event.currentTarget.dataset.num;

  },
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    console.log("得" + key + "分")
    this.setData({
      key: key
    })
  },
  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#09BB07",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
      }
    })
  },
  deleteImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var imgs = this.data.uploadimgs
    imgs.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      uploadimgs: imgs
    })
  },
  bindKeyInput: function (e) {
    var that = this;
    that.setData({
      message: e.detail.value
    })
    console.log(that.data.message)

  },

  submit: function () {
    var that = this
    app.util.request({
      url: 'entry/wxapp/commentT',
      data: {
        m: 'fujin_jiazheng',
        score: that.data.key,
        message: that.data.message,
        username: that.data.userInfo.nickName
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
    this.uploadFile2(this.data.uploadimgs, 0)

  },
  uploadFile2: function (file, i) {//递归调用
    var that = this;
    wx.uploadFile({
      url: 'entry/wxapp/upload', //仅为示例，非真实的接口地址
      filePath: file[i],
      name: 'file',
      success: function (res) {
        var obj = new Object();
        obj.ind = i + 1;
        var data = res.data;
        console.info(data);
        obj.src = data;
        console.info("---------------------------------");
        console.info(obj);
        if (!((i + 1) == file.length)) {
          total.push(obj);
          that.uploadFile2(file, i + 1);
        } else {
          total.push(obj);
          that.setData({ perImgSrc: total });
        }
      }
    })
  }
})

