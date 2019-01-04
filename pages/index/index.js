//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabIndex: 0,
    // 统计商品数量和价格
    orderCount: {
      num: 0,
      money: 0
    },
    bottomFlag: false,
    // 提交的订单
    orders: true,
    menus: null,
    items: null
    
  },
  queryItems: function (options) {
    console.log('start queryItems()')
    let that = this;
    wx.getStorage({
      key: app.globalData.openid+ "-items-" + that.data.tabIndex,
      complete: function (res) {
        console.log('complete to get items from storage', res);
        if (res.data == null) {
          res.data = []
        }
        that.setData({
          items: res.data
        });
        console.log('items', that.data.items);
        if (that.data.items.length == 0){
          const db = wx.cloud.database()
          db.collection('items').where({
            menu: that.data.tabIndex
          }).get({
            success: res => {
              console.log('get items from DB', res);
              that.setData({
                items: res.data
              })
              console.log('[数据库] [items] 成功: ', that.data.items);
              wx.setStorage({
                key: app.globalData.openid + "-items-" + that.data.tabIndex,
                data: that.data.items
              });

            }
          });
        }
      }
    });
  },
  queryMenus(options) {
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
        if (that.data.menus.length == 0 ) {
          const db = wx.cloud.database()
          db.collection('menus').get({
            success: res => {
              console.log('get menus from DB', res);
              that.setData({
                menus: res.data
              })
              console.log('[数据库] [menus] 成功: ', that.data.menus);
              wx.setStorage({
                key: "menus",
                data: that.data.menus
              });

            }
          });
        }
      }
    });

  },
  onShow: function (options) {
    console.log('index->onShow()');
    
    this.queryMenus();
    this.queryItems();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    setTimeout(()=>{
      wx.showToast({
        title: '成功加载数据',
        icon: 'success',
        duration: 500
      });
      wx.stopPullDownRefresh()
    }, 500);
  },
  tabMenu: function(event) {
    let index = event.target.dataset.index;
    console.log('onclick on menu, the index:', index)
    this.setData({
      tabIndex: index
    });
    this.queryItems();
  },
  // 点击去购物车结账
  card: function() {
    let that = this;
    // 判断是否有选中商品
    if (that.data.orderCount.num !== 0) {
      // 跳转到购物车订单也
      wx.navigateTo({
        url: '../order/order'
      });
    } else {
      wx.showToast({
        title: '您未选中任何商品',
        icon: 'none',
        duration: 2000
      })
    }
  },
  addOrder: function(event) {
    let that = this;
    let id = event.target.dataset.id;
    let index = event.target.dataset.index;
    let param = this.data.items[index];
    let subOrders = app.globalData.subOrders; // 购物单列表存储数据
    console.log('subOrders', subOrders);
    param.active ? param.active = false : param.active = true;
    console.log('param', param)
    // 改变添加按钮的状态
    this.data.items.splice(index, 1, param);
    console.log('this.data.items', this.data.items)
    that.setData({
      items: this.data.items
    });
    // 将已经确定的菜单添加到购物单列表
    this.data.items.forEach(item => {
      if (item.active) {
        subOrders.push(item);
      }
    });
    // 判断底部提交菜单显示隐藏
    if (subOrders.length == 0) {
      that.setData({
        bottomFlag: false
      });
    } else {
      that.setData({
        bottomFlag: true
      });
    }
    let money = 0;
    let num = subOrders.length;
    subOrders.forEach(item => {
      money += item.price; // 总价格求和
      item.num = 1;
    });
    let orderCount = {
      num,
      money
    }
    // 设置显示对应的总数和全部价钱
    this.setData({
      orderCount
    });
    // 将选中的商品存储在本地
    wx.setStorage({
      key: "orders",
      data: subOrders
    });
    wx.setStorage({
      key: app.globalData.openid + "-items-" + this.data.tabIndex,
      data: this.data.items
    });
  },
  onLoad: function() {
    wx.clearStorage();

  }
})