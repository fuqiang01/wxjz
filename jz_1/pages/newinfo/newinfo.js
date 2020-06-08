const app = getApp()
const util = require('../../utils/util.js');
// pages/info/info.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        num: '', // 科目，1代表科目一，4代表科目四
        type: '', // 类型，顺序练习或模拟考试或错题回顾
        topicArr: [], // 题目对象集合
        current: 0, // swiper当前的显示页
        showIndex: 0, //显示项为当前题目数组的第几项
        yesNum: 0, // 模拟测试中，做对的题目总数
        didArr: [], // 存放做过了的题的信息，[{id: ..., classList: [...]}]
        sumObj: {}, // 存放做对的题数量，做错的题的数量和题目总数
        timerStart: false, // 计时器是否开始运行
    },
    correct(e) { // 题目做正确了执行
        this.addDidArr(e.detail);
        if (this.data.type === 'test') {
            this.setData({
                yesNum: this.data.yesNum + 1
            })
        } else {
            wx.request({
                url: 'https://www.fqiang.co/addYesId',
                data: {
                    type: this.data.num,
                    topicType: this.data.type,
                    id: e.detail.id,
                    userId: app.globalData.userId
                },
                method: 'GET'
            })
        }
        this.changeSumObj('yes');
        this.toNext();
    },
    toNext() {
        if (this.isLastTopic()) return;
        this.setData({
            current: this.data.showIndex + 1
        })
    },
    wrong(e) { // 题目做错执行
        this.addDidArr(e.detail);
        this.changeSumObj('no');
        if (this.data.type === 'test') return;
        wx.request({
            url: 'https://www.fqiang.co/addWrongId',
            data: {
                type: this.data.num,
                topicType: this.data.type,
                id: e.detail.id,
                userId: app.globalData.userId
            },
            method: 'GET'
        })
    },
    onFinish(e) { // swiper动画结束时触发
        this.setData({
            showIndex: e.detail.current
        })
    },
    addDidArr(obj) {
        this.setData({
            didArr: [...this.data.didArr, obj]
        })
    },
    setTopicArr(options) { // 根据类型请求题目数据
        let self = this;
        let title = '';
        wx.showLoading({
            mask: true,
            title: '加载中...'
        })
        switch (options.type) {
            case 'order': //顺章练习
                title = '顺章练习';
                wx.request({
                    url: 'https://www.fqiang.co/getTopicForSome',
                    data: {
                        type: options.num,
                        userId: app.globalData.userId
                    },
                    method: 'GET',
                    success(res) {
                        self.setData({
                            topicArr: res.data
                        })
                        wx.hideLoading();
                        wx.request({
                            url: 'https://www.fqiang.co/getTopic',
                            data: {
                                type: options.num,
                                userId: app.globalData.userId
                            },
                            method: 'GET',
                            success(res) {
                                const newArr = self.data.topicArr.concat(res.data);
                                self.setData({
                                    topicArr: util.removeDuplicateForObjArr(newArr)
                                })
                            }
                        })
                    }
                })
                break;

            case 'test': //模拟考试
                title = '模拟考试';
                wx.request({
                    url: 'https://www.fqiang.co/getTestTopic',
                    data: {
                        type: options.num
                    },
                    method: 'GET',
                    success(res) {
                        self.setData({
                            topicArr: res.data
                        })
                        wx.hideLoading();
                        wx.showModal({
                            title: '考试规则',
                            content: '考试时间: 30分钟\r\n考试题目: 50道(科目一50题皆为单选,科目四前40题单选后10题多选)',
                            //是否显示取消按钮,默认值true
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    self.setData({
                                        timerStart: true
                                    })
                                }
                            }
                        })
                    },
                    fail(err) {
                        console.log(err);
                    }
                })
                break;

            case 'wrong': //错题回顾
                title = '错题回顾';
                wx.request({
                    url: 'https://www.fqiang.co/getWrongTopic',
                    data: {
                        type: options.num,
                        userId: app.globalData.userId
                    },
                    method: 'GET',
                    success(res) {
                        self.setData({
                            topicArr: res.data
                        })
                        wx.hideLoading();
                    },
                    fail(err) {
                        console.log(err);
                    }
                })
        }
        wx.setNavigationBarTitle({
            title
        })
    },
    setSumObj() { // 请求题目数量数据
        let self = this;
        if (this.data.type === 'test') {
            this.setData({
                sumObj: {
                    yes: 0,
                    no: 0,
                    all: 50
                }
            })
            return;
        }
        wx.request({
            url: 'https://www.fqiang.co/getSum',
            data: {
                type: this.data.num,
                userId: app.globalData.userId
            },
            method: 'GET',
            success(res) {
                self.setData({
                    sumObj: {
                        yes: res.data.achieve - res.data.wrong,
                        no: res.data.wrong,
                        all: res.data.allNum
                    }
                })
            }
        })
    },
    changeSumObj(state) { // 修改题目数据
        switch (state) {
            case 'yes':
                this.setData({
                    'sumObj.yes': this.data.sumObj.yes + 1,
                })
                break;
            case 'no':
                this.setData({
                    'sumObj.no': this.data.sumObj.no + 1,
                })
        }
    },
    getResults() {
        const results = this.data.yesNum * 2;
        const str = results >= 90 ? '成绩合格' : '成绩不合格';
        wx.showModal({
            title: '考试结束',
            content: `${str},分数：${results}分`,
            //是否显示取消按钮,默认值true
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    wx.reLaunch({
                        url: '/pages/index/index'
                    })
                }
            }
        })
    },
    onOver() {
        this.getResults();
    },
    isLastTopic() {
        if (this.data.showIndex >= this.data.topicArr.length - 1) { // 到了最后一题了
            if (this.data.type === 'test') { // 做的模拟考试
                this.getResults();
                return true;
            }
            wx.showToast({
                title: '已经是最后一题',
                icon: 'success',
            })
            return true;
        }
        return false;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            type: options.type,
            num: options.num
        })
        this.setTopicArr(options);
        this.setSumObj();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

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
            path: '/pages/index/index',
            imageUrl: '/img/share.jpg'
        }
    }
})