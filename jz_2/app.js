import {onLogin, updateNameAndPhoto} from "./api/index";

//app.js
let app;
App({
  onLaunch: function () {
    app = this;
    this.login();
  },
  // 检测版本更新，如果已经更新了让用户重启一下
  update(){
    // 判断当前微信版本是否支持getUpdateManager这个API
    if(!wx.canIUse('getUpdateManager')) return;
    const updateManager = wx.getUpdateManager();
    // 有新的版本
    updateManager.onUpdateReady( _ => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      })
    })
    // 下载新的版本失败
    updateManager.onUpdateFailed(function () {
      wx.showModal({
        title: '出错',
        content: '新版本下载失败，请关闭小程序并且清理掉小程序后台，然后重新进入！'
      })
    })
  },
  // 登录
  login() {
    wx.login({
      success(res) {
        onLogin(res.code).then(data => {
          const user = data.data.data;
          app.globalData.userInfo.userId = user.userId;
          app.globalData.userInfo.isSuper = user.isSuper;
          app.getUserInfo();
          // 页面需要userId的时候可能这里异步请求并没有完成，所以到时候可以定义一个回调函数在这里调用
          app.globalData.loginCallback && app.globalData.loginCallback(data.data.data);
        }).catch(_ => {
          // 如果无法登陆，也就是服务器关闭了，直接显示服务器维护页面
          wx.reLaunch({
            url: "/pages/serverMaintenance/serverMaintenance"
          })
        })
      }
    })
  },
  // 获取用户信息
  getUserInfo() {
    wx.getSetting({
      success(res){
        // 先看看用户授权没有，授权了就把信息保存到全局，没授权这里就不管，等后边有页面用到用户信息的时候再让用户授权
        if(res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success (e) {
              const {nickName, avatarUrl} = e.userInfo;
              app.globalData.userInfo.name = nickName;
              app.globalData.userInfo.photoUrl = avatarUrl;
              // 上传用户信息
              const userId = app.globalData.userInfo.userId;
              updateNameAndPhoto(userId, nickName, avatarUrl);
            }
          })
        }
      }
    })
  },
  globalData: {
    tencentMapKey: "SV4BZ-NMPCK-7PFJJ-AXYI5-7DOIE-4NFWX", // 腾讯地图的key值
    userInfo: {
      userId: null, // 用户唯一id
      name: null, // 微信名称
      gender: 0, // 性别：0未知、1男、2女
      photoUrl: null, // 头像url地址
      address: "全国", // 用户定位地址精确到市，默认为全国
      isSuper: false, // 该用户是否为超级用户，如果是的话就有回复和删除留言的能力
    },
    currentSubject: 0, // 当前科目，1：科目一；4：科目四；其他数字：未知
    loginCallback: null, // 登录的回调函数
    practiceType: null, // 练习类型，order: 顺章练习；test：模拟考试；wrong：错题；random：随机；collect：收藏
    typeValue: "", // 在专项练习和章节练习中具体的分类名称（比如：正确题、错误题等）
    markType: "", // 标志的各种类型，比如交通标志、仪表指示灯、交警手势等
    signsType: "", // 交通标志的各种类型 ，比如：禁令标志、指示标志灯
    markInfoListIndex: 0, // 标志详情列表页初始化时应该显示第几个
    testResult: {// 本次考试成绩
      score: 0,
      timeConsuming: ''
    }, 
    testWrongTopics: [], // 本次考试做错了的题目
  },
  onShow(){
    // 每次加载检测是否发布新版本了
    this.update();
  },
})