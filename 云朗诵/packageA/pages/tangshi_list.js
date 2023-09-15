const c1=wx.cloud.database()
Page({
  data: {
    poemlist:[],
    page:1,  //起始页面 1
    newslists:[],
  },

  onLoad(options) {

    //无论我们分不分分页，在用户刚进入页面的时候必须先把第一个的数据直接读取数据
    c1.collection('tangshi').limit(20).get()
    //请求成功
    .then(res =>{
      //console.log(res)
      this.setData( 
        {//动态的将数据库内容存放到poemlist中
          poemlist:res.data,
        }
      )
    })
    //请求失败
    .catch(err =>{
      wx.showToast({
        title: '获取tangshi数据库失败',
        icon:'error'
      })
    })
  },
  
  onDetail: function (e) {
    //console.log(e)
    var imgId = e.currentTarget.dataset.bzid;
    wx.navigateTo({
      url: "/packageA/pages/tangshi_re_detail?id=" + imgId   //?id连字符加上imgId
  });
  },


  onReachBottom: function () {
    if(this.data.page>15)
    {
      wx.showToast({
        title: '无更多数据',
      })
    }
    else{this.newsrequest(this.data.page);}
  },


  /**请求数据 */
  newsrequest:function(page){
  var _this=this;
  //console.log(_this.data.page)
  c1.collection('tangshi').skip(page*20).limit(20).get({
    success(res){
      //console.log(res.data)
      _this.setData({
        newslists:res.data,
      })
    }
  })
  /*此时会发现数据被添加到原有数据的后边类似上拉加载更多*/
  _this.setData({
    poemlist: _this.data.poemlist.concat(_this.data.newslists)
  });
  //console.log("poemlist",_this.data.page,_this.data.poemlist)
  _this.data.page++;
  },
})