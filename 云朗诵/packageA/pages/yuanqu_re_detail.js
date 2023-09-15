Page({

  /**
   * 页面的初始数据
   */
  data: {
    poemINFO:[],
    isShow: false,
    id: [],
    collect:[],
    content:'',
    /*播放要改的东西*/
    start:false,
    play:false,
    /*朗读数据*/
    url_list: [],
    play_index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
//指定id来加载对应数据
    //console.log(e)
    let that=this	//同样的 异步请求，let一个that
    let a=e.id		//声明一个a,存e中的id
    var id = e.id;
    this.setData({
      id:id
    })
    // 页面初始化 options为页面跳转所带来的参数
    wx.cloud.database().collection('yuanqu').where({ //查询数据表下id为a所存放的id的信息
      _id:a
    }).get({
      success(res){
        that.setData({ //给数据写入数据
          poemINFO:res.data ,
          content:res.data[0].title+","+res.data[0].content.toString()
        })
        console.log(that.data.content)
      }
    })   
  //获取缓存数组里的isShow，即收藏状态，防止刷新后页面收藏丢失
  const Collect = wx.getStorageSync("collect_news")
  for(var i=0;i<Collect.length;i++){
    if(this.data.id==Collect[i].id){
      const isShow = Collect[i].isShow
        this.setData({
          isShow
        })
     }
}
   //*播放要改的东西*/
   this.audioCtx = wx.createInnerAudioContext()
   this.audioCtx.autoplay = false // 不允许自动播放
   this.audioCtx.onEnded(function () {
     that.data.play_index++
     var index = that.data.play_index
     if (index > (that.data.url_list.length - 1)) {
       //完全播完
       that.audioCtx.stop()
       that.setData({
         start: false,
         play: false,
         play_index: 0
       })
       return
     } else {
       that.audioCtx.src = that.data.url_list[index]
       that.audioCtx.play()
     }
   })
},
  //收藏按钮
  handleCollect(e){
  //取反
  let isShow = !this.data.isShow
  this.setData({
  isShow
  })
  let collect = wx.getStorageSync("collect_news")|| [];
  //将收藏的文章信息放入缓存中，记得对照自己的数据库替换数据
  //id、name、src等可以自己取名字，只要在收藏wxml页面渲染记得换名字
  this.data.poemINFO.forEach((item,index)=>{
  let temp = {
    id:item._id,
    title:item.title,
    classType:"yuanqu",
    isShow:true
  }
  this.setData({
    temp
  })
  })
  //如果缓存中没有收藏过，则在缓存中插入数组
  const {id} = e.currentTarget.dataset
  //console.log(id)
  //找到需要修改的文章索引
  const index= collect.findIndex(v=>v.id==id);
  //console.log(index)
  //console.log(collect[index])
  if(collect.length===0||collect[index]==undefined){
  collect.push(this.data.temp)
  wx.setStorageSync("collect_news",collect)
  }else{
  //如果缓存中已经存在收藏文章编号，则将isShow取反
  //删掉缓存中指定数组 可将下面这句改为 collect.splice(index,1);
  collect[index].isShow=!collect[index].isShow
  wx.setStorageSync("collect_news",collect)
  }
  //提示用户
  wx.showToast({
    title: isShow ? '收藏成功' : '取消收藏',
    icon:'success'
  })
  },
  bofang(e) {
    this.setData({
      play: true
    })
    if (!this.data.start) {
      this.setData({
        start: true
      })
      let that = this
      wx.request({
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=zqb27GMEEsBe8oGSVOyAIgKm&client_secret=7cHhbl51d7e2KT88AEAGvq1OhhFdqZb4`,
        success: (res) => {
          var token = res.data.access_token
          var str = this.data.content;
          that.read(token, str)

          //that.read(res.data.access_token)
        }
      })
    } else {
      this.audioCtx.play()
    }
  },
  read(token, str) {
    var userid = '123456'
    var m = str.split('\n'); 
    var url_list = [];
    for (var i = 0; i < m.length; i++) {
      var url = "https://tsn.baidu.com/text2audio?lan=zh&cuid=" + userid + "&ctp=1&tok=" + token + "&tex=" + encodeURI(m[i]) + "&spd=2&vol=6&per=3";
      url_list.push(url)
    }

    this.setData({
      url_list: url_list
    })
    this.audioCtx.src = url_list[0];
    this.audioCtx.play();

  },
  onUnload() {
    this.audioCtx.stop()
  },
  pause() {
    this.setData({
      play: false
    })
    this.audioCtx.pause()
  },

  })