$(function() {

    //过滤方法
    var filter = function(pele,ele,table){
        /*
            @pele=#xxx
            @ele=.xxx
            @table = #xxx
        */

        var filterQuery = {regLocation:"",enterpriseClassification:"",days:"",name:""}
        //删除过滤条件  点击全部
        $(pele+" .filter_"+ele+" .filter_one_all").click(function(){
            $(this).css({color:"#fff","background":"#11A0EC"}).next().find(".list").removeClass("active")
            $(pele+" .filter_four .filter_content").children().remove(".filter_cur_"+ele)
            filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}
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
        // //删除过滤条件  点击X
        // $(pele+" .filter_content").on("click",".filter_cur_"+ele,function(){
        //     $(this).remove()
        //     $(pele+" .filter_"+ele+" .filter_one_all").css({color:"#fff","background":"#11A0EC"}).next().find(".list").removeClass("active")
        //     $(pele+" .filter_four .filter_content").children().remove(".filter_cur_"+ele)
        //     filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}
        //     var filter_input_range = {
        //         "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
        //         "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
        //         "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
        //         "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
        //         "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
        //     }
        //     var query = $.extend(filterQuery,filter_input_range)
        //     $(table).bootstrapTable("refresh",{query:query})
        // })

        //添加过滤条件
        $(pele+" .filter_"+ele+" .list").click(function(){
            $(this).addClass("active").siblings().removeClass("active").parent().prev().css({color:"#999999","background":"#fff"})

            sessionStorage.setItem("filter_"+ele,$(this).attr("data-query"))//添加sessionStorage
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
            filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}
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

    //判断从首页进入参数
    if(location.search.indexOf("search") > 0){
        var search_param = location.search.slice(8);
        $(".input_text_val").val(decodeURI(search_param))
    }
    $('#filter-table').bootstrapTable({
        url: "/cccredit/web_enterpriseInfoController/web_datagrid.form",
        queryParams:function(params){
            var option = {
                page:$("#tab-all .pagination .active>a").text()||1,
                rows:$("#tab-all .page-size").text()||10,
                regLocation:$("#tab-all .filter_cur_two").attr("data-query"),
                enterpriseClassification:$("#tab-all .filter_cur_one").attr("data-query"),
                days:$("#tab-all .filter_cur_three").attr("data-query"),
                name:decodeURI(search_param) !="undefined"?decodeURI(search_param):$(".input_text_val").val()
            }
            return option
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
            field: 'auditStatus',
            title: '序号',
            formatter: function (value, row, index) {
                return index+1;
            },
            width: 30,
            class: "text-center"
        }, {
            field: 'name',
            title: '企业名称',
            width: 450,
            formatter:function(val,row,index){
                return '<a class="" href="./info_search_basic.html?name='+val+'">'+val+'</a>'
            }
        }, {
            field: 'regLocationStr',
            title: '所在地区',
            width: 150
        },
            {
                field: 'enterpriseClassificationStr',
                title: '行业分类',
                width: 220,
                class: "text-center"
            },
            {
                field: 'estiblishTimeStr',
                title: '成立日期',
                width: 180,
                class: "text-center"
            },
            {
                field: 'score',
                title: '信用评分',
                width: 124,
                class: "text-center"
            }
        ]
    });

    var getRange = function(start,end){
        if(start == ""||start == undefined){
            start = "*"
        }
        if(end == ""||end == undefined){
            end = "*"
        }
        return start+":"+end
    }

    //搜索
    $(".filter_button").click(function(){
        var pele = "#tab-all";
        var filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}


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
    $(".input_text_val").keydown(function(e){
        if(e.which == 13){
            sessionStorage.setItem('company',$(this).val())
            var pele = "#tab-all";
            var filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}
            var filter_input_range = {
                "accountsReceivableRange":getRange($(".account_start").val(),$(".account_end").val()),//应收账款
                "assetsTotalRange":getRange($(".assets_start").val(),$(".assets_end").val()),//资产合计
                "longTermBorrowingRange":getRange($(".long_start").val(),$(".long_end").val()),//长期借款
                "operatingIncomeRange":getRange($(".operate_start").val(),$(".operate_end").val()),//营业收入
                "netProfitRange":getRange($(".netpro_start").val(),$(".netpro_end").val())//净利润
            }
            var query = $.extend(filterQuery,filter_input_range)
            $("#filter-table").bootstrapTable("refresh",{query:query})
        }
    })
    //搜索删除
    $(".filter_input_box img").click(function(){
        $(".input_text_val").val("")
        var pele = "#tab-all";
        var filterQuery = {regLocation:$(pele+" .filter_cur_two").attr("data-query"),enterpriseClassification:$(pele+" .filter_cur_one").attr("data-query"),days:$(pele+" .filter_cur_three").attr("data-query"),name:$(".input_text_val").val()}
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
    $(".input_start").on('input propertychange',function(){
        var startTime = $(this).val()
    });
    //企业类型
    filter("#tab-all","one","#filter-table")
    //所在地区
    filter("#tab-all","two","#filter-table")
    //成立日期
    filter("#tab-all","three","#filter-table")
});