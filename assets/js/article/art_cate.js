$(function () {
    // 渲染文章页面
    initArtCateList()

    let { layer, form } = layui
    // 渲染页面
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var html = template("tpl", {
                    datas: res.data
                })
                //   console.log(html);
                $("#tbody").html(html)
            }
        })
    }

    // 给添加列表按钮 添加弹出层
    var indexAdd = null  // 获取弹出层的索引 使用open方法的时候 会自动生成index
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: "1",
            area: ["500px", "251px"],
            title: '添加文章分类'
            , content: $("#dialog-add").html()
        });
    })

    // 因为添加表单是我们动态创建的,所以需要通过代理的形式来绑定事件
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault()
        //  alert($(this).serialize())
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加成功,渲染页面
                initArtCateList()
                layer.msg("恭喜您,添加成功")
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 修改部分
    var indexEdit = null
    $("body").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: "1",
            area: ["500px", "251px"],
            title: '修改文章'
            , content: $("#dialog-edit").html()
        });
        // 获取到文章的id值
        var id = $(this).attr("data-id")
        //  console.log(id);
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })

    })
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault()

        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                layer.msg("恭喜您修改成功")
                layer.close(indexEdit)
            }

        })
    })

    // 删除部分
    $("body").on("click", ".btn-delete", function () {
        // 显示对话框 提示用户是否要删除

        // 获取到文章的id值
        var id = $(this).attr("data-id")
        //  console.log(id);

        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: "get",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    //成功后
                    initArtCateList()
                    layer.msg("恭喜您删除成功")
                    layer.close(index);
                }
            })

        });


    })

})