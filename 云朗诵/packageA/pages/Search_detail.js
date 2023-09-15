
// pages/libaray/Search_datail/Search_detail.js
const db = wx.cloud.database();
    const _ = db.command
Page({
  data: {
    poemlist:[],
    key:'',  //搜索关键词
    flag:0,
    search_result:[],
  },

onLoad(options) 
{
  var key=wx.getStorageSync('inputKey')  //let key 全局变量
  //console.log("查询的内容", key)
  this.search_in_database("lunyu",key)  //在论语数据库中查
  this.search_in_database("shijing",key)  //在诗经数据库中查
  this.search_in_database("tangshi",key)  //在唐诗数据库中查
  this.search_in_database("chuci",key)  //在楚辞数据库中查
  this.search_in_database("yuanqu",key)  //在元曲数据库中查

  //console.log("最终的search_result:",this.data.search_result)
 
},

search_in_database(type,key)
{
  var _this=this
  db.collection(type).where(_.or([{
    content: db.RegExp({
      regexp: '.*' + key,
      options: 'i',
    })
  },
  {
    title: db.RegExp({
      regexp: '.*' + key,
      options: 'i',
    })
  }
])).get({
  success: res => {
    _this.setData({
      poemlist:res.data, 
    })
    //console.log("search_in_database",type,_this.data.poemlist)
    var len=_this.data.poemlist.length
    if(len>0)
    {   
      _this.setData({flag:1})
      //console.log(type,":",len)
      //console.log("flag",_this.data.flag)
      _this.insert_chuci_result(_this.data.poemlist,type)
    }
  },   
})
},

insert_chuci_result(poemlist1,type)
 {
  var that =this;
  //console.log("insert",type)
  poemlist1.forEach((item,index)=>{
    let temp = {
      id:item._id,
      title:item.title,
      classType:type,
      content:item.content,
    }
    that.setData({
      temp
    })
    var search_result = that.data.search_result//必须在暂存一下不然报错（说this.data.search_result没有push方法，我也懵了）
    search_result.push(that.data.temp)
    that.setData({search_result: search_result})
    //console.log(type,"insert_success")
    //console.log("函数内：data.search_result：",that.data.search_result)
    })
 },


  //点击跳转到文章详情
  handleGoDetail(e){
    console.log(e)
    var tempid=e.currentTarget.dataset.id
    var type=e.currentTarget.dataset.type
    switch(type) {
      case "lunyu":
        wx.navigateTo({
          url:'/packageA/pages/lunyu_re_datail?id='+tempid,
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
      default:
        wx.showToast({
          title: '出错！！无法跳转',
          icon:'error'
        })      
  } 
  },


})