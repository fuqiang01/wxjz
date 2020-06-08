import { updateNameAndPhoto } from "../../api/index.js"
const app = getApp();
// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    name: "",
    photoUrl: "https://fqiang-1300549778.cos.ap-chongqing.myqcloud.com/jz/photo_1.jpg"
  },
  // 获取用户信息
  getUserInfo: function (e) {
    const userInfo = e.detail.userInfo;
    // 用户点击拒绝，userInfo就为undefined
    if(userInfo == undefined) return;
    const name = e.detail.userInfo.nickName;
    const photoUrl = e.detail.userInfo.avatarUrl;
    app.globalData.userInfo.name = name;
    app.globalData.userInfo.photoUrl = photoUrl;
    this.setData({
      hasUserInfo: true,
      name,
      photoUrl
    })
    // 上传用户信息
    const userId = app.globalData.userInfo.userId;
    updateNameAndPhoto(userId, name, photoUrl);
  },
  // 切换题库当前还不支持，直接弹窗
  switchTopicList() {
    wx.showModal({
      title: "当前仅支持摩托车三轮车，其他车型敬请期待",
      showCancel: false
    })
  },
  // 跳转到留言界面
  goMPage() {
    wx.switchTab({
      url: "/pages/message/message"
    })
  },
  // 跳转到关于我们界面
  goAboutPage() {
    wx.navigateTo({
      url: "/pages/about/about"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo.name !== null) {
      this.setData({
        hasUserInfo: true,
        name: app.globalData.userInfo.name,
        photoUrl: app.globalData.userInfo.photoUrl
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '摩托车驾照理论题',
      path: '/pages/index/index'
    }
  }
})