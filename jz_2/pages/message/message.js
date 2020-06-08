import {
  getMessageByPage,
  getSuperUserMessages,
  updateNameAndPhoto,
  getMessagesByUser,
  replyMessage,
  getNotReadMessage
} from "../../api/index.js";
import {
  addZero
} from "../../utils/util.js"
const app = getApp();
Page({

  data: {
    replyInputShow: false, // 是否显示回复对话框
    currentReplyMsgId: 0, // 当前点击回复按钮的新闻id
    replyValue: "", // 回复的内容
    replyInputBottom: 0, // 回复框的bottom定位值
    isSuper: false, //是否为超级用户
    pageNumber: 0, // 当前第几页，从0开始
    pageCapacity: 10, // 每一页显示多少条
    msgList: [], // 留言数组
    isLastPage: false, // 是否是最后一页
    isAllMessagePage: true, // 当前是否是所有留言的界面
    isPreviewImage: false, // 因为每次显示页面都要触发一次下拉刷新，但是全屏浏览图片后再返回也会触发，所以这里设置一个值判断当前是否是在预览图片
  },
  // 输入框聚焦事件
  onFocus(e) {
    // fixed定位的input元素，在键盘拉取的时候回自动让光标的位置平齐键盘的最上边，所以这里设置一个bottom为10rpx显示就很好
    this.setData({
      replyInputBottom: 10
    })
  },
  // 输入框失焦事件 
  onBlur(e) {
    // 失焦让bottom的值重置为0
    this.setData({
      replyInputBottom: 0,
      replyInputShow: false
    })
  },
  // 输入框输入事件
  onInput(e) {
    this.setData({
      replyValue: e.detail.value
    })
  },
  // 发送回复消息
  onReply() {
    const text = this.data.replyValue;
    const userId = app.globalData.userInfo.userId;
    const msgId = this.data.currentReplyMsgId;
    // 将本地数据的对应留言添加回复
    const msgList = this.data.msgList.map(msg => {
      if (msg.id == msgId) {
        msg.reply = text;
      }
      return msg;
    })
    // 上传回复到服务器
    replyMessage(userId, text, msgId)
    // 更新本地文件
    this.setData({
      replyValue: "",
      msgList
    })
  },
  // 回复按钮点击的回调
  replyCallback(e) {
    const id = e.detail;
    this.setData({
      currentReplyMsgId: id,
      replyInputShow: true
    })
  },
  // 子组件用来修改isPreviewImage值的方法
  updateIsPreviewImage(e) {
    const bool = e.detail;
    this.setData({
      isPreviewImage: bool
    })
  },
  // 删除留言的回调
  deleteMsgCallback(e) {
    const id = e.detail;
    const msgList = this.data.msgList.filter(msg => msg.id != id);
    this.setData({
      msgList
    })
  },
  // 获取用户信息
  getUserInfo(e) {
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
  // 跳转到填写留言页面
  goWMPage(e) {
    wx.navigateTo({
      url: "/pages/writeMsg/writeMsg"
    })
  },
  // 切换留言显示
  swiperMessage() {
    this.setData({
      isAllMessagePage: !this.data.isAllMessagePage
    })
    // 调用下拉刷新
    wx.startPullDownRefresh();
  },
  // 请求留言数据
  requestMessage() {
    if (this.data.isAllMessagePage) {
      this.requestAllMessage()
    } else {
      this.requestUserMessage()
    }
  },
  // 处理按页面请求获得的数据
  handleRequestDataByPage(data) {
    const msgList = this.handleMsgList(data);
    // 如果请求回的数据小于每页的数据就说明这已经是最后一页了
    if (msgList.length < this.data.pageCapacity) {
      this.setData({
        isLastPage: true
      })
    }
    this.setData({
      msgList: [...this.data.msgList, ...msgList]
    })
    // 结束下拉刷新
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  // 按页请求留言
  requestAllMessage() {
    // 如果已经是最后一页了就不用再加载了
    if (this.data.isLastPage) return;
    const pageNumber = this.data.pageNumber;
    const pageCapacity = this.data.pageCapacity;
    if(this.data.isSuper){
      getMessageByPage(pageNumber, pageCapacity).then(res => {
        this.handleRequestDataByPage(res.data.data);
      })
      return;
    }
    getSuperUserMessages(pageNumber, pageCapacity).then(res => {
      this.handleRequestDataByPage(res.data.data);
    })
  },
  // 请求用户自己的留言
  requestUserMessage() {
    const userId = app.globalData.userInfo.userId;
    const name = app.globalData.userInfo.name;
    const photoUrl = app.globalData.userInfo.photoUrl;
    getMessagesByUser(userId).then(res => {
      const msgList = this.handleMsgList(res.data.data);
      // 自己留言后台返回的数据是没有用户信息的，这里自己加到留言数据中去
      const newMsgList = msgList.map(msg => {
        msg.user = {
          name,
          photoUrl
        }
        return msg;
      })
      this.setData({
        msgList: newMsgList,
        pageNumber: 0, // 将所有留言的页码改为0
        isLastPage: true // 因为自己留言就一页不存在懒加载一说，所以直接是最后一页
      })
      // 结束下拉刷新
      wx.stopPullDownRefresh()
    })
  },
  // 请求未读的留言
  requestNotReadMessage() {
    getNotReadMessage().then(res => {
      const msgList = this.handleMsgList(res.data.data);
      this.setData({
        msgList
      })
    })
  },
  // 把从后端请求的数据处理成前端展示需要的数据
  handleMsgList(data) {
    return data.map(msg => {
      const date = new Date(msg.createTime);
      const Y = date.getFullYear();
      const M = addZero(date.getMonth() + 1);
      const D = addZero(date.getDate());
      const H = addZero(date.getHours());
      const Min = addZero(date.getMinutes());
      const S = addZero(date.getSeconds());
      const createTime = `${Y}年${M}月${D}日 ${H}:${Min}:${S}`;
      const imgUrls = msg.imgUrls === "" ? [] : msg.imgUrls.split(";").map(url => "https://fqiang-1300549778.cos.ap-chongqing.myqcloud.com/jz/message/" + url);
      return {
        ...msg,
        createTime,
        imgUrls
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSuper: app.globalData.userInfo.isSuper
    })

  },
  onShow() {
    // 判断是否是从预览图片中跳转过来的
    if (!this.data.isPreviewImage) {
      wx.startPullDownRefresh();
    } else {
      this.setData({
        isPreviewImage: false
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 初始化页码
    this.setData({
      msgList: [],
      isLastPage: false,
      pageNumber: 0
    })
    // 请求数据
    this.requestMessage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果是自己留言界面的话触底啥也不干
    if (!this.data.isAllMessagePage) return;
    this.setData({
      pageNumber: this.data.pageNumber + 1
    })
    if (!this.data.isLastPage) {
      wx.showNavigationBarLoading();
      this.requestMessage();
    }
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