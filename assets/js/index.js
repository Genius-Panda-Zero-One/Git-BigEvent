$(function () {
    // 获取用户信息
    getUserInfo()
    // 退出按钮绑定的点击事件
    $("#btnLogout").on('click', function () {
        //  console.log("yes");

        var layer = layui.layer
        layer.confirm('您确定要离开吗?', { icon: 3, title: '提示' }, function (index) {
            //1. 清空本地token
            localStorage.removeItem("token");
            // 2. 实现页面跳转
            location.href = "/login.html"
            layer.close(index);
        });
    })



})

// 获取用户信息(封装到入口函数外面)
// 后面有其他的页面需要用 
function getUserInfo() {
    $.ajax({
        method: "get",
        url: "/my/userinfo",
        // headers: {
        //     //token有过期时间,需要重新登录
        //     Authorization: localStorage.getItem('token') || ""
        // },
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg(res.message)
            }
            // 请求成功 渲染用户头像信息
            renderAvatar(res.data)
        }
    })

}

// 渲染用户头像函数
function renderAvatar(user) {
    // 1. 渲染用户名 优先使用nickname 没有就用username
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎  " + name)
    // 2. 用户头像
    if (user.user_pic != null) {
        // 由用户头像的时候
        $(".layui-nav-img").show().prop('src', user.user_pic);
        // 文字头像不显示
        $(".user-avater").hide()
    } else {
        // 没有头像 将名字的首字母大写
        $(".user-avater").show().html(name[0].toUpperCase())
        $(".layui-nav-img").hide()
    }
}
