// pages/list2/list2.js
const db = wx.cloud.database()
Page({
  data: {
    start: false,
    isPlay: true,
    musicMenu: false,
    stop: false,
    ifsuspend:false,  //用于判断是否中途退出
    recordingTimeqwe: 0, //录音计时
    setInter: "", //录音时长
    poem: {},
    music: "",
    songItem: [{
        id: 0,
        name: '无',
        value: '',
        checked:true
      },
      {
        id: 1,
        name: '琵琶曲',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E7%BA%AF%E9%9F%B3%E4%B9%90%20-%20%E7%90%B5%E7%90%B6%E6%9B%B2%20(V0).mp3?sign=1e227f55b31eadd4f1141bb2ca74d708&t=1680873724',
        checked:false
      },
      {
        id: 2,
        name: '雪花飘',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E8%8C%83%E7%8E%AE%E5%8D%BF%20-%20%E9%9B%AA%E8%8A%B1%E9%A3%98%20(%E5%8F%A4%E7%AD%9D)%20(V0).mp3?sign=e02ff22405d72f7b56f5e4ced4429982&t=1680873739',
        checked:false
      },
      {
        id: 3,
        name: '淡若晨风',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E5%B7%AB%E5%A8%9C%20-%20%E6%B7%A1%E8%8B%A5%E6%99%A8%E9%A3%8E%20(V0).mp3?sign=970d9e9f313ac57fd62f1373d393e84c&t=1680873762',
        checked:false
      },
      {
        id: 4,
        name: '秋水悠悠',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E5%B7%AB%E5%A8%9C%20-%20%E7%A7%8B%E6%B0%B4%E6%82%A0%E6%82%A0%20(V0).mp3?sign=71c847ef9f3531c9e3ef957156c34e95&t=1680873781',
        checked:false
      },
      {
        id: 5,
        name: '一叶知心',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E5%B7%AB%E5%A8%9C%20-%20%E4%B8%80%E5%8F%B6%E7%9F%A5%E5%BF%83%20(V0).mp3?sign=f85a0131742a3d8237d4e2ab7202625e&t=1680873801',
        checked:false
      },
      {
        id: 6,
        name: '云山夜雨',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E5%B7%AB%E5%A8%9C%20-%20%E4%BA%91%E5%B1%B1%E5%A4%9C%E9%9B%A8%20(V0).mp3?sign=845101fe8f1eebad17c37bf8c6bc0eec&t=1680873813',
        checked:false
      },
      {
        id: 7,
        name: '汉宫秋月',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E4%BA%8E%E7%A7%8B%E6%97%8B%20-%20%E6%B1%89%E5%AE%AB%E7%A7%8B%E6%9C%88%20(V0).mp3?sign=b57c41ed581d29b487a9be973d721637&t=1680873825',
        checked:false
      },
      {
        id: 8,
        name: '大漠敦煌',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E7%BA%AF%E9%9F%B3%E4%B9%90%20-%20%E5%A4%A7%E6%BC%A0%E6%95%A6%E7%85%8C%20(V0).mp3?sign=79af40cffdac9ec3b15d6c0bd47fe136&t=1680873839',
        checked:false
      },
      {
        id: 9,
        name: '梅花三弄',
        value: 'https://7265-recite-zhang-zou-3fyxojo6c4880d7-1317339345.tcb.qcloud.la/song/%E7%BA%AF%E9%9F%B3%E4%B9%90%20-%20%E6%A2%85%E8%8A%B1%E4%B8%89%E5%BC%84%20(%E5%8F%A4%E7%AD%9D%E7%8B%AC%E5%A5%8F)%20(V0).mp3?sign=55168a03756fbe34c413dcb56e0dc07d&t=1680873855',
        checked:false
      },

    ]

  },

  recordingTimer: function() {
    var that = this;
    //将计时器赋值给setInter
    that.data.setInter = setInterval(
      function() {
        var time = that.data.recordingTimeqwe + 1;
        that.setData({
          recordingTimeqwe: time
        })
      }, 1000);
  },

  //挑选背景音乐
  music(e) {
    this.setData({
      musicMenu: true
    })
  },

  modalCancel(e) {
    // 这里面处理点击取消按钮业务逻辑
    this.setData({
      musicMenu: false
    })
    this.audioCtx.stop()
  },

  modalConfirm(e) {
    this.setData({
      musicMenu: false
    })
    this.audioCtx.stop()
  },

  handlechange(e) {
    // 1 获取单选框中的值
    let song = e.detail.value;
    // 2 把值 赋值给 data中的数据
    this.setData({
      music: song
    })
    //3 播放音乐
    let audioCtx = this.audioCtx
    audioCtx.autoplay = true // 允许自动播放
    audioCtx.src = this.data.music //传值
    audioCtx.play()
  },

  //开始录音
  start(e) {
    this.setData({
      start: true
    })
    this.setData({
      isPlay: true
    })
    const options = {
      duration: 300000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3', //音频格式，有效值 aac/mp3 
      frameSize: 50
    }
    //开始录音计时   
    this.recordingTimer();
    this.rm.start(options)
    if(this.audioCtx.src!=""){
      this.audioCtx.play()
    }
  },

  //暂停录音
  pause: function () {
    this.audioCtx.pause()
    this.rm.pause()
    this.setData({
      isPlay: false
    })
  },

  //继续录音
  resume: function () {
    this.rm.resume()
    if(this.audioCtx.src!=""){
      this.audioCtx.play()
    }
    this.setData({
      isPlay: true
    })
  },

  //停止录音
  stop: function () {
    this.audioCtx.pause()
    this.rm.pause()
    this.setData({
      isPlay: false
    })
    this.setData({
      stop: true
    })
  },

  stopCancel(e) {
    this.setData({
      stop: false
    })
  },
  //确定停止并上传
  stopConfirm(e) {
    this.setData({
      stop: false,
      start: false,
      ifsuspend:false
    })
    //结束录音计时  
    wx.disableAlertBeforeUnload() //关闭小程序页面返回询问对话框
    clearInterval(this.data.setInter);
    this.audioCtx.stop()
    this.rm.stop()
  },

  onLoad: function (options) {
    //载入古诗词
    let that = this
    db.collection(options.type).where({
      _id: options.id
    }).get({
      success(res) {
        that.setData({
          poem: res.data[0]
        })
      }
    })

    wx.enableAlertBeforeUnload({
      message: "您的数据还未保存，确定要退出吗？",
      success: function (res) {
        that.setData({ifsuspend:true})
        //that.rm.stop()
      },
      fail: function (err) {
          that.setData({ifsuspend:true})
          that.rm.stop()
          console.log("失败：", err);
      },
  });

    //录音部分
    this.rm = wx.getRecorderManager()
    this.rm.onStop((res) => {
      if(this.data.ifsuspend) return;
      /*跳转并传参*/
      var recite_data = {
        poem_type: options.type,
        poem_id: options.id,
        poem_title:this.data.poem.title,
        poem_author:this.data.poem.author,
        tempFilePath: res.tempFilePath
      }
      const details = encodeURIComponent(JSON.stringify(recite_data));
      // 当前要跳转到另一个界面，不保留现有界面
      wx.redirectTo({
        url: './diy?details='+details
      });
      

    })

    //背景音乐
    this.audioCtx = wx.createInnerAudioContext()
  },

  onUnload: function() {
    //this.rm = wx.getRecorderManager()
    this.rm.stop()
    this.audioCtx.stop()
  },
})