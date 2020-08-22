$(function () {

    var { layer } = layui
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 1.4 上传按钮绑定点击事件
    $("#btnChooseImage").on("click", function () {
        $("#file").click()
    })

    // 给文件添加change事件
    $("#file").on("change", function () {
        // 获取文件
        let file = this.files[0];
        // 非空校验
        if (!file) {
            return layer.msg("请选择图片")
        }
        // 根据文件创建一个url地址
        let newImgUrl = URL.createObjectURL(file);
        // 销毁之前的剪裁区域 重新设置图片路径 之后再创建一个新的剪裁区域
        $image.cropper("destroy")  // 销毁
            .attr("src", newImgUrl) // 设置新路径
            .cropper(options)       // 创建新的剪裁区域
    })

    // 给确定按钮绑定点击事件
    $("#btnUpload").on("click", function () {
        // 获取base64类型的头像
        // base64 一般用于小图 图片大小会增加30% 是字符串类型的图片
        var dataUrl = $image.cropper("getCroppedCanvas", {
            width: 100,
            hegiht: 100
        }).toDataURL("image/png")

        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataUrl
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您,更换头像成功")
                //  console.log(1);
                window.parent.getUserInfo()
            }
        })
    })

})