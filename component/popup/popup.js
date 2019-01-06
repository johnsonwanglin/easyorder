// component/popup.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '内容'
    },
    // 弹窗取消按钮文字
    btn_no: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    btn_ok: {
      type: String,
      value: '确定'
    } 
  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: true,
    speces: null,
    materials: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hidePopup: function () {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showPopup(itemId, title, parent, specs, materials) {

      parent.setData({
        bottomFlag: true 
      })
      const db = wx.cloud.database();
      let that = this;
      let count = 0;
      // 获取到材料
      db.collection('materials').where({
        itemId: itemId
      })
        .get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)
            materials = res.data;
            that.setData({
              materials: materials
            })
            console.log(that.data)
            count ++
            if(count == 2 ){
              that.setData({
                flag: !that.data.flag,
                title: title
              })
            }
          }
        })
      // 获取到规格
      db.collection('specs').where({
        itemId: itemId
      })
        .get({
          success(res) {
            // res.data 是包含以上定义的两条记录的数组
            console.log(res.data)
            that.setData({
              speces: res.data
            })
            console.log(that.data)
            count ++;
            if(count == 2){
              that.setData({
                flag: !that.data.flag,
                title: title
              })
            }
          }
        })
      
      // console.log(this.data)
      // console.log(specs)
      // console.log(materials)
      // this.setData({
      //   flag: !this.data.flag,
      //   title: title
      // })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _error () {
      //触发取消回调
      this.triggerEvent("error")
    },
    _success () {
      //触发成功回调
      this.triggerEvent("success");
    }
  }
})
