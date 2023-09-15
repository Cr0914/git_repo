// components/re-detail/re-detail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    writerINFO:[] , //全部信息
    imageurl:[],//作者图像链接
    simpleIntro:[],//简单介绍
    detailIntro:[],//详细介绍
    name:[] //作者名字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    //指定id来加载对应数据
    //console.log(e)
    let that=this	//同样的 异步请求，let一个that
    let a=e.id		//声明一个a,存e中的id
    // 页面初始化 options为页面跳转所带来的参数
    wx.cloud.database().collection("writer0-1000").where({ //查询数据表下id为a所存放的id的信息
      _id:a
    }).get({
      success(res){
        that.setData({ //给数据写入数据
          writerINFO:res.data ,
          imageurl:res.data[0].headImageUrl,//作者图像链接
          simpleIntro:res.data[0].simpleIntro,//简单介绍
          detailIntro:JSON.parse(res.data[0].detailIntro),//详情介绍
          name:res.data[0].name //作者名字
   
        })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})

