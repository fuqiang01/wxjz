import {
  getMarkByType
} from "../../api/index.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNumber: 0, // 页码
    pageCapacity: 10, // 页容量
    isLastPage: false, // 是否是最后一页
    trafficSignsList: [], // 标志数据的数组
  },
  // 请求数据
  requestMarkByType() {
    // 如果已经加载到最后一页了，就不再发送请求了
    if (this.data.isLastPage) return;
    const markType = app.globalData.markType;
    const signsType = app.globalData.signsType;
    const pageNumber = this.data.pageNumber;
    const pageCapacity = this.data.pageCapacity;
    getMarkByType(markType, signsType, pageNumber, pageCapacity).then(res => {
      const data = res.data.data;
      // 看看是不是最后一页
      if (data.length < pageCapacity) {
        this.setData({
          isLastPage: true
        })
      }
      this.setData({
        pageNumber: pageNumber + 1,
        trafficSignsList: [...this.data.trafficSignsList, ...data]
      })
    })
  },
  // 跳转到标志详情列表页
  goTSILPage(e) {
    const { index } = e.currentTarget.dataset;
    app.globalData.markInfoListIndex = index;
    wx.navigateTo({
      url: "/pages/trafficSignsInfoList/trafficSignsInfoList"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestMarkByType();
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
    // 页面触底再次请求数据
    this.requestMarkByType();
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