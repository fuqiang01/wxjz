import { getBestResult } from "../../api/index.js"
const app = getApp();
// pages/testMsg/testMsg.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        subject: 0, // 当前科目
        name: "", // 用户名
        photoUrl: "", // 头像url地址
        score: 0, // 最好成绩
        timeConsuming: "0分0秒", // 耗时
    },
    // 跳转到答题页面
    goAQPage() {
        wx.redirectTo({
            url: "/pages/answerQuestions/answerQuestions"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const { userId, name, photoUrl } = app.globalData.userInfo;
        const subject = app.globalData.currentSubject;
        getBestResult(subject, userId).then(res => {
            const data = res.data.data;
            let score = 0;
            let timeConsuming = "0分0秒";
            // 如果还没有进行过考试就会为undefined
            if(data !== undefined){
                score = data.score;
                timeConsuming = `${Math.floor(data.timeConsuming / 60)}分${Math.floor(data.timeConsuming % 60)}秒`
            }
            this.setData({
                subject,
                name,
                photoUrl,
                score,
                timeConsuming
            })
        })
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