//app.js
import { request } from "./utils/request"
let timerId = 0;
let isShowLoading = false;
App({
  onLaunch: function () {
    //云开发环境初始化
    wx.cloud.init({
      env:"zjt-210125-8gebcpyx9a34d163"
    }); 
  },
  globalData: {
    realtimeData : [],

  }, 
 findKey(data, field) {
    let finding = '';
    for (const key in data) {
      if (key === field) {
        finding = data[key];
      }
      if (typeof (data[key]) === 'object') {
        finding = this.findKey(data[key], field);
      }
      if (finding !== '') {
        return finding;
      }
    }
  },
  beginTimer(data){
    // wx.showLoading({
    //   title: "加载中...",
    //   mask: true
    // })
    if(!isShowLoading){
      wx.showLoading({
      title: '加载中',
      })
      isShowLoading =true;
    }
    console.log(data);
    let devId = data;
    let that = this;
  //  return new Promise ((resolve)=>{
    //实时更新数据
    timerId =  setInterval(async function(){
      console.log("轮播请求1秒触发一次");
      let dataList = [];
      let newData = [];
      let msg; //存储在线情况
      let data = {}; //存储温湿度信息
      let date = "";  //数据更新日期
      const res = await request({ url: "/v1/synccmds?device_id=" + devId + "&timeout=5", method:"post",data:"hello" });
      console.log(res);
      if(res.data.errno === 15){
        msg = "在线";
        let res = await request({ url: "/devices/"+ devId +"/datapoints" });
        if(res.data.data){
          newData = res.data.data.datastreams;
          for(let i = 0; i < newData.length; i++){
            let id = newData[i].id;
            let value = that.findKey(newData[i],"value");
            date = that.findKey(newData[i],"at");
            data[id] = value;
          }
        }
      }
      else{
        msg = "离线";
        // let res = await request({ url: "/devices/"+ devId +"/datapoints" });
        // newData = res.data.data.datastreams;
        // console.log(newData);
      }
      dataList = {
        devId,
        msg,
        ...data,
        date
      }
        // return dataList;
        // resolve(timerId);
        // resolve();
      // }
      that.globalData.realtimeData = dataList;
      // wx.hideLoading();
      if(isShowLoading){
        wx.hideLoading()
        isShowLoading =false; 
      }
      console.log(that.globalData.realtimeData);
    }, 2000)
  //  })
  },
  clearTimer(){
    console.log("清除定时器:"+timerId);
    clearInterval(timerId);
  },
  // 自定义监听器
  // method：回调方法 isstr监听的值
  watch(method,isstr){
    var obj = this.globalData; //监听的对象
    Object.defineProperty(obj,isstr, {
      configurable: true,//描述属性是否配置，以及可否删除 false 时，不能删除当前属性，且不能重新配置当前属性的描述符(有一个小小的意外：true时，可以删除当前属性，可以配置当前属性所有描述符。
      enumerable: true,//描述属性是否会出现在for in 或者 Object.keys()的遍历中
      set: function (value) {
        this._consumerGoodsStatus = value; //_consumerGoodsStatus是Object.defineProperty自定义的属性
        method(value);
      },
      get:function(){
      // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.chatList的时候，这里就会执行。
        return this._consumerGoodsStatus
      }
    })
  }
})