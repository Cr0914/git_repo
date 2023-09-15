// pages/list/list.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t: "", //用于翻页搜索
    loaded1: false, //是不是没数据了
    loaded2: false, //是不是没数据了
    page1: 1,
    page2: 1,

    list1: [], //这是搜索到的结果
    list2: [], //最终展示结果合集
    /*list:[],//关键字匹配搜索（非前缀）*/
    focus: false, //控制是否显示带取消按钮的搜索框
    inputValue: ""
  },

  search_1(table, search) { //前缀查找
    //实现搜索的功能
    let that = this
    db.collection(table).limit(10).where({
      title: db.RegExp({
        regexp: '^' + search, //前缀
        options: 'i', //大小写不区分
      }),
    }).get({
      success(res) {
        var a = that.data.list1.concat(res.data)
        that.setData({
          list1: a
        })
      } //success
    }) //get闭合
  },

  search_2(table, search) {
    //实现搜索的功能
    let that = this
    db.collection(table).limit(20).where({
      title: db.RegExp({
        regexp: search,
        options: 'i', //大小写不区分
      }),
    }).get({
      success(res) {
        var r = res.data
        var b = []
        r.forEach((item, index) => {
          let temp = {
            id: item._id,
            title: item.title,
            author: item.author,
            classType: table,
            content: item.content,
          }
          b.push(temp)
        })
        var a = that.data.list2.concat(b)
        that.setData({
          list2: a
        })
      } //success
    }) //get闭合
  },

  find(e) {
    this.setData({
      list2: [],
      loaded1: false, //是不是没数据了
      loaded2: false, //是不是没数据了
      page1: 1,
      page2: 1,
    })
    var search = this.data.inputValue
    this.search_2('tangshi', search)
    this.search_2('songci', search)
    this.setData({
      list1: [],
      focus: false,
      t: search
    })
  },

  goto: function (e) {
    this.setData({
      list2: [],loaded1: false, //是不是没数据了
      loaded2: false, //是不是没数据了
      page1: 1,
      page2: 1,
    })
    var search = e.currentTarget.dataset.search
    this.search_2('tangshi', search)
    this.search_2('songci', search)
    this.setData({
      list1: [],
      focus: false,
      t: search
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var search = options.title
    this.setData({
      t: search
    })
    this.search_2('tangshi', search)
    this.search_2('songci', search)
  },

  focusHandler(e) {
    this.setData({
      focus: true,
      inputValue: ""
    })
  },

  cancelHandler(e) {
    this.setData({
      focus: false,
      list1: []
    })
  },
  query(e) {
    this.setData({
      list1: []
    })
    if (e.detail.value == "") {
      this.setData({
        list1: []
      })
    } else {
      this.setData({
        inputValue: e.detail.value,
        t: e.detail.value
      }) //首先回显输入的字符串
      this.search_1('tangshi', this.data.inputValue)
      this.search_1('songci', this.data.inputValue)
      //如果输入的关键词为空就加载历史记录（list2），不是空就加载搜索到的数据
    }
  },

  to_recite(e) {
    var id = e.currentTarget.dataset.item.id
    var type = e.currentTarget.dataset.item.classType
    wx.navigateTo({ //redirectTo 不保留当前页面 navigateTo 保留
      url: './list2?type=' + type + '&id=' + id
    })
  },

  //上拉加载
  newsrequest_1(page, table, search) {
    //实现搜索的功能
    let that = this
    db.collection(table).skip(page * 20).limit(20).where({
      title: db.RegExp({
        regexp: search,
        options: 'i', //大小写不区分
      }),
    }).get({
      success(res) {
        var r = res.data
        var b = []
        r.forEach((item, index) => {
          let temp = {
            id: item._id,
            title: item.title,
            author: item.author,
            classType: table,
            content: item.content,
          }
          b.push(temp)
        })
        var a = that.data.list2.concat(b)
        that.setData({
          list2: a
        })
        if (res.data.length < 20) {
          that.setData({
            loaded1: true, //已加载全部
          })
        } else {
          that.setData({
            loaded1: false,
          })
        };
      } //success
    }) //get闭合
  },

  newsrequest_2(page, table, search) {
    //实现搜索的功能
    let that = this
    db.collection(table).skip(page * 20).limit(20).where({
      title: db.RegExp({
        regexp: search,
        options: 'i', //大小写不区分
      }),
    }).get({
      success(res) {
        var r = res.data
        var b = []
        r.forEach((item, index) => {
          let temp = {
            id: item._id,
            title: item.title,
            author: item.author,
            classType: table,
            content: item.content,
          }
          b.push(temp)
        })
        var a = that.data.list2.concat(b)
        that.setData({
          list2: a
        })
        if (res.data.length < 20) {
          that.setData({
            loaded2: true, //已加载全部
          })
        } else {
          that.setData({
            loaded2: false,
          })
        };
      } //success
    }) //get闭合
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.list2.length < 20) {
      this.setData({
        loaded1: true,
        loaded2: true
      })
    }
    if (!(this.data.loaded1)) {
      var search = this.data.t
      this.newsrequest_1(this.data.page1, 'tangshi', search);
      this.data.page1++;
    }
    if (!(this.data.loaded2)) {
      var search = this.data.t
      this.newsrequest_2(this.data.page2, 'songci', search);
      this.data.page2++;
    }
    if (this.data.loaded1 && this.data.loaded2) {
      wx.showToast({
        title: '已加载全部',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})