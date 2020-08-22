$(function () {
    let { form, layer } = layui
    initCate(); // 调用函数
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg("res.massage")
                }
                // 成功之后 调用模板引擎
                var html = template("tpe-pub", {
                    datas: res.data
                })
                $("[name=cate_id]").html(html)
                // 重新渲染 否则会没有选项
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')
    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 点击按钮选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })


    // 监听coverFile的change事件
    $("#coverFile").on("change", function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        //  console.log(file);
        //根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        //  先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态 让它默认是已发布,只要点击了存为草稿按钮就更改状态为草稿
    var state = "已发布"

    $("#btnSave2").on("click", function () {
        state = "草稿"
    })


    // 添加文章模块
    $("#form-pub").on("submit", function (e) {
        e.preventDefault()
        // 创建formData对象搜集数据
        var fd = new FormData(this)
        // 放入状态  formData自带的append方法 用于添加字段
        fd.append("state", state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob)
                //  注意发送ajax请求的时候写在toBlob里面
                //  console.log(...fd);
                publishArticle(fd)
            })
    })
    // 封装发送ajax请求 添加文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意必须添加FormData格式的数据
            contentType: false,
            processData: false,
            success: res => {
                //  console.log(res);

                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("恭喜您,发表成功")
                // 跳转
                //   location.href = "/article/art_list.html"
                // 或者直接点击一下文章列表
                setTimeout(() => window.parent.document.getElementById("art_list").click(), 1500)

            }
        })
    }

})