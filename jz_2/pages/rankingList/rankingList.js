import {
  getRankingList
} from "../../api/index.js";

const app = getApp();
// pages/rankingList/rankingList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingList: [], // 排行榜数组
    bestResult: {}, // 个人最高排行
  },
  // 图片加载错误时执行，将错误的图片地址更换
  photoError(e) {
    const id = e.currentTarget.dataset.id;
    const newRankingList = this.data.rankingList.map(result => {
      if (result.id == id) {
        result.user.photoUrl = "https://fqiang-1300549778.cos.ap-chongqing.myqcloud.com/jz/photo_2.jpg"
      }
      return result;
    })
    this.setData({
      rankingList: newRankingList
    })
  },
  // 请求数据
  requestData() {
    const subject = app.globalData.currentSubject;
    const userId = app.globalData.userInfo.userId;
    const userName = app.globalData.userInfo.name;
    const photoUrl = app.globalData.userInfo.photoUrl;
    // 请求排行榜数据
    getRankingList(subject, userId).then(res => {
      let { topOneHundredResults, bestResult } = res.data.data;
      topOneHundredResults = topOneHundredResults.map(result => this.handleResult(result));
      bestResult = this.handleResult(bestResult);
      bestResult.userName = userName;
      bestResult.photoUrl = photoUrl;
      this.setData({
        bestResult,
        rankingList: topOneHundredResults
      })
    })
  },
  // 处理成绩数据成我想展示的样子
  handleResult(result) {
    // 当该用户还没有考试的时候就为undefined
    if (result.timeConsuming === undefined) {
      return { ...result, timeConsuming: "0分0秒" }
    }
    const timeConsuming = `${Math.floor(result.timeConsuming / 60)}分${result.timeConsuming % 60}秒`;
    return {
      ...result,
      timeConsuming
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.requestData();
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