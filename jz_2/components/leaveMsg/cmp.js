import { deleteMessage, markRead } from "../../api/index.js"
const app = getApp();
// components/leaveMsg/cmp.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSuper: Boolean, // 是否为超级用户
    msgInfo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgWrapClass: "", // 图片包裹盒子的类名，一张为空串、两张和4张为sum2、3张或更多为more
    isRead: false, // 是否为已读，这个属性的主要作用就是免得标记为已读了还要去外边改留言数组
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 全屏预览图片
    previewImage(e) {
      const _this = this;
      wx.previewImage({
        urls: this.properties.msgInfo.imgUrls,
        current: e.currentTarget.dataset.src,
        success(){
          // 将message页面中isPreviewImage的值改为true
          _this.triggerEvent("updateispreviewimage", true)
        }
      })
    },
    // 删除该评论
    deleteMsg(e) {
      const _this = this;
      wx.showModal({
        title: "确定要删除这条留言？",
        success(res) {
          if (res.confirm) {
            const userId = app.globalData.userInfo.userId;
            deleteMessage(userId, _this.properties.msgInfo.id).then(res => {
              const data = res.data.data;
              if (typeof data === "string") {
                wx.showModal({
                  title: data,
                  showCancel: false
                })
              } else {
                wx.showToast({
                  title: "删除成功",
                  duration: 1000
                })
                _this.triggerEvent("deletemsgcallback", _this.properties.msgInfo.id)
              }
            })
          }
        }
      })
    },
    // 标记为已读
    markRead(){
      markRead(this.properties.msgInfo.id).then(_ => {
        this.setData({
          isRead: true
        })
        wx.showToast({
          title: "已标记为已读",
          duration: 500
        })
      })
    },
    // 回复按钮被点击后触发
    clickReply(){
      // 触发父组件给的回调
      this.triggerEvent("replycallback", this.properties.msgInfo.id)
    },
  },
  // 生命周期
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      const imgLen = this.properties.msgInfo.imgUrls.length;
      let imgWrapClass = "sum0";
      if(imgLen === 1){
        imgWrapClass = "sum1"
      }else if (imgLen === 2 || imgLen === 4) {
        imgWrapClass = "sum2";
      } else if (imgLen === 3 || imgLen > 4) {
        imgWrapClass = "more";
      }
      this.setData({
        imgWrapClass
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
