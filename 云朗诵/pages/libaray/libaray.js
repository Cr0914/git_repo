
Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList:[
    {"id":"1","text":"论语"},
    {"id":"2","text":"诗经"},
    {"id":"3","text":"唐诗"},
    {"id":"4","text":"楚辞"},
    {"id":"5","text":"元曲"},
    {"id":"6","text":"宋词"}],
    inputShowed: false , //初始文本框不显示内容
    Searchinput:''  //搜索关键词
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
  ({Searchinput : e.detail.value}) 

},
//搜索按钮 跳转到搜索到的界面
Searchbutton: function () {
 var that=this;
 wx.setStorageSync('inputKey', this.data.Searchinput)  //将Searchinput的值存入缓存，查找时找inputKey
 wx.navigateTo({
   url:'/packageA/pages/Search_detail' //跳转到查询结果界面
 })
},
//分类 点击去到相应界面
  gotoPoetry: function (e) {
    var Id = e.currentTarget.dataset.bzid;
    if(Id==1)
    { wx.navigateTo
      ({
      url: "/packageA/pages/lunyu_list"   
      });
    }
    if(Id==2)
    { wx.navigateTo
      ({
      url: "/packageA/pages/shijing_list"   
      });
    }
    if(Id==3)
    { wx.navigateTo
      ({
      url: "/packageA/pages/tangshi_list"   
      });
    }
    if(Id==4)
    { wx.navigateTo
      ({
      url: "/packageA/pages/chuci_list"   
      });
    }
    if(Id==5)
    { wx.navigateTo
      ({
      url: "/packageA/pages/yuanqu_list"   
      });
    }
    if(Id==6)
    { wx.navigateTo
      ({
      url: "/packageA/pages/songci_list"   
      });
    }
   
  },
 
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/libaray/libaray',
  };
  },
  onShareTimeline: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/libaray/libaray',
  };
  },
})
