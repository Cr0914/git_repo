// pages/diy/diy.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    author: "",
    tempFilePath: "",
    id: "",
    type: "",
    share: true,
    say:"",
    time:"",
    up:false,
    isPlay: false,
    play: {
      currentTime: '00:00',
    }
  },

  checked(e) {
    if (e.detail.value == '') {
      this.setData({
        share: false
      }) //表示未选中
    } else {
      this.setData({
        share: true
      }) //表示选中状态
    }
  },
  context(e){
    if(e.detail.value==""){
      this.setData({say:"该用户没有留言~"})
    }
    else{
      this.setData({say:e.detail.value})
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const details = JSON.parse(decodeURIComponent(options.details));
    this.setData({
      title: details.poem_title,
      author: details.poem_author,
      id: details.poem_id,
      type: details.poem_type,
      tempFilePath: details.tempFilePath,
    })

    wx.enableAlertBeforeUnload({
      message: "您的数据还未保存，确定要退出吗？",
      success: function (res) {
      },
      fail: function (err) {
          console.log("失败：", err);
      },
  });
  //录音播放器
  let that=this
  this.audioCtx = wx.createInnerAudioContext()
  this.audioCtx.autoplay = false // 不允许自动播放
  this.audioCtx.onEnded(function () {
    that.audioCtx.stop()
    that.setData({isPlay: false})
    that.setMusic()
  })
  },
  // 音乐播放
  setMusic: function () {
    this.audioCtx.src = this.data.tempFilePath
    this.setData({
      'play.currentTime': '00:00',
    })
  },

  ifupload(e){
    this.setData({up:true})
  },
  //弹窗取消
  upCancel(e) {
    this.setData({
      up: false
    })
  },
  //确定并上传
  upConfirm(e){
    this.setData({up: false})
    wx.showToast({title: '上传中',icon: 'loading',duration: 3000
})
    var time = util.formatTime(new Date());
    this.setData({time: time})
    this.up()
  },

  up(){
    let db = wx.cloud.database() //获取数据库信息
    let that = this
    if (that.data.say == "") {
      that.setData({
        say: "该用户没有留言~"
      })
    }
    db.collection('recite').add({
      data: {
        share: that.data.share,
        poem_type: that.data.type,
        poem_id: that.data.id,
        poem_title:that.data.title,
        poem_author:that.data.author,
        say:that.data.say,
        flower:0,
        time:that.data.time,
      }
    }).then(res=>{
      var useId=res._id
      wx.cloud.uploadFile({
        cloudPath: "record/" + useId + '.mp3',
        filePath: that.data.tempFilePath,
      }).then(res => {
        // 成功回调
        wx.disableAlertBeforeUnload() //关闭小程序页面返回询问对话框
        wx.hideToast({})
        wx.navigateBack({
          delta: 1
        });
      })
    }).catch(err => {
        wx.showToast({title: '上传失败！',icon: 'none',duration: 2000})
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that=this
    that.setMusic()
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