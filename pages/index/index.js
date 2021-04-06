// pages/userManage/userManage.js
import { request } from "../../utils/request";
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const db = wx.cloud.database();
const app = getApp(); 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: '',
    timeData:{},
    devName: '',
    devId: '',
    show: false,
    devData:[]
  },
  /**
   * 
   * 页面调用的方法
   */
  addDevice() {
      request({url:"/mqtt/v1/devices/"+this.data.devName})
      .then(res=>{
        console.log(res.data.data);
        if(res.data.data && res.data.data.device_id === this.data.devId){
          db.collection('deviceList').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              deviceName: this.data.devName,
              deviceId: this.data.devId,
            }
          })
          .then(res => {
            this.getDevData();
            console.log(res);
            Notify({
              message: '设备添加成功',
              type: 'success'
            });
          })
        }else{
          Notify({
            message: '设备名或设备号错误，请重试',
            background: '#fc9176',
          });
        }
      })
  },
  collChange(event) {
    this.setData({
      activeName: event.detail,
    });
    console.log(this.data.activeName);
    this.setData({
      timeData: {}
    })
    app.clearTimer();
    if(this.data.activeName){
      app.beginTimer(this.data.activeName);
    }
  },
  onChange() {
    this.setData({ show: !this.data.show });
  },
  //获取数据库中设备信息（设备名和设备号）
  getDevData(){
    db.collection('deviceList').get().then(res => {
      this.setData({
        devData: res.data
      })
      console.log(this.data.devData);
    })
  },
  watchBack(data){
    this.setData({
      timeData: data
    })
    console.log('监听到数据变化的值',data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    getApp().watch(that.watchBack,"realtimeData");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDevData();
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
    app.clearTimer();
    this.setData({
      activeName: ''
    })
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