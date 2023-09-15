const db = wx.cloud.database(
  Page({
    data: {
      collect:[]
    },
    onLoad(options){
      const collect = wx.getStorageSync("collect_news")
      this.setData({
        collect
      })
    },
  
    //点击跳转到文章详情
    handleGoDetail(e){
      //console.log(e)
      var tempid=e.currentTarget.dataset.id
      var type=e.currentTarget.dataset.type
      switch(type) {
        case "lunyu":
          wx.navigateTo({
            url:'/packageA/pages/lunyu_re_detail?id='+tempid,
          })
           break;
        case "shijing":
          wx.navigateTo({
            url:'/packageA/pages/shijing_re_detail?id='+tempid,
          })
           break;
        case "tangshi":
          wx.navigateTo({
            url:'/packageA/pages/tangshi_re_detail?id='+tempid,
        })
          break;
        case "chuci":
          wx.navigateTo({
            url:'/packageA/pages/chuci_re_detail?id='+tempid,
        })
          break;
        case "yuanqu":
          wx.navigateTo({
            url:'/packageA/pages/yuanqu_re_detail?id='+tempid,
        })
          break;
        case "songci":
          wx.navigateTo({
            url:'/packageA/pages/songci_re_detail?id='+tempid,
        })
          break;
        default:
          wx.showToast({
            title: '出错！！无法跳转',
            icon:'error'
          })
          
   } 
    
    }
  })
  )
  