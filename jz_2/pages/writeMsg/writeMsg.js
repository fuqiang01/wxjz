import urls from "../../api/urls.js";
import { addMessage } from "../../api/index.js"

const app = getApp()
// pages/writeMsg/writeMsg.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [], // 展示图片的地址
        cosUrls: [], // 在cos上的地址，也就是要上传到数据库中的数据
        uploadImgOk: true, // 图片是否全部上传完成
        loading: false, // 是否为上传中
        inputValue: '', // 文本框中的内容
    },
    // 输入框输入事件
    onInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    // 上传图片
    uploadImg() {
        const _this = this;
        wx.chooseImage({
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                _this.setData({
                    imgUrls: [..._this.data.imgUrls, ...tempFilePaths],
                    uploadImgOk: false
                })
                tempFilePaths.forEach(url => {
                    wx.uploadFile({
                        url: urls.baseUrl + urls.addFileToCos,
                        filePath: url,
                        name: 'file',
                        timeout: 1000 * 60 * 5, // 请求超时时间，5分钟
                        success(res) {
                            const fileName = JSON.parse(res.data).data;
                            _this.setData({
                                cosUrls: [..._this.data.cosUrls, fileName]
                            })
                            // 判断是否全部图片上传完毕
                            if (_this.data.cosUrls.length === _this.data.imgUrls.length) {
                                _this.setData({
                                    uploadImgOk: true
                                })
                                // 看看用户是否点击提交了，但是因为图片没上传完导致未上传，如果是那就现在上传
                                if (_this.data.loading) {
                                    _this.onSubmit();
                                }
                            }
                        },
                        fail(err){
                            wx.hideLoading();
                            wx.showModal({
                                title: '请求超时',
                                content: '服务器带宽太小，不建议上传总大小超过5M的图片',
                                showCancel: false,
                                success(){
                                    _this.setData({
                                        imgUrls: [],
                                        cosUrls: []
                                    })
                                }
                            });
                        }
                    })
                })

            }
        })
    },
    // 提交
    onSubmit() {
        wx.showLoading({
            title: "上传中"
        })
        this.setData({
            loading: true
        })
        if (!this.data.uploadImgOk) return;
        const content = this.data.inputValue;
        const imgUrls = this.data.cosUrls.join(";");
        if (content === "" && imgUrls === "") {
            this.setData({
                loading: false
            })
            wx.showModal({
                title: "没有发现可提交的内容！",
                showCancel: false
            })
            return;
        }
        const userId = app.globalData.userInfo.userId;
        addMessage(userId, imgUrls, content).then(res => {
            wx.showToast({
                title: "上传完成"
            })
            wx.switchTab({
                url: "/pages/message/message"
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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