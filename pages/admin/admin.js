let app = getApp();
Page({
  data: {
    price: 0,
    title: "",
    menus: "",
    active: false,
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { title, price, active } = e.detail.value;
    
    if ( !title || !price) {
      wx.showToast({
        title: '不允许出现空值！',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    this.setData({
      isSubmit: true,
      title,
      price,
      active
    });
    console.log("title", this.data.title)
    console.log("price", parseInt(this.data.price))
    console.log("active", this.data.active)
    this.onAddItems()
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  onAddItems: function(){
    const db = wx.cloud.database()
    db.collection('items').add({
      data: {
        title: this.data.title,
        menu: parseInt(this.data.index),
        price: parseInt(this.data.price),
        active: false
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        wx.redirectTo({
          url: '../pay/pay'
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  onLoad: function () {
    console.log('start queryMenus()')
    let that = this;
    wx.getStorage({
      key: "menus",
      complete: function (res) {
        console.log('complete to get menus from storage', res);
        if (res.data == null) {
          res.data = []
        }
        that.setData({
          menus: res.data
        });
        console.log('menus-', that.data.menus);
      }
    })
  }

})
