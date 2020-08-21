$(function () {
    // 自定义校验规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1-6之间"
            }
        }
    })


    // 2. 用户渲染
    initUserInfo();
    // 导出layer
    var layer = layui.layer;
    // 封装函数
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功就渲染
                //      console.log(res.data);

                form.val("formUserInfo", res.data)
            }
        })
    }

    // 3. 表单重置
    $("#btnReset").on("click", function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 重新渲染用户
        initUserInfo();
    })

    // 4. 更改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "post",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.data)
                }
                // 成功
                layer.msg("恭喜您,信息修改成功")
                // 调用父框架的全局方法 渲染页面
                window.parent.getUserInfo()
            }
        })
    })
})