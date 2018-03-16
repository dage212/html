$(function(){
    // app.title = '环形图';
    var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                right: 10,
                top: 46,
                bottom: 20,
                color:'#33333',
                fontSize:'14px',
                itemWidth:10,//方块宽度
                itemHeight:10,//方块高度
                itemGap:20,//方块间隔
                data:['红色预警','橙色预警','黄色预警','无预警']
            },
            series: [
                {
                    name:'监控企业数',
                    type:'pie',
                    radius: ['45px', '90px'],
                    center:['100px','100px'],//圆心
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16px',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:4, name:'红色预警'},
                        {value:4, name:'橙色预警'},
                        {value:2, name:'黄色预警'},
                        {value:75, name:'无预警'}
                    ]
                }
            ],
            color:['rgb(235,44,44)','rgb(255,182,78)','rgb(255,241,82)','rgb(62,183,228)']
    };
    echarts.init(document.getElementById('echart')).setOption(option);

    //最新预警列表
    // $('#filter-table').bootstrapTable({
    //     url: "/cccredit/web_enterpriseInfoController/web_datagrid.form",
    //     queryParams:function(params){
    //         console.log(params)
    //         console.log($(".pagination .active>a").text())
    //         return {
    //             // search:'',
    //             // sort:'',
    //             // order:'',
    //             page:$(".pagination .active>a").text()||1,
    //             rows:$(".page-size").text()||5
    //         }
    //     },
    //     responseHandler:function(res){//组装后台返回数据
    //         return res;
    //     },
    //     sidePagination: 'server',
    //     pagination: true,
    //     pageNumber: 1,
    //     pageSize: 5,
    //     pageList: [5, 10, 20],
    //     dataType: "json",
    //     contentType: "application/x-www-form-urlencoded",
    //     paginationVAlign: 'bottom',
    //     paginationHAlign: 'right',
    //     paginationPreText: "<<",
    //     paginationNextText: ">>",
    //     columns: [{
    //         field: 'auditStatus',
    //         title: '序号',
    //         width: 30,
    //         class: "text-center"
    //     }, {
    //         field: 'base',
    //         title: '企业名称',
    //         width: 450,
    //         class:'comp-name'
    //     }, {
    //         field: 'companyOrgType',
    //         title: '主体预警等级',
    //         class:'grade',
    //         width: 200,
    //         formatter:function(value,row,index){
    //             console.log(value)
    //             return "<div class='red_type'>红色预警</div>"
    //         }
    //     },
    //     {
    //         field: 'dataStatus',
    //         title: '最新预警',
    //         width: 476,
    //         class: "text-center",
    //         formatter:function(value,row,index){
    //             return "<div class='warning_type_box'><p class='text'>最近三个月重大事项预警：</p><div class='warning_div'><p class='warning_type'>涉及司法纠纷<span class='circle'>2</span></p><p class='warning_type'>受到行政处罚<span class='circle'>2</span></p><p class='warning_type'>受到行政处罚<span class='circle'>2</span></p></div></div>"
    //         }
    //     }
    //     ]
    // });
})