import { getChapterTypeTopicNumber } from "../../api/index.js"
const app = getApp();
// pages/chapterList/chapterList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        numObj: {}
    },
    // 请求各类型的数量
    requestNumber() {
        const subject = app.globalData.currentSubject;
        getChapterTypeTopicNumber(subject).then(res => {
            this.setData({
                numObj: res.data.data
            })
        })
    },
    // 跳转到答题页面
    goAQPage(e) {
        const { type, practice } = e.currentTarget.dataset;
        app.globalData.practiceType = practice;
        app.globalData.typeValue = type;
        wx.navigateTo({
            url: "/pages/answerQuestions/answerQuestions"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.requestNumber()
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