var app = getApp()
const user_openid = app.globalData.openid
console.log("11",app.globalData.openid)
const defualt_img = "https://th.bing.com/th/id/OIP.U53Y1BMi-ohnDsMBDouQEQAAAA?w=180&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
const db = wx.cloud.database() //获取数据库信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo_img: '', //用户头像
    userInfo_name: '', //用户昵称
    islogin: false, //声明一个变量,默认为false,一旦登录成功,改为true
    openid: user_openid,

  },
onLoad()
{

  this.setData({
    openid: app.globalData.openid,
  })
 
},
onShow()
{
  var openid=this.data.openid
  console.log("刷新用户",openid)
  if(openid!='1')
  {  
    console.log("刷新用户",openid)
    this.updata(openid)
  }
},
updata(openid)
  {
    db.collection('user').where({
      _openid: openid
    }).get({
      success: (res) => {
        console.log("openid", openid)
        console.log('information_onload', res) //执行成功后打印
        this.setData({
          avatarUrl: res.data[0].avatarUrl,
          theme: res.data[0].nickName,
          id: res.data[0]._id,
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  submit() {
    if (this.data.islogin) {
      return; //若已经登录,则直接返回,不会执行后面的语句
    }
    
    wx.getUserProfile({
      desc: '获取用户信息用于维护会员权益',
      lang: 'zh_CN',
      success: (res) => {
        
        console.log('获取用户信息', res.userInfo)
        //将用户数据存入data,更新UI
        this.setData({
          islogin: true, //登录成功,改为true
        })
        var opid=this.data.openid
        console.log("opid=",opid)
        this.login(opid)
      }
    })
  },
  //访问自己家数据库执行登录业务
  //1.若在users集合中找到用户信息,那么直接更新UI
  //2.若在users集合中没有找到用户信息,执行注册业务
  login(openid) {

    //users集合有权限设置,导致只能查到自己以前添加过得数据
    db.collection('user').where({
      _openid: openid
    }).get().then(res => {
      console.log('查询当前用户', res)
      console.log(res.data.length)
      if (res.data.length == 0) { //没有查到用户
        this.regist() //调一个方法,去注册
      } else { //查到了用户
        //let userInfo=res.data[0]
        //wx.setStorageSync('userInfo', userInfo);//把最新数据放入缓存
        this.setData({
          userInfo_img: res.data[0].avatarUrl,
          userInfo_name: res.data[0].nickName,
        })
      }
    })
  },
  //注册业务  将userInfo存入user集合
  regist() {
    var num = Math.floor(Math.random() * 9999) //随机生成用户名
    var tempname = "用户" + num.toString()
    let db = wx.cloud.database() //获取数据库信息
    db.collection('user').add({ //注册生成随机昵称放入数据库
      data: {
        nickName: tempname,
        avatarUrl: defualt_img,
      },
      success: (res) => {
        console.log('注册用户', res) //执行成功后打印
        this.setData({
          userInfo_img: defualt_img,
          userInfo_name: tempname,
        })
      }
    })
  },

  goto_shoucang() {
    wx.navigateTo({
      url: '/packageD/pages/shoucang',
    })
  },
  goto_langsong() {
    wx.navigateTo({
      url: '/packageD/pages/my_recite',
    })
  },
  goto_information() {
    wx.navigateTo({
      url: '/packageD/pages/information?id='+this.data.openid,
    })
  },
  goto_help() {
    wx.navigateTo({
      url: '/packageD/pages/help',
    })
  },
  goto_about_us() {
    wx.navigateTo({
      url: '/packageD/pages/about_us',
    })
  },
  onPullDownRefresh() {
  var openid=this.data.openid
  console.log("刷新用户",openid)
  if(openid!='1')
  {  
    console.log("刷新用户",openid)
    this.updata(openid)
  }
    wx.stopPullDownRefresh()
  },
  onShareAppMessage: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/person/person',
  };
  },
  onShareTimeline: function () {
    return {
     title: "子元朗诵阁",
   path: '/pages/person/person',
  };
  },
})