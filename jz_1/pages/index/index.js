//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onTap( e ) {
    let num = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/page/page?num=${num}`
    })
  },
  feedbackTop(){
    wx.showModal({
      tite: '反馈',
      showCancel: false,
      content: '有任何问题或建议请发送到邮箱\r\n206234924@qq.com'
    })
  },
  onLoad: function () {
    
  },
  onShareAppMessage: function () {
    return {
        path: '/pages/index/index',
        imageUrl: '/img/share.jpg'
    }
}
})
