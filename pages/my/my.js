// pages/my/my.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    sign: 0
  },
  /**
   * 页面调用的方法
   */
  //判断用户是否为初次登录及获取用户名
  init(){
    const user = wx.getStorageSync('user');
    if (user) {
      if(user[0].password === "123456"){
        Dialog.alert({
          message: '当前密码为初始密码，请修改！',
        }).then(() => {
          // 跳转到修改密码页面
          wx.navigateTo({
            url: '../modifyPwd/modifyPwd?isNew=true',
          })
        });
      }
      this.data.userName = user[0].name;
      this.setData({
        userName: user[0].name,
        sign: user[0].sign
      })
    }
  },
  // 点击退出登录或登录时执行函数jump
  jump(){
    try {
      wx.removeStorageSync('user');
      wx.redirectTo({
        url: '../login/login',
      })
      console.log("退出登录成功");
    } catch (e) {
      // Do something when catch error
      wx.showLoading({
        title: '提示',
        content: '操作失败，是否重试',
        success (res) {
          if(res.confirm) {
            this.exit();
          } else if (res.cancel){
            console.log("用户点击了取消")
          }
        }
      })
      console.log("删除用户信息失败");
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
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

  }
})