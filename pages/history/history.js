// pages/history/history.js
const db = wx.cloud.database();
import { request } from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showTime: '',
    devId: '',
    devName: '',
    dataName: '',
    startTime: '',
    endTime: '',
    sign:'',   //区别开始时间和结束时间
    minDate: new Date(2020, 12, 1).getTime(),
    maxDate: new Date().getTime(),
    currentDate: new Date().getTime(),
    columns: [
      {
        values:[],
        id: [],
        defaultIndex: 0
      },
      {
        values:[ 'hum', 'tem', 'light' ],
        defaultIndex: 0
      }
    ]
    ,
  },
  // 多列弹框调用的方法
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onConfirm(event) {
    const { value, index } = event.detail;
    this.setData({ 
      show: false,
      devName: value[0],
      dataName: value[1],
      devId: this.data.columns[0].id[index[0]]
    });
    console.log(this.data.devId);
  },
  // 时间弹框调用的函数
  showTime(event){
    console.log(event);
    let sign = event.currentTarget.dataset.sign;
    this.setData({ 
      showTime: true,
      sign
     });
    if(sign === "start"){
      let currentDate=this.data.currentDate-60000;
      this.setData({
        currentDate
      })
    }
  },
  closeTime() {
    this.setData({ showTime: false });
  },
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },
  timeConfirm(event){
    console.log(event.detail);
    const res=this.formData(event.detail);
    this.setData({ 
      showTime: false,
    });
    if(this.data.sign === 'start'){
      this.setData({
        startTime:res
      })
    }else{
      this.setData({
        endTime:res
      })
    }
  },
  formData(date) {
      console.log(date);
      let s = new Date(date);
      let y = s.getFullYear();
      let m = (s.getMonth() + 1) < 10 ? '0' + (s.getMonth() + 1) : (s.getMonth() + 1);
      let dd = s.getDate() < 10 ? '0' + s.getDate() : s.getDate();
      let hh = s.getHours() < 10 ? '0' + s.getHours() : s.getHours();
      let mm = s.getMinutes() < 10 ? '0' + s.getMinutes() : s.getMinutes();
      let ss = s.getSeconds() < 10 ? '0' + s.getSeconds() : s.getSeconds();
      let enddate = y + '-' + m + '-' + dd + 'T' + hh + ':' + mm + ":" + ss;
      return enddate
  },
  getHistoryData(){
    let { devId,dataName,startTime,endTime } = this.data;
    console.log(devId, dataName, startTime, endTime);
    request({url:`/devices/${devId}/datapoints?datastream_id=${dataName}&start=${startTime}&end=${endTime}`})
    .then( res => {
      console.log(res);
    })
  },
  getDevData(){
    db.collection('deviceList').get().then(res => {
      let data = res.data || [];
      let arrName = [];
      let arrId = [];
      data.forEach(item => {
        arrName.push(item.deviceName);
        arrId.push(item.deviceId);
      });
      this.setData({
        'columns[0].values': arrName,
        'columns[0].id': arrId,
      })
      let devName = this.data.columns[0].values[this.data.columns[0].defaultIndex];
      let dataName = this.data.columns[1].values[this.data.columns[1].defaultIndex];
      let devId = this.data.columns[0].id[this.data.columns[0].defaultIndex]
      this.setData({
        devName,
        dataName,
        devId
      })
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
    this.getDevData();
    let startTime = this.formData( new Date().getTime()-60000 );
    let endTime = this.formData( new Date().getTime() );
    console.log(startTime,endTime)
    this.setData({
      startTime,
      endTime
    })
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