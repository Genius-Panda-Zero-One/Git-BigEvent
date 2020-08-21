// 1. 开发服务器地址
var baseUrl = "http://ajax.frontend.itheima.net"
// 2. 测试服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net"
// 3. 生产服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net"

// 拦截所有请求 拼接路径
// 处理参数
$.ajaxPrefilter(function (params) {
    // 设置必须以/my/开头
    // if (params.url.indexOf('/my/') === 0) {
    //     params.headers = {
    //         Authorization: localStorage.getItem('token') || ""
    //     }
    // }

    // 1.拼接对应的服务器地址
    params.url = baseUrl + params.url
    // console.log(params.url);

    // 2.设置头信息
    if (params.url.includes("/my/")) {
        params.headers = {
            //token有过期时间,需要重新登录
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 3. 拦截所有的响应 判断身份认证信息
    params.complete = function (res) {
        //  console.log(res.responseJSON);
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            console.log(true);

            // 清空本地token
            localStorage.removeItem("token");
            // 跳转到login界面
            location.href = "/login.html"
        }

    }

})