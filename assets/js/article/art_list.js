$(function () {

    // 时间过滤器 美化时间的格式
    template.defaults.imports.dateFormat = function (date) {
        // 这里传过来的date是字符串
        // console.log(date);
        // 将字符串转化为时间对象
        var date = new Date(date);
        //  console.log(date);
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? '0' + day : day;
        var h = date.getHours()
        h = h < 10 ? '0' + h : h;
        var m = date.getMinutes();
        m = m < 10 ? '0' + m : m;
        var s = date.getSeconds()
        s = s < 10 ? '0' + s : s;
        return date.getFullYear() + '年' + month + '月' + day + '日' + ' ' + h + ':' + m + ":" + s;
    };

    // 定义查询参数对象,
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,  // 每页显示多少条数据
        cate_id: "",  // 文章分页的id
        state: ""    // 文章状态 可选值有:已发布 草稿

    }
    // 初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                var html = template("tpl", {
                    data: res.data
                })
                $("#tbody").html(html)

                // 初始化分页
                // 因为每次搜索 或者重新加载页面的时候都需要重新渲染页面
                // 我们可以直接将分页放在渲染页面后面
                renderPage(res.total)
            }
        })
    }

    // 初始化分类列表
    var { form } = layui;
    initCate()
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var html = template("tpl-cate", {
                    data: res.data
                })
                $("[name=cate-id]").html(html)
                form.render()
            }
        })
    }

    // 搜索模块
    $("#form-search").on("submit", function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $("[name=cate-id]").val()
        var state = $("[name=state]").val()
        // 赋值
        q.state = state;
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 分页渲染部分
    let { laypage } = layui
    function renderPage(total) {
        // alert(num)
        //执行一个laypage实例
        laypage.render({
            elem: 'test1',  //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum,  //第几页
            // 分页模块设置,显示那些子模块
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //  console.log(first);

                //obj包含了当前分页的所有参数，比如：
                //  console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //  console.log(obj.limit); //得到每页显示的条数
                // 赋值
                q.pagenum = obj.curr
                // 将最新的条目数 赋值给q.pagesize
                q.pagesize = obj.limit
                //首次不执行 (通过重新渲染页面的话就不执行)
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });

    }


    // 通过代理的形式给删除按钮绑定点击事件
    let { layer } = layui
    $("body").on("click", ".btn-delete", function () {
        // 获取id
        let id = $(".btn-delete").attr('data-id')
        // console.log(id);
        layer.confirm('确定要删除吗', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "get",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    layer.msg("恭喜您,删除成功")
                    // 页面汇总按钮数等于1 页码大于1
                    // console.log($(".btn-delete").length);

                    if ($(".btn-delete").length === 1 && q.pagenum > 1)
                        q.pagenum--;
                    // 当某一页的数据删除完毕之后
                    // q.pagenum还处于当前页,渲染会导致没有数据
                    //  console.log(q.pagenum);

                    initTable()
                }
            })
            layer.close(index);
        });
    })
})