// pages/show/show.js
var app = getApp()
const user_openid = app.globalData.openid
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ID: "",
    userid: "",
    poem: {},
    say: "",
    time: "",
    isPlay: false,
    play: {
      currentTime: '00:00',
    },
    //用户头像昵称
    user_img:"",
    user_name:"",
    /*送花数据*/
    flower: 0,
    like: false,
    owner_openid:user_openid,
    /*评论数据*/
    commentList:'',
    pinlun:'',
    pinlun_nickName:"",//当前用户头像。昵称
    pinlun_avatarUrl:""
  },

  /*加载诗词*/
  load_poem(re) {
    let that = this
    db.collection(re.poem_type).where({
      _id: re.poem_id
    }).get({
      success(res) {
        that.setData({
          poem: res.data[0]
        })
      }
    })
  },

  play_on(e) {
    this.setData({
      isPlay: true
    })
    this.audioCtx.play()
  },

  play_off(e) {
    this.setData({
      isPlay: false
    })
    this.audioCtx.pause()
  },

  uplike(e) {
    let that = this
    // 表示数据只会更新age字段, 其他字段不会改变
    db.collection('recite').doc(this.data.ID).update({
      data: {
        flower: this.data.flower + 1
      }
    }).then(res => {
      that.setData({
        like: true,
        flower: that.data.flower + 1
      })
    })
    db.collection('user').doc(this.data.userid).update({
      data: {
        likes: db.command.push(this.data.ID)
      }
    })
  },

  offlike(e) {
    let that = this
    db.collection('recite').doc(this.data.ID).update({
      data: {
        flower: this.data.flower - 1
      }
    }).then(res => {
      that.setData({
        like: false,
        flower: that.data.flower - 1
      })
    })
    db.collection('user').doc(this.data.userid).update({
      data: {
        likes: db.command.pull(this.data.ID)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //录音播放器
    this.audioCtx = wx.createInnerAudioContext()
    this.audioCtx.autoplay = false // 不允许自动播放
    wx.showToast({title: '加载中',icon: 'loading',duration:500})
    let that = this
    db.collection('recite').where({
      _id: options.id
    }).get({
      success(res) {
        /*加载诗词、录音和送花*/
        var re = res.data[0]
        that.setData({
          ID: re._id,
          say: re.say,
          flower: re.flower,
          time: re.time,
          owner_openid:re._openid
        })
        that.load_poem(re)
        //console.log(that.data)
        that.find_likes(user_openid)
        that.setMusic(re._id)
        that.updata(that.data.owner_openid)
      } //success
    }) //get闭合

    this.audioCtx.onEnded(function () {
      that.audioCtx.stop()
      that.setData({
        isPlay: false
      })
    })
    // 评论更改：获取当前用户头像昵称
    db.collection('user').where({_openid:user_openid}).get({
      success: (res) => {
        this.setData({
          pinlun_avatarUrl: res.data[0].avatarUrl,
          pinlun_nickName: res.data[0].nickName,
        })
      }
    })
    // 获取评论留言
    db.collection('recite').where({_id:options.id}).get(
      {
        success: (res) => {
          console.log("1111",res.data[0].commentList)
          console.log(res.data[0].commentList.length)
              for (let i = res.data[0].commentList.length - 1, j = 0; i >= 0; i-- , j++) {
                //console.log(res.data[0].commentList[j])
                var commentList = "commentList[" + j + "]";
                that.setData({
                  [commentList]:res.data[0].commentList[i],
                })		//将评论区刷新，显示最新的留言
              }
          console.log("commentList:",this.data.commentList)
        }
      }
    )
    
  },
  //获取发布者用户头像
  updata(owner_openid) {

    db.collection('user').where({
      _openid: owner_openid
    }).get({
      success: (res) => {
        this.setData({
          user_img: res.data[0].avatarUrl,
          user_name: res.data[0].nickName,
        })
      }
    })
  },
  // 音乐播放
  setMusic: function (id) {
    this.audioCtx.src = "cloud://recite-zhang-zou-3fyxojo6c4880d7.7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345/record/"+ id +".mp3"
    this.setData({
      'play.currentTime': '00:00',
    })
  },


  //查找函数，用户有没有点过赞
  find_likes(opid) {
    let that = this
    db.collection('user').where({
      _openid: opid
    }).get({
      success(res) {
        that.setData({
          userid: res.data[0]._id
        })
        if (res.data[0].likes.indexOf(that.data.ID) >= 0) {
          that.setData({
            like: true
          })
        } else {
          that.setData({
            like: false
          })
        }
        //console.log(that.data)
      }
    })
  },

  
 /**
   // 评论功能变化部分
   */
  pinlun(e){this.setData({pinlun:e.detail.value})},
  send()
  {
    var name=this.data.pinlun_nickName
    var image=this.data.pinlun_avatarUrl
    var id=this.data.ID
    const _=db.command
    if(this.data.pinlun == ''){wx.showToast({title: '请输入完整！',icon:'none'})}
    else{
      var pinlun = this.data.pinlun
      db.collection('recite').doc(id).update
      ({
        data:{
          commentList:_.push({name,pinlun,image})
        }
      })
      wx.showToast({
        title: '评论成功',
      })	//成功将评论数据写入小程序云开发数据库
    }
    //更新评论区
    var newComment=[{name,pinlun,image}];
    this.data.commentList = newComment.concat(this.data.commentList);
    this.setData({
      commentList: this.data.commentList,
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    // 自动更新播放进度
    this.audioCtx.onTimeUpdate(function () {
      that.setData({
        'play.currentTime': formatTime(that.audioCtx.currentTime)
      })
    })
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    }
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
    this.audioCtx.stop()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})