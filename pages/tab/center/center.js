
var app = getApp();
Page({
  data: {
    userInfo: {},
    list: [
      {
        id: 1,
        open: false,
        title:'订单管理',
        item:'我的预约',
        url:'../../myOrder/myOrder'
      },
      {
        id: 2,
        open: false,
        title: '口碑管理',
        item: '我要评价',
        url: '../../comment/comment'
      }
      
    ]
  },
  onLoad: function () {
    var that = this
    app.util.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo.wxInfo
      });
    })
  },
  widgetsToggle: function (e) {
    var id = e.currentTarget.id
    var list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        // list[i].open = false
      }
    }
    this.setData({
      list: list
    })
  },
})