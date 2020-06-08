import {
    getTagByScore
} from "../../utils/util.js"
import { updateNameAndPhoto } from "../../api/index.js"
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        result: 0,
        tag: '',
        photoUrl: ''
    },
    // 获取用户信息
    getUserInfo(e) {
        const userInfo = e.detail.userInfo;
        if (userInfo !== undefined) {
            app.globalData.userInfo.name = userInfo.nickName;
            app.globalData.userInfo.gender = userInfo.gender;
            app.globalData.userInfo.photoUrl = userInfo.avatarUrl;
            const userId = app.globalData.userInfo.userId;
            // 上传用户信息
            updateNameAndPhoto(userId, userInfo.nickName, userInfo.avatarUrl);
            this.goRLPage();
        } else {
            wx.showModal({
                title: "需要登陆才可以查看排行榜哦！",
                showCancel: false
            })
        }
    },
    // 设置导航栏背景色
    setNavBg(result) {
        const color = result >= 90 ? "#0BBFE5" : "#E28951";
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: color
        })
    },
    // 本次错题
    goTestWrongTopic(){
        app.globalData.practiceType = 'testWrong';
        wx.reLaunch({
            url: "/pages/answerQuestions/answerQuestions"
        })
    },
    // 跳转到历史成绩页面
    goHRPage(){
        wx.reLaunch({
            url: '/pages/historyResult/historyResult'
        })
    },
    // 跳转到成绩排行榜页面
    goRLPage(){
        wx.reLaunch({
            url: '/pages/rankingList/rankingList'
        })
    },
    // 重新考试
    testAgain(){
        // 重新考试的话，当前信息并没有被修改，直接跳转到答题页面就好了
        wx.reLaunch({
            url: "/pages/answerQuestions/answerQuestions"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {score} = app.globalData.testResult;
        const tag = getTagByScore(score);
        const photoUrl = app.globalData.userInfo.photoUrl;
        this.setData({
            result: score,
            tag,
            photoUrl
        })
        this.setNavBg(score);
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