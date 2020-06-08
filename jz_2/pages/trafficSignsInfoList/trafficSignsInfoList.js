import {
  getMarkByType
} from "../../api/index.js"
const app = getApp();
// 当前版本的轮播图在缩放还是有些bug，暂时没有什么好解决方案
let prev = null;
Page({
  data: {
    current: 0, // 用来初始化轮播图应该显示第几个
    showIndex: 0, // 当前显示的的是第几个，初始化的时候一定要跟current的值保持一致
    activeScale: 1.1, // 当前显示项的缩放值
    nextScale: 1, // 前一项以及后一项的缩放值
    dataList: [], // 数据
    minIndex: 0, // 当前轮播图显示最前边的一张应该是数组的第几项 
    showCount: 5, // 一共需要显示几页轮播图  
  },
  // 滑块运动时触发，动态改变滑块的scale
  onTransition(e) {
    // 正方向：0 ~ 326  -326 ~ 0  反方向：0 ~ -326 -326 ~ -652
    const dx = e.detail.dx;
    // 计算差值
    const num = dx - prev;
    // 如果上一次的dx值为null说明是刚开始动，就初始化一下值，不干别的
    if (prev == null) {
      prev = dx;
      return;
    }
    prev = dx;
    // 计算新的缩放值
    const activeScale = this.data.activeScale - Math.abs(num / 3260);
    const nextScale = this.data.nextScale + Math.abs(num / 3260);
    this.setData({
      activeScale,
      nextScale
    })
  },
  // 动画结束时触发
  onFinish(e) {
    // 将前一次dx的值初始化为空，缩放
    // prev = null;
    let { minIndex, showCount } = this.data;
    let current = e.detail.current;
    // 获取正常情况下应该显示在第几页
    const centerIndex = Math.ceil(showCount / 2) - 1;
    if (
      // 如果当前的页码大于了应该居中显示的页码，那么就让轮播图列表的最前边一张消失，在最后边添加一张
      // 还要判断是否已经显示到了最后一张了，如果显示到了最后一张了那就不用再调整显示数量以及当前显示的第几页了
      (current > centerIndex && minIndex + showCount < this.data.dataList.length) ||
      // 如果当前页码小于了应该居中显示的页码，那么就让轮播图最前边添加一张，最后边消失一张
      // 还要判断是否已近显示到第一张了，如果是则不用调整
      (current < centerIndex && minIndex > 0)
    ) {
      minIndex = minIndex + current - centerIndex;
      current = centerIndex;
      this.setData({
        minIndex,
        current
      })
    }
    // 将以下数值更新
    this.setData({
      showIndex: minIndex + current,
      // activeScale: 1.1,
      // nextScale: 1
    })
    // 动态设置当前标题
    wx.setNavigationBarTitle({
      title: `${this.data.showIndex + 1}/${this.data.dataList.length}`
    });
  },
  // 请求数据
  requestMarkByType() {
    const index = app.globalData.markInfoListIndex;
    const markType = app.globalData.markType;
    const signsType = app.globalData.signsType;

    // 显示加载框
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    getMarkByType(markType, signsType).then(res => {
      const data = res.data.data;
      const len = data.length;
      wx.hideLoading();
      // 计算如果是居中显示的话，那么curren的值是多少
      const centerIndex = Math.ceil(this.data.showCount / 2) - 1;
      // 计算minIndex的值
      let minIndex = index - centerIndex;
      if (minIndex < 0) {
        minIndex = 0;
      } else if (minIndex + this.data.showCount > len) {
        minIndex = len - this.data.showCount;
      }
      // 计算current的值
      let current = centerIndex;
      if (index <= centerIndex) {
        current = index;
      } else if (index >= len - centerIndex) {
        current = centerIndex - len + index + 1 + centerIndex;
      }
      this.setData({
        dataList: res.data.data,
        current,
        showIndex: current + minIndex,
        minIndex
      })
      // 动态设置当前标题
      wx.setNavigationBarTitle({
        title: `${index + 1}/${res.data.data.length}`
      });
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