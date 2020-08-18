$(function () {
    // 点击去登录显示登录 隐藏注册
    $("#link_login").on('click', function () {
        $(".reg-box").hide()
        $(".login-box").show()
    })
    // 点击去注册显示注册 隐藏登录
    $("#link_reg").on('click', function () {
        $(".reg-box").show()
        $(".login-box").hide()
    })


    // 3.自定义校验规则 从layui中获取form对象
    var form = layui.form

    form.verify({
        // 密码规则 第一个参数是正则
        // 第二个参数是错误信息
        pwd: [/^[\S]{6,16}$/, "密码必须6-16位,且不能为空格"],
        // 校验2次密码是否一致
        repwd: function (value) {
            // [] 是属性选择器
            var pwd = $(".reg-box [name=password]").val()
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    })

    // 4.注册功能
    // 导入layui的layer模块
    let { layer } = layui
    $("#form_reg").on("submit", function (e) {
        // 阻止表单提交
        e.preventDefault()
        console.log($(".reg-box [name=username]"));

        // 发送ajax请求
        $.ajax({
            method: "post",
            url: "/api/reguser",
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val(),
            },
            success: function (res) {
                // 返回状态判断
                if (res.status != 0) {
                    return layer.res.message
                }
                // 成功后处理的代码
                layer.msg("注册成功,请登录");
                // 切换到登录表单
                $("#link_login").click()
                // 重置from表单,这里因为reset方法是DOM的方法
                // 需要转换对象
                $("#form_reg")[0].reset()
            }
        })
    })

    // 5. 登陆功能,给form标签绑定事件,button按钮触发提交 事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 校验返回的状态码
                if (res.status != 0) {
                    return layer.msg("恭喜您,登录成功")
                }
                // 保存token 未来接口需要使用
                localStorage.setItem("token", res.token)
                // 跳转到主页
                location.href = "/index.html"
            }
        })
    })
})