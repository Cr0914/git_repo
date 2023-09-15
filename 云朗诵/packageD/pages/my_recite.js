// packageD/pages/my_recite.js
var app = getApp()
const user_openid = app.globalData.openid
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1, //当前第几页
    loaded:false,
    havedata:true,
    /*搜索的data*/
    list1: [], //这是搜索到的结果
    focus: false, //控制是否显示带取消按钮的搜索框
    inputValue: "",
    /*社区的data*/

    opid:user_openid,
    share_list: [],
  },

  to_show(e) {
    var id = e.currentTarget.dataset.reciteid
    wx.navigateTo({
      url: '/packageC/pages/show?id=' + id
    })
  },

  get_record(opid){
    let that = this
    db.collection('recite').limit(20).where({
      _openid: opid
    }).get({
      success(res) {
        //如果列表数据条数小于总条数，隐藏 “正在加载” 字样，显示 “已加载全部” 字样
        var a = that.data.share_list.concat(res.data)
        that.setData({
          share_list: a
        })
        if(res.data.length == 0){
          that.setData({
            havedata: false, //没数据
          })
        }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.showToast({title: '加载中',icon: 'loading',duration: 1000})
    this.get_record(this.data.opid)
  },

  
  //上拉加载
  newsrequest(page,opid) {
    let that = this
    db.collection('recite').where({_openid:opid}),skip(page * 20).limit(20).get({
      success(res) {
        var a = that.data.share_list.concat(res.data)
        that.setData({
          share_list: a
        })
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
    if(!(this.data.loaded)){this.newsrequest(this.data.page,this.data.opid);}
    else{
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