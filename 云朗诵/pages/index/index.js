// index.js
// 获取应用实例
const app = getApp()
const db = wx.cloud.database();
Page({
  data: {
    GridList:[
      {"id":"1","text":"每日一赏","url":'/images/tab/home-active.png'},
      {"id":"2","text":"朗诵","url":'/images/tab/home.png'},
      {"id":"3","text":"诗词库","url":'/images/tab/libaray-active.png'},
      {"id":"4","text":"个人中心","url":'/images/tab/libaray.png'}],
    sentence:{},
    page:1,
  },
  onLoad(options)
  {
    
    var num=Math.floor(Math.random() * 9999)
    db.collection('sentence').skip(num).limit(1).get()
    //请求成功
    .then(res =>{
      //console.log('sentence数据库请求成功',res.data)
      this.setData
      ({
        sentence:res.data
      })
    })
    //请求失败
    .catch(err =>{
        //console.log('sentence数据库请求失败',err)
    })
    
  },
  change_sentence()
  {
    this.setData(
      {
        page:this.data.page+1,
      }
    )
    db.collection('sentence').skip(this.data.page%10000).limit(1).get()
    //请求成功
    .then(res =>{
      //console.log('sentence数据库请求成功',res.data)
      this.setData
      ({
        sentence:res.data
      })
    })
    //请求失败
    .catch(err =>{
        //console.log('sentence数据库请求失败',err)
    })
  },
   /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/index/index',
  };
  },
  onShareTimeline: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/index/index',
  };
  },

})
