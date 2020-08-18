// 1. 开发服务器地址
var baseUrl = "http://ajax.frontend.itheima.net"
// 2. 测试服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net"
// 3. 生产服务器地址
// var baseUrl = "http://ajax.frontend.itheima.net"

// 拦截所有请求 拼接路径
// 处理参数
$.ajaxPrefilter(function (params) {
    // 拼接对应的服务器地址
    params.url = baseUrl + params.url
    // console.log(params.url);

})