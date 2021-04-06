// pages/login/login.js
const db =wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email:'',
    pwd:''
  },
  /**
   * 页面调用的方法
   */
  login(){
    db.collection('userList').where({
      email: this.data.email,
      password: this.data.pwd
    })
    .get({
      success: res => {
        console.log(res.data)
        if(res.data.length != 0){
          try {
            wx.setStorageSync('user', res.data)
          } catch (e) {
            console.log('存储数据失败')
           }
          console.log("登录成功");
          wx.switchTab({
            url: '../my/my',
          })
        } else{
          wx.showToast({
            title: '登录失败',
            icon: 'error',
            duration: 2000
          })
        }
      }
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

  }
})