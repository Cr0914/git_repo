// pages/author/author.js
const c1=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,  //初始文本框不显示内容
    writerlist:[],
    backFlag:1,
		nextFlag:1,
		start:0,//代表用户在操作上下页的时候的，所在的页数
    pageMax:'',//最大页数
    Searchnameinput:''  //诗人名字关键字
  },
 // 使文本框进入可编辑状态
 showInput: function () {
  this.setData({
    inputShowed: true   //设置文本框可以输入内容
  });
},

//搜索  获取input的值存入Searchinput
SavaInput(e)
{ 
  this.setData
  ({Searchnameinput : e.detail.value}) 

},
//搜索按钮 跳转到搜索到的界面
Searchbutton: function () {
 var that=this;
 wx.setStorageSync('inputnameKey', this.data.Searchnameinput)  //将Searchnameinput的值存入缓存，查找时找inputnameKey
 wx.navigateTo({
   url:'/packageB/pages/search_re',  //跳转到查询结果界面
 })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //无论我们分不分分页，在用户刚进入页面的时候必须先把第一个的数据直接读取数据
    c1.collection('writer0-1000').limit(20).get()
    //请求成功
    .then(res =>{
      //console.log('writer数据库请求成功',res.data)
      this.setData( 
        {//动态的将数据库内容存放到writerlist中
          writerlist:res.data,
          start:0,
        }
      )
    })
    //请求失败
    .catch(err =>{
        //console.log('writer数据库请求失败',err)
    })
    //读取数据库中的记录数
    var sum=1000;
    //console.log("sum:",sum)
    if(sum<=20){
      //代表数据库内记录不满20条,则就没必要进行分页
      this.setData({
        backFlag:0,
        nextFlag:0,
      })
    }
    if(sum>20){
      //进行分页操作，假如数据库内有125条数据，每页我们读取20，那我们就需要将其分成7页
      var pageindex=Math.ceil(sum/20)
      this.setData({
        backFlag:1,
        nextFlag:1,//要进行分页操作，所以显示下一页
        pageMax:pageindex
      })	
    }
  },
  
  onReady() {

  },
 //下页的触发事件
 pagenext(){
  var that=this
  // let pageMax=100
  //定义下一页数的索引数
  var index=parseInt(this.data.start)+1
  if(index+1==that.data.pageMax){
    //如果下一页等于最后一页则就不显示下一页按钮,只显示上一页
      that.setData({
        nextFlag:0,
        backFlag:1,
        start:index //start此时就要等于当前页数
      })
  }
c1.collection('writer0-1000').skip(index*20).limit(20).get({
  success(res){
     that.setData({
       writerlist:res.data,
       start:index
     })
  }
 })

},
//上一页
pageback(){
  var that=this
  var index=parseInt(this.data.start)-1

  c1.collection('writer0-1000').skip(index*20).limit(20).get({
    success(res){
      that.setData({
        writerlist:res.data,
        start:index
      })
    }
  })
},
onDetail: function (e) {
  //console.log(e)
  var imgId = e.currentTarget.dataset.bzid;
  wx.navigateTo({
    url: "/packageB/pages/re-detail?id=" + imgId   //?id连字符加上imgId
});
},
onPullDownRefresh() {
  wx.stopPullDownRefresh()
},
onShareAppMessage: function () {
  return {
   title: "子元朗诵阁",
 path: '/pages/author/author',
};
},
onShareTimeline: function () {
  return {
   title: "子元朗诵阁",
 path: '/pages/author/author',
};
},
})