// pages/control/control.js
const db = wx.cloud.database();
const app = getApp();
import { request } from "../../utils/request"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: '',
    devData: [],
    state: ''
  },
  /**
   * 页面的方法
   */
  collChange(event) {
    this.setData({
      activeName: event.detail,
    });
    console.log(this.data.activeName);
    this.setData({
      state: ''
    })
    app.clearTimer();
    if(this.data.activeName){
      app.beginTimer(this.data.activeName);
    }
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
  // 监听来自app.js中数据的变化
  watchBack(data){
    let isTure;
    if(data.msg === "在线"){
      isTure = false;
    }else{
      isTure = true;
    }
    this.setData({
      state: data.msg,
      isBan: isTure
    })
    console.log(this.data.state)
    console.log('监听到数据变化的值',data);
  },
  async clickBtn(item){
    let msg = item.currentTarget.dataset.msg;
    let id = item.currentTarget.dataset.id;
    console.log(msg, id);
    const res = await request({ 
      url: "/v1/synccmds?device_id=" + id + "&timeout=5", 
      method: "post",
      data: msg 
    });
    // const res = await request({ 
    //   url: "/v1/synccmds?device_id=689726389&timeout=5", 
    //   method: "post",
    //   data: "LED=\"ON\"" 
    // });
    console.log(res);
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDevData();
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