/*本页面js*/
//tab切换
$(".tab_box").click(function(){
    var index = $(this).index(".tab_box")
    $(this).find("img").css({"display":"inline-block"}).end().siblings().find("img").css({"display":"none"})
    $(".tab-filter").eq(index).css({"display":"block"}).siblings().css({"display":"none"})
})

var getRange = function(start,end){
    if(start == ""||start == undefined){
        start = "*"
    }
    if(end == ""||end == undefined){
        end = "*"
    }
    return start+":"+end
}

//全名单
$('#filter-table').bootstrapTable({
    url: "/cccredit/web_enterpriseInfoController/web_datagrid.form",
    queryParams:function(params){
        return {
            page:$("#tab-all .pagination .active>a").text()||1,
            rows:$("#tab-all .page-size").text()||10,
            regLocation:$("#tab-all .filter_cur_two").attr("data-query"),
            enterpriseClassification:$("#tab-all .filter_cur_one").attr("data-query"),
            days:$("#tab-all .filter_cur_three").attr("data-query")
        }
    },
    //bootstrap json格式 {rows:[],total:xx}
    responseHandler:function(res){//组装后台返回数据
        return res;
    },
    sidePagination: 'server',
    pagination: true,
    pageNumber: 1,
    pageSize: 10,
    pageList: [5, 10, 20],
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    paginationVAlign: 'bottom',
    paginationHAlign: 'right',
    paginationPreText: "<<",
    paginationNextText: ">>",
    columns: [{
        title: '序号',
        width: 30,
        class: "text-center",
        formatter: function (value, row, index) {
            return index+1;
        }
    }, {
        field: 'name',
        title: '企业名称',
        width: 450,
        formatter:function(value,row,index){
            return '<a href="./info_search_basic.html?name='+value+'">'+value+'</a>'
        }
    }, {
        field: 'regLocationStr',
        title: '所在地区',
        width: 150,
        class: "text-center"
    }, {
        field: 'enterpriseClassificationStr',
        title: '行业分类',
        width: 220,
        class: "text-center"
    }, {
        field: 'estiblishTimeStr',
        title: '成立日期',
        width: 180,
        class: "text-center"
    }
    ]
});

//黑名单
$('#filter-table-sx').bootstrapTable({
    url: "/cccredit/web_enterpriseBlacklistController/web_datagrid.form",
    queryParams:function(params){
        return {
            page:$("#tab-hmd .pagination .active>a").text()||1,
            rows:$("#tab-hmd .page-size").text()||10
        }
    },
    responseHandler:function(res){//组装后台返回数据
        return res;
    },
    sidePagination: 'server',
    pagination: true,
    pageNumber: 1,
    pageSize: 10,
    pageList: [5, 10, 20],
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    paginationVAlign: 'bottom',
    paginationHAlign: 'right',
    paginationPreText: "<<",
    paginationNextText: ">>",
    columns: [{
        title: '序号',
        width: 30,
        class: "text-center",
        formatter: function indexFormatter(value, row, index) {//在表格前加上序号
            return index + 1;
        }
    }, {
        field: 'enterpriseName',
        title: '企业名称',
        width: 450,
        formatter:function(value,row,index){
            return '<a href="./info_search_basic.html?name='+value+'">'+value+'</a>'
        }
    }, {
        field: 'regLocationStr',
        title: '所在地区',
        width: 150,
        class: "text-center",
    }, {
        field: 'enterpriseClassificationStr',
        title: '行业分类',
        width: 220,
        class: "text-center"
    }, {
        field: 'breakPromise',
        title: '失信原因',
        width: 180,
        class: "text-center"
    },
    ]
});

//企业优秀名单
$('#filter-table-yx').bootstrapTable({
    url: "/cccredit/web_enterpriseExcellentController/web_datagrid.form",
    queryParams:function(params){
        return {
            page:$("#tab-yx .pagination .active>a").text()||1,
            rows:$("#tab-yx .page-size").text()||10
        }
    },
    responseHandler:function(res){//组装后台返回数据
        return res;
    },
    sidePagination: 'server',
    pagination: true,
    pageNumber: 1,
    pageSize: 10,
    pageList: [5, 10, 20],
    dataType: "json",
    contentType: "application/x-www-form-urlencoded",
    paginationVAlign: 'bottom',
    paginationHAlign: 'right',
    paginationPreText: "<<",
    paginationNextText: ">>",
    columns: [{
        title: '序号',
        width: 30,
        class: "text-center",
        formatter: function (value, row, index) {
          return index+1;
        }
    }, {
        field: 'enterpriseName',
        title: '企业名称',
        width: 450,
        formatter:function(value,row,index){
            return '<a href="./info_search_basic.html?name='+value+'">'+value+'</a>'
        }
    }, {
        field: 'regLocationStr',
        title: '所在地区',
        width: 150,
        class: "text-center"
    }, {
        field: 'enterpriseClassificationStr',
        title: '行业分类',
        width: 220,
        class: "text-center"
    }, {
        field: 'estiblishTimeStr',
        title: '成立日期',
        width: 180,
        class: "text-center"
    }]
});
var filter = function(pele,ele,table){
    /*
        @pele=#xxx
        @ele=.xxx
        @table = #xxx
    */

    var filterQuery = {regLocation:"",enterpriseClassification:"",days:""}
    //删除过滤条件
    $(pele+" .filter_"+ele+" .filter_one_all").click(function(){
        $(this).css({color:"#fff","background":"#11A0EC"}).next().find(".list").removeClass("active")
        $(pele+" .filter_four .filter_content").children().remove(".filter_cur_"+ele)
        filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query")}
        var filter_input_range = {
            "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
            "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
            "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
            "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
            "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
        }
        var query = $.extend(filterQuery,filter_input_range)
        $(table).bootstrapTable("refresh",{query:query})
    })
    $(pele+" .filter_content").on("click",".filter_cur_"+ele,function(){
        $(this).remove()
        $(pele+" .filter_"+ele+" .filter_one_all").css({color:"#fff","background":"#11A0EC"}).next().find(".list").removeClass("active")
        $(pele+" .filter_four .filter_content").children().remove(".filter_cur_"+ele)
        filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query")}
        var filter_input_range = {
            "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
            "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
            "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
            "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
            "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
        }
        var query = $.extend(filterQuery,filter_input_range)
        $(table).bootstrapTable("refresh",{query:query})
    })
    //添加过滤条件

    $(pele+" .filter_"+ele+" .list").click(function(){
        $(this).addClass("active").siblings().removeClass("active").parent().prev().css({color:"#999999","background":"#fff"})

        if($(pele+" .filter_four .filter_cur_"+ele).length > 0){

            $(pele+" .filter_cur_"+ele).html($(this).text()+'<span class="glyphicon glyphicon-remove quit"></span>').attr("data-query",$(this).data("query"))
        }else{
            if(ele == "one"){
                var  html = '<span class="filter_one_all filter_cur filter_cur_one" data-query="'+$(this).data('query')+'">'+$(this).text()+'<span class="glyphicon glyphicon-remove quit"></span></span>';

            }else if(ele == "two"){
                var  html = '<span class="filter_one_all filter_cur filter_cur_two" data-query="'+$(this).data('query')+'">'+$(this).text()+'<span class="glyphicon glyphicon-remove quit"></span></span>';

            }else if(ele == "three"){
                var  html = '<span class="filter_one_all filter_cur filter_cur_three" data-query="'+$(this).data('query')+'">'+$(this).text()+'<span class="glyphicon glyphicon-remove quit"></span></span>';

            }
            $(pele+" .filter_four .filter_content").append(html)
        }
        filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query")}
        var filter_input_range = {
            "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
            "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
            "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
            "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
            "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
        }
        var query = $.extend(filterQuery,filter_input_range)
        $(table).bootstrapTable("refresh",{query:query})
    })
}
/*--------企业类型筛选----------*/
//企业类型
filter("#tab-all","one","#filter-table")
filter("#tab-hmd","one","#filter-table-sx")
filter("#tab-yx","one","#filter-table-yx")
//所在地区
filter("#tab-all","two","#filter-table")
filter("#tab-hmd","two","#filter-table-sx")
filter("#tab-yx","two","#filter-table-yx")
//成立日期
filter("#tab-all","three","#filter-table")
filter("#tab-hmd","three","#filter-table-sx")
filter("#tab-yx","three","#filter-table-yx")


//搜索按钮
$(".filter_button").click(function(){
    var filterQuery = {regLocation:$("#tab-all .filter_cur_two").attr("data-query"),enterpriseClassification:$("#tab-all .filter_cur_one").attr("data-query"),days:$("#tab-all .filter_cur_three").attr("data-query")}
    var filter_input_range = {
        "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
        "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
        "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
        "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
        "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
    }
    var query = $.extend(filterQuery,filter_input_range)
    $("#filter-table").bootstrapTable("refresh",{query:query})
})


