
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
    var that=this
    var key=wx.getStorageSync('inputnameKey')
    //console.log("查询诗人", key)
    const db = wx.cloud.database();
    const _ = db.command
    db.collection('writer0-1000').where(_.or([{
        name: db.RegExp({
          regexp: '.*' + key,
          options: 'i',
        })
      }
    ])).get({
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


})

