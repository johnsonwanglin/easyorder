// pages/count/count.js
var time = require('../../utils/util.js');
Page({

  /**
   * Page initial data
   */
  data: {
    checked: true,
    icon: {
      normal: '//img.yzcdn.cn/icon-normal.png',
      active: '//img.yzcdn.cn/icon-active.png'
    },
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2018,12,1).getTime(),
    maxDate: new Date(2019, 10, 1).getTime(),
    currentDate: new Date().getTime(),
    isHidden: false,
    time: "",
    timeStamp: "",
    peopleCount: 0,
    itemObject: null
  },
  confirm: function(event){
    console.log(event.detail)
    console.log(this.toDate(event.detail))
    var date = this.toDate(event.detail)
    this.setData({
      isHidden: true,
      time: date,
      timeStamp: event.detail
    })
    console.log(this.data.time)
  },

  toDate: function(number){
    var n = number;
    var date = new Date(n);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return(Y + M + D)
},
  search: function(){
    console.log(this.data.timeStamp)
    var dateStr1 = this.data.time + " 00:00:00";
    var dateStr2 = this.data.time + " 23:59:59";
    var fromDate = new Date(dateStr1)
    var toDate = new Date(dateStr2)
    console.log(fromDate)
    console.log(toDate)
    let db = wx.cloud.database();
    const _ = db.command
    let that = this;
    db.collection('orders').where({
      time: _.gt(fromDate).and(_.lt(toDate))
    }).get({
      success(res) {
        console.log(res.data)
        console.log(res.data.length)
        var itemObject = {}
        for(var i in res.data){
          var title = res.data[i].title;
          var num = res.data[i].num;
          if(itemObject[title] == undefined || itemObject[title] == null){
            itemObject[title] = num;
          }else{
            var preNumber = itemObject[title];
            var realNum = parseInt(preNumber) + parseInt(num);
            itemObject[title] = realNum;
          }
        }
        console.log(itemObject)
        console.log(res.data.length)
        if (res.data.length == 0 ){
          that.setData({
            peopleCount: 0,
            itemObject: null
          })
        } else if (res.data.length >0 ){
          that.setData({
            peopleCount: res.data.length,
            itemObject: itemObject
          })
        }
      }
    })
  },
  focus: function(event){
    console.log("focus")
    this.setData({
      isHidden: false
    })
  },
  blur: function(event){
    console.log("blur")
    this.setData({
      isHidden: true
    })
  },
  onCancel: function(){
    this.setData({
      isHidden: true
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})