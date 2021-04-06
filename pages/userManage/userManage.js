// pages/userManage/userManage.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db =wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headList: ['用户名','邮箱','操作'],
    userData: [],
    show: false,
    email: '',
  },
  /**
   * 
   * 页面调用的方法
   */
  returnPage(){
    wx.navigateBack({
      delta: 1
     })
  },
  getUserInfo(event) {
    const str = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/ ;
    console.log(this.data.email);
    console.log(str.test(this.data.email));
    if (str.test(this.data.email)) {
      /*格式正确*/
      console.log("格式正确");
      db.collection('userList').where({
        email: this.data.email
      })
      .get({
        success: res => {
          // res.data 是包含以上定义的两条记录的数组
          if(res.data.length === 0){
            this.addUser();
          }else{
            // wx.showToast({
            //   title: '该邮箱已被占用',
            //   icon: 'error'
            // });
            Notify({
              message: '该邮箱已被占用',
              top: 25,
              background: '#fd525a'
            });
          }
        }
      })
    }else {
      /*格式不正确，弹窗提示*/
      wx.showToast({
        title: '请输入正确邮箱',
        icon: 'error'
      });
    }
  },
  openDialog() {
    this.setData({ show:true });
  },
  onClose() {
    this.setData({ show: false });
  }, 
  getUserData(){
    db.collection('userList').where({
      sign: 0
    })
    .get({
      success: res => {
        this.setData({
          userData: res.data
        })
        console.log(res.data)
      }
    })
  },
  addUser(){
    db.collection('userList').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        email: this.data.email,
        name: "用户"+this.data.email,
        password: "123456",
        sign: 0
      }
    })
    .then(res => {
      Notify({
        message: '添加用户成功',
        top: 25,
        background: '#fff',
        color: "break"
      });
      this.getUserData();
    })
    .catch(e => {
      console.log(e);
      // wx.showToast({
      //   title: '添加失败，请重试',
      //   icon: 'error'
      // });
      Notify('添加失败，请重试！');
    })
    this.setData({ email:'' });
  },
  delUser(e){
    let id = e.currentTarget.dataset['id'];
    console.log(id);
    Dialog.confirm({
      title: '提示',
      message: '确定删除该用户？',
    })
      .then(() => {
        // 执行删除操作
        db.collection('userList').doc(id).remove({
          success: res => {
            console.log("删除成功");
            this.getUserData();
            Notify({
              message: '删除成功',
              top: 25,
              background: '#fff',
              color: "break"
            });       
          },
          fail: err =>{
            Notify({
              message: '删除失败，请重试',
              top: 25,
              background: '#fd525a'
            });
          }
        })
      })
      .catch(() => {
        // on cancel
        console.log("用户点击取消");
      });
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
    this.getUserData();
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