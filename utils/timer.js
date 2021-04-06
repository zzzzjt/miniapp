import {request} from "../utils/request"
let timer;
let msg;
let id;
let data = [];

function getData(data){
  console.log(data);
  const arr = data;
  for(let i = 0; i<arr.length; i++){
    request({url:"/v1/synccmds?device_id="+arr[i]+"&timeout=30",method:"post",data:"hello"})
      .then(res=>{
        console.log(res);
      })
  }

//  return new Promise ((resolve)=>{
  timer =  setInterval( async function () {
    console.log("轮播请求1秒触发一次");
    console.log(timer);
  
    let dataList = [];
    for(let i = 0; i<arr.length; i++){
      id = arr[i];
      const res = await request({url:"/v1/synccmds?device_id="+id+"&timeout=30",method:"post",data:"hello"});
      console.log("执行中。。。");
      if(res.data.errno === 0){
        msg = "在线";
      }
      else{
        msg = "离线";
      }
      dataList.push({
        id,
        msg
      })
      console.log(dataList);
      return dataList;
      //resolve(dataList);
    }
 
  }, 1000)
//  })

}

function begin(){
  console.log(arguments);
  clearInterval(timer);
  if(arguments[0].length !== 0){

    const res = getData(...arguments);
    console.log(res);
    // getData(...arguments).then(
    //   (value) => {
    //     console.log(value);
    //   }
    // )
  }
}
const clear = ()=>{
  console.log(timer);
  console.log("清除定时器");
  clearInterval(timer);
}
module.exports = {
  begin,
  clear
}