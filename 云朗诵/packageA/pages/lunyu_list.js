const c1=wx.cloud.database()
Page({
  data: {
    poemlist:[],
   
  },

  onLoad(options) {

    //无论我们分不分分页，在用户刚进入页面的时候必须先把第一个的数据直接读取数据
    c1.collection('lunyu').limit(20).get()
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
        //console.log('lunyu数据库请求失败',err)
    })
  },
  
onDetail: function (e) {
  //console.log(e)
  var imgId = e.currentTarget.dataset.bzid;
  wx.navigateTo({
    url: "/packageA/pages/lunyu_re_detail?id=" + imgId   //?id连字符加上imgId
});
},


onReachBottom: function () {
  wx,wx.showToast({
    title: '无更多数据',
  })
},

})