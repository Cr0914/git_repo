// pages/list/list.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //当前第几页
    loaded:false,
    /*搜索的data*/
    list1: [], //这是搜索到的结果
    focus: false, //控制是否显示带取消按钮的搜索框
    inputValue: "",
    /*社区的data*/
    share_list: [],
  },

  search_1(table, search) {
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

  goto: function (e) {
    this.setData({
      list1: [],
      inputValue: ""
    })
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/packageC/pages/search?title=' + title
    })
  },
  find(e) {
    var title = this.data.inputValue
    wx.navigateTo({
      url: '/packageC/pages/search?title=' + title
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    db.collection('recite').limit(20).where({
      share: true
    }).get({
      success(res) {
        //如果列表数据条数小于总条数，隐藏 “正在加载” 字样，显示 “已加载全部” 字样
      /*最新列表标记倒叙*/
      var a = that.data.share_list.concat(res.data)
      //console.log("原始share_list",a)
      //console.log("长度：",a.length)
      for (let i = a.length - 1, j = 0; i >= 0; i-- , j++) {
        console.log(a[j])
        var share_list = "share_list[" + j + "]";
        that.setData({
          [share_list]:a[i],
        })	
      }
      //console.log("share_list:",that.data.share_list)
        if (res.data.length < 20) {
          that.setData({
            loaded: true, //已加载全部
          })
        } else {
          that.setData({
            loaded: false, 
          })
        };
      } //success
    }) //get闭合
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
      inputValue: "",
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
        inputValue: e.detail.value
      })
      this.search_1('tangshi', this.data.inputValue)
      this.search_1('songci', this.data.inputValue)
    }
  },

  to_show(e) {
    var id = e.currentTarget.dataset.reciteid
    wx.navigateTo({
      url: '/packageC/pages/show?id=' + id
    })
  },

  //上拉加载
  newsrequest(page) {
    let that = this
    db.collection('recite').where({share:true}).skip(page * 20).limit(20).get({
      success(res) {
        /*最新列表标记倒叙*/
        var a = that.data.share_list.concat(res.data)
        console.log("原始share_list",a)
          console.log("长度：",a.length)
              for (let i = a.length - 1, j = 0; i >= 0; i-- , j++) {
                console.log(a[j])
                var share_list = "share_list[" + j + "]";
                that.setData({
                  [share_list]:a[i],
                })	
              }
          console.log("share_list:",that.data.share_list)
        // var a = that.data.share_list.concat(res.data)
        // that.setData({
        //   share_list: a
        // })
        that.data.page++;
        if (res.data.length < 20) {
          that.setData({
            loaded: true, //已加载全部
          })
        } else {
          that.setData({
            loaded: false, 
          })
        };
      }
    })
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
    this.setData({
      share_list: []
    })
    wx.showNavigationBarLoading()
    this.setData({
      page: 1
    });
    this.onLoad();
    setTimeout(function () {
      wx.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 500
      })
      wx.hideNavigationBarLoading()
      wx.stopPullDownRefresh()
    }, 500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(!(this.data.loaded)){this.newsrequest(this.data.page);}
    else{
      wx.showToast({
        title: '已加载全部',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/list/list',
  };
  },
  onShareTimeline: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/list/list',
  };
  },
})