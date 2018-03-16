//最新预警列表
$('#filter-table').bootstrapTable({
    url: "/cccredit/web_monitoringController/web_datagridInterior.form",
    queryParams:function(params){
        console.log(params)
        console.log($(".pagination .active>a").text())
        return {
            // search:'',
            // sort:'',
            // order:'',
            page:$(".pagination .active>a").text()||1,
            rows:$(".page-size").text()||5
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
        field: 'index',
        title: '序号',
        width: 30,
        class: "text-center",
        formatter: function (value, row, index) {
            return index+1;
        },
    }, {
        field: 'enterpriseName',
        title: '企业名称',
        width: 450,
        class:'comp-name',
        formatter:function(value,row,index){
            return '<a href="./info_search_basic.html?name='+value+'">'+value+'</a>'
        }
    }, {
        field: 'addMonitoringTimeStr',
        title: '加入监控时间',
        width: 150,
        class: "text-center"
    },
    {
        field: 'monitoringStateStr',
        title: '监控状态',
        class:'text-center',
        width: 300
    },
    {
        field: 'monitoringState',
        title: '操作',
        width: 220,
        class: "text-center",
        formatter:function(value,row,index){
            console.log(value)
            if(value == "0"){
                return "<span class='operation blue-operation'>停止监控</span>"
            }else{
                return "<span class='operation blue-operation'>开始监控</span>"
            }

        }
    }
    ]
});