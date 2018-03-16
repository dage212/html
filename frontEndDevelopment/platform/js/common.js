
/*下拉菜单*/
var t;
$(".monitor_menu,.infor_menu").hover(function(){
    var that = this;
    t = setTimeout(function(){
        $(that).find(".menu_down").slideDown()
    },400)
},function(){
    clearTimeout(t);
    $(this).find(".menu_down").slideUp("slow")
})
//退出
$(".login_out li:eq(1)").click(function(){
    //判断是否是首页
    if(location.pathname.indexOf("home.html") > 0){
        location.href="../index.html"
    }else{
        location.href="../../../index.html"
    }
})
//加载中方法
var loadFun = function (parentElement,loadCssObj) {
    this.$img = $("<div class='gif_load_box' >拼命加载中...</div>").appendTo(parentElement);
    var css = $.extend({},{
        "width":"200px","height":"60px",
        "bottom":"0px","left":"20px",
        "background":"rgba(0,0,0,0.5)",
        "color":"white","textAlign":"center",
        "line-height":"60px","border-radius":"4px",
        "display":"none",
        "position":"absolute"
    },loadCssObj)
    this.$img.css(css).parent().css({"position":"relative"})
}
loadFun.prototype.show = function(){
    var that = this
    this.$img.show()
    setTimeout(function () {
        that.$img.hide()
    },3000)
}
loadFun.prototype.hide = function(){
    this.$img.hide()
}

/*下拉菜单*/
/*bootstrap-table*/
if($.fn.bootstrapTable){
    $.fn.bootstrapTable.locales['zh-CN'] = {
        formatLoadingMessage: function () {
            return '正在努力地加载数据中，请稍候……';
        },
        formatRecordsPerPage: function (pageNumber) {
            return '每页显示 ' + pageNumber + ' 条记录';
        },
        formatShowingRows: function (pageFrom, pageTo, totalRows) {
            return '共 ' + totalRows + ' 条记录，';
        }
    }
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['zh-CN']);
}
/*bootstrap-table*/
