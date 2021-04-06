// request/request.js
// 定义一个同时发送异步请求代码的次数
let ajaxTimes=0;
const token = "version=2018-10-31&res=products%2F406917&et=4076662245&method=sha1&sign=0RCitdo7sZcnpAbzw5%2FPDHPjMHQ%3D";
// 异步请求的封装
export const request = (params) => {
	// 没发送一次异步请求，就让ajaxTimes+1 确保页面有几次请求
    // ajaxTimes++;
    // // 显示加载层
    // wx.showLoading({
    //     title: "加载中...",
    //     mask: true
    // })   
    // 定义公共的url 定义前面相同的url  下面拼接起来
    const baseUrl= "https://api.heclouds.com";
    return new Promise((resolve,reject)=>{
        wx.request({
        	//es6中的扩展运算符
            ...params,
            // 这里将公共的url和传过来的url后半段拼接起来
            url:baseUrl+params.url,
            header: {
              Authorization: token
            },
            success:(result)=>{
                console.log("成功");
                console.log(result);
                resolve(result);//返回成功数据
            },
            fail:(err)=>{
                console.log("错误")
                reject(err);//返回失败数据
                
            }
            // 成功失败都会执行complete
            // complete:()=>{
            // 	// 这里的ajaxTimes--是确保一个页面里的请求都结束了才关闭加载层
            // 	// 如果没有ajaxTimes--和if的判断，会加载一条请求后就关闭加载层
            //     ajaxTimes--;
            //     if(ajaxTimes===0){
            //         // 关闭加载层
            //         wx.hideLoading();
            //     }
            // }
        })
    }).catch(err=>{
        console.log(err);
    })
}