//最新预警列表
$('#filter-table').bootstrapTable({
    url: "/cccredit/web_enterpriseInfoController/web_datagrid.form",
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
    pageSize: 5,
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
        width: 30,
        class: "text-center"
    }, {
        field: 'base',
        title: '企业名称',
        width: 286,
        class:'comp-name'
    },{
        field: 'base',
        title: '最新预警时间',
        width: 120,
        class:'text-center'
    },{
        field: 'companyOrgType',
        title: '主题预警等级',
        class:'grade',
        width: 120,
        formatter:function(value,row,index){
            return "<div class='red_type'>红色预警</div>"
        }
    },{
        field: 'companyOrgType',
        title: '重大事项预警',
        class:'grade',
        width: 120,
        formatter:function(value,row,index){
            return "<div class=''>红色预警</div>"
        }
    },{
        field: 'base',
        title: '提示事项',
        width: 160,
        class:'text-center'
    }, {
            field: 'dataStatus',
            title: '操作',
            width: 140,
            class: "text-center",
            formatter:function(value,row,index){
                return "<a class='a_link'>查看详情</a>"
            }
        }
    ]
});