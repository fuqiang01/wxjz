
const app = getApp()
// pages/page/page.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgSrc: '',
        num: 0,
        sumObj: {}
    },
    onTap(e) {
        let type = e.currentTarget.dataset.type;
        const testV = e.currentTarget.dataset.testv;
        if ( type === 'wrong' && this.data.sumObj.wrong === 0) {
            wx.showToast({
                title: '当前没有错题',
                icon: 'success',
            })
            return;
        } else if ( type === 'order' && this.data.sumObj.achieve === this.data.sumObj.allNum ) {
            wx.showToast({
                title: '题目已做完',
                icon: 'success',
            })
            return;
        }
        const urlPath = testV ? '/newinfo/newinfo' : '/info/info';
        wx.navigateTo({
            url: `/pages${urlPath}?num=${this.data.num}&type=${type}`
        })
    },
    querySum(id){ // 请求数量数据
        const self = this;
        wx.request({
            url: 'https://www.fqiang.co/getSum',
            data: {
                type: this.data.num,
                userId: id
            },
            method: 'GET',
            success(res) {
                self.setData({
                    sumObj: res.data
                })
                console.log(res.data)
            },
            fail(err) {
                // console.log(err);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.hideShareMenu();
        let title = '';
        if ( options.num == 1 ) {
            title = '科目一';
            this.setData({
                imgSrc: '/img/bg1.jpg',
                num: options.num
            })
        } else {
            title = '科目四';
            this.setData({
                imgSrc: '/img/bg2.jpg',
                num: options.num
            })
        }
        wx.setNavigationBarTitle({
            title
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
        let self = this;
        wx.showLoading({
            mask: true,
            title: '加载中...'
        })
        if(app.globalData.userId){ //判断用户是否登录
            self.querySum(app.globalData.userId);
            wx.hideLoading();
        } else {
            app.onLogin( data => {
                self.querySum(data);
                wx.hideLoading();
            })
        }
        
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
            path: '/pages/index/index',
            imageUrl: '/img/share.jpg'
        }
    }
})