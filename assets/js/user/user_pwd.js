$(function () {

    // 自定义校验规则
    let { form } = layui
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码需要6-12位,且不能出现空格"],
        // 新旧密码不能重复
        samePwd: function (value) {
            //value是新密码 旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return "新旧密码不能相同"
            }
        },
        // 两次密码输入必须一致
        rePwd: function (value) {
            //value是新密码 旧密码需要获取
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不相同"
            }
        }
    })


    // 表单提交
    $(".layui-form").on("submit", function (e) {
        e.preventDefault()
        // 发送ajax请求
        //  console.log($(this).serialize());

        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 成功
                layui.layer.msg("修改密码成功")
                $(".layui-form")[0].reset()
                location.href = "/login.html"
            }
        })
    })
})