// index.js

const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: '',
    theme: '',
    id: '',
    openid: '',
  },
  onLoad(e) {
    //console.log(e.id)
    this.setData({
      openid: e.id
    })
    var openid = this.data.openid
    this.updata(openid)
  },
  onshow() {
    var openid = this.data.openid
    this.updata(openid)
  },
  updata(openid) {

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

  onChooseAvatar(e) {
    var that = this
    const {
      avatarUrl
    } = e.detail
    console.log("temp:", avatarUrl)
    var openId = that.data.openid
    console.log("onChooseAvatar_openId", openId)
    wx.cloud.uploadFile({
      cloudPath: "user_img/" + openId + ".jpg",
      filePath: avatarUrl,
      success: function (res) {
        console.log(res)
        //上传成功后使用后台返回的图片路径
        that.setData({
          avatarUrl: res.fileID
        });
        console.log("上传图片成功", that.data.avatarUrl)
      }
    })
  },
  formSubmit(e) {
    console.log('昵称：', e.detail.value.nickname)
    this.setData({
      theme:e.detail.value.nickname
    })
    console.log("头像：", this.data.avatarUrl)

    //更新数据库昵称头像
    db.collection("user").doc(this.data.id).update({
      data: {
        nickName: e.detail.value.nickname,
        avatarUrl: this.data.avatarUrl
      },
      success: function () {
        wx.showToast({
          title: '提交成功',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 获取当前页面
    const pages = getCurrentPages();
    // 获取上一级页面
    const beforePage = pages[pages.length - 2];

    beforePage.setData({ //直接修改上个页面的数据（可通过这种方式直接传递参数）
      // backRefresh: true //函数封装，传值为true时调接口刷新页面
      userInfo_img: this.data.avatarUrl, //用户头像
      userInfo_name:this.data.theme, //用户昵称
    })
  },
})