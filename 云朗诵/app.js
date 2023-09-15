// app.js
App({
  data: {
     
      },
    globalData:
    {
      openid:null
    },
   
  onLaunch() 
  {
  wx.cloud.init
  ({
    env:"recite-zhang-zou-3fyxojo6c4880d7"
  })
  //云函数调用
  wx.cloud.callFunction({
    name:'helloCloud',
    data:{
      message:'helloCloud',
    }
  }).then(res=>{
    console.log("cloud:",res.result.openid)//res就将appid和openid返回了
    this.globalData.openid=res.result.openid
    console.log("app:",this.globalData.openid)
      //做一些后续操作，不用考虑代码的异步执行问题。
  })
  }
})
