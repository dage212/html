//获取公司名字
var name_index = location.search.indexOf("name");
var company_name = location.search.slice(name_index+5);
//获取用户名
var userInfo = JSON.parse(sessionStorage.getItem("platformInfo"));

template.defaults.imports.format = function(val,arr) {
    if(arr == "array"){//数组转字符串
        return val.join("、")
    }else if(arr == "round"){
        return Math.round(val)
    }
}
//null undefined处理
template.defaults.imports.default = function(val,dfg){
    if(val == ""||val == undefined||val == null||val.length <= 0){
        if(dfg == "-"){
            return "-";
        }else if(dfg == "暂无数据"){
            return "暂无数据";
        }else if(dfg == "array"){
            return "-";
        }
    }
    return val;
}
//
var loadFunObj1 = new loadFun(".company_info",{"left":"50%","top":"50%","margin-top":"-30px","margin-left":"-100px"})
loadFunObj1.show()

var listAjax = function(option,obj){
    // var option = {
    //         url:options.url,
    //         tableClass:options.tableClass,
    //         tplId:options.tplId,
    //         jqPaginator:options.jqPaginator,
    //         objFun:function(page){
    //                 return {keyWord:"小米科技有限责任公司",pageIndex:page}
    //             },
    //          totalFun:function(){}
    // }
    $.get(option.url,option.objFun(1),function(res){
        var res = res,resData;
        //嵌套企业基本信息
        if(obj&&obj.callback){
            obj.callback(res)
        }

        //返回code
        if(res.code&&res.code != 2000){
            option.totalFun(0) //总数赋值
            $("."+option.tableClass).css({marginBottom:0}).after("<div style='text-align:center;font-size:16px;color:#333333;padding:10px;border:1px solid #ddd;border-top:0px;'>查询无结果</div>");
            return;
        }else if(res.code&&res.code == 2000){
            resData = res.data;
            option.totalFun(resData.total)
        }
        //没有没有返回code
        if(!res.code&&(!res.rows||res.rows.length == 0)){
            option.totalFun(0)//总数赋值
            $("."+option.tableClass).css({marginBottom:0}).after("<div style='text-align:center;font-size:16px;color:#333333;padding:10px;border:1px solid #ddd;border-top:0px;'>查询无结果</div>");
            return;
        }else if(!res.code&&res.rows){
            resData = res
            option.totalFun(resData.total)//总数赋值
        }



        var tpl = template(option.tplId,resData);
        $("."+option.tableClass+" tbody").html(tpl);
        $('#'+option.jqPaginator).jqPaginator({
            totalPages: Math.ceil(resData.total/20)||1,
            visiblePages: 1,
            currentPage: 1,
            prev: '<li class="prev"><a href="javascript:void(0);">上一页</a></li>',
            next: '<li class="next"><a href="javascript:void(0);">下一页</a></li>',
            onPageChange: function (num, type) {
                $.get(option.url,option.objFun(num),function(res){
                    var res = res,resData;
                    //获取table详情
                    if(obj&&obj.data){
                        obj.data(res)
                    }
                    //返回code
                    if(res.code&&res.code != 2000){
                        $("."+option.tableClass).css({marginBottom:0}).after("<div style='text-align:center;font-size:16px;color:#333333;padding:10px;border:1px solid #ddd;border-top:0px;'>查询无结果</div>");
                        return;
                    }else if(res.code&&res.code == 2000){
                        resData = res.data;
                    }
                    //没有没有返回code
                    if(!res.code&&!res.rows){
                        $("."+option.tableClass).css({marginBottom:0}).after("<div style='text-align:center;font-size:16px;color:#333333;padding:10px;border:1px solid #ddd;border-top:0px;'>查询无结果</div>");
                        return;
                    }else if(!res.code&&res.rows){
                        resData = res
                    }
                    var tpl = template(option.tplId,resData);
                    $("."+option.tableClass+" tbody").html(tpl)
                },"json")
            }
        });
    },"json")
}
//总数
var totalNumber =function (total,id){
    if(total >=99){
        total = " 99+"
    }else{
        total = " "+total
    }
    $("a[href='"+id+"']").next().text(total)
    $(id+" .num").text( total)
}

//获取企业ID
var companyId;
//企业信息
$.get("/cccredit/web_enterpriseInfoController/web_getTitleEnterpriseInfo.form",{name:decodeURI(company_name)},function(res){
    loadFunObj1.hide()
    var tpl = template("company_info_tpl",res.obj);
	companyId = res.obj.id;
    $(".company_info").html(tpl);
},"json")
//添加预警
$(".company_info").on("click",".add_yj",function(){
	$.get("/cccredit/web_monitoringController/web_insertMonitoring.form",{enterpriseId:companyId, userId:userInfo.userId},function(res){
		var msg = res.msg;
		if(res.success == true){
			layer.alert("添加成功",{
				time: 0, 
				icon: 6, 
				yes: function(index){
					layer.close(index);
				}
			});
		} else {
			layer.alert("添加失败",{
				time: 0, 
				icon: 2, 
				yes: function(index){
					layer.close(index);
				}
			});
		}
	},"json")
})

//工商变更信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAChange.form",
    tableClass:"gs_changeinfo_table",
    tplId:"gs_change_info_tpl",
    jqPaginator:"gs_change_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#gsbg")
    }
},{callback:function(){
    //工商信息
    $.get("/cccredit/web_enterpriseInfoController/web_getDNAEnterpriseInfo.form",{name:decodeURI(company_name)},function(res){
        if(res.code !=2000){
            $("#gsxx table tbody").html("<tr><td></td>暂无查询结果</tr>");
            return;
        }
        var tpl = template("gs_info",res.data);
        $("#gsxx table tbody").html(tpl);
    },"json")
}})
//分支机构
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNABranch.form",
    tableClass:"fzjg_table",
    tplId:"fzjg_tpl",
    jqPaginator:"fzjg_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#fzjg")
    }
})
//任职信息
$.get("/cccredit/web_interfaceController/web_getDNAMainPerson.form",{name:decodeURI(company_name)},
    function(res){
        if(res.code !=2000||res.data.items.length == 0){
            $(".power_info_box").html("<div>暂无查询结果</div>")
            return;
        }
        var tpl = template("rzxx_tpl",res.data)
        $("a[href='#rzxx']").next("span").text(res.data.items.length)
        $("#rzxx").find(".num").text(res.data.items.length)
        $(".power_info_box").html(tpl)
    },"json")
//对外投资
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAInvest.form",
    tableClass:"dwtz_table",
    tplId:"dwtz_tpl",
    jqPaginator:"dwtz_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#dwtz")
    }
})
//股东信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAShareholder.form",
    tableClass:"gd_info_table",
    tplId:"gd_info_tpl",
    jqPaginator:"gd_info_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#gdxx")
    }
})
//股权出质信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAEquityPledged.form",
    tableClass:"gqczxx_table",
    tplId:"gqczxx_tpl",
    jqPaginator:"gqczxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#gqczxx")
    }
})
//进出口信用等级
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAImportAndExport.form",
    tableClass:"jckxydj_table",
    tplId:"jckxydj_tpl",
    jqPaginator:"jckxydj_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#jckxydj")
    }
})
//进出口信用等级详情弹窗1
$.get("/cccredit/web_interfaceController/web_getDNAImportAndExport.form",{name:decodeURI(company_name)},function(res){
    if(res.code !=2000){
        $(".jckxydj_pop1 tbody").html("<tr><td></td>暂无查询结果</tr>");
        return;
    }
    var tpl = template("jckxydj_pop1_tpl",res.data);
    $(".jckxydj_pop1 tbody").html(tpl);
},"json")
//进出口信用等级详情弹窗2
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAImportAndExport.form",
    tableClass:"jckxydj_pop2",
    tplId:"jckxydj_pop2_tpl",
    jqPaginator:"jckxydj_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#jckxydj")
    }
})
//税务等级
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNATaxCredit.form",
    tableClass:"swdj_table",
    tplId:"swdj_tpl",
    jqPaginator:"swdj_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#swdj")
    }
})
//证书信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAQualificationt.form",
    tableClass:"zsxx_table",
    tplId:"zsxx_tpl",
    jqPaginator:"zsxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#zsxx")
    }
},{data:function(res){
    $(".zsxx_table").data("arr",res.data)
}})
//证书详情点击
$(".zsxx_table").on("click",".details",function(){
    var index = $(this).parents("tr").index(),
        arr = $(".zsxx_table").data("arr");
    if(arr.items != undefined){
        var tpl = template("zsxx_modal_tpl",arr.items[index-1])
        $("#popup-zsxx .pop-con").html(tpl)
        $("#popup-zsxx").modal("show")
    }
})
//检查信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNASpotCheck.form",
    tableClass:"jcxx_table",
    tplId:"jcxx_tpl",
    jqPaginator:"jcxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#jcxx")
    }
})
//招投标信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNABid.form",
    tableClass:"ztbxx_table",
    tplId:"ztbxx_tpl",
    jqPaginator:"ztbxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#ztbxx")
    }
})
//动产抵押
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAMorgageAssets.form",
    tableClass:"dcdy_table",
    tplId:"dcdy_tpl",
    jqPaginator:"dcdy_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#dcdyxx")
    }
},{data:function(res){
    $(".dcdy_table").data("arr",res.data)
}})
//动产详情点击
$(".dcdy_table").on("click",".details",function(){
    var index = $(this).parents("tr").index(),
        arr = $(".dcdy_table").data("arr");
    if(arr.items != undefined){
        var tpl = template("dcdy_modal_tpl",arr.items[index-1])
        $("#popup-dcdyxx .pop-con").html(tpl)
        $("#popup-dcdyxx").modal("show")
    }
})
//icp备案信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getIcp.form",
    tableClass:"icp_table",
    tplId:"icp_tpl",
    jqPaginator:"icp_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#ICPbaxx")
    }
})
//商标信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getTrademark.form",
    tableClass:"sbxx_table",
    tplId:"sbxx_tpl",
    jqPaginator:"sbxx_page",
    objFun:function(page){
        return {name:"小米科技有限责任公司",page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#sbxx")
    }
},{data:function(res){
        $(".sbxx_table").data("arr",res.data)
    }})
//商标详情点击
$(".sbxx_table").on("click",".details",function(){
    var index = $(this).parents("tr").index(),
        arr = $(".sbxx_table").data("arr");
    if(arr.items != undefined){
        var tpl = template("sbxx_modal_tpl",arr.items[index-1])
        $("#popup-sbxx .pop-con").html(tpl)
        $("#popup-sbxx").modal("show")
    }
})
//专利信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getPatent.form",
    tableClass:"zlxx_table",
    tplId:"zlxx_tpl",
    jqPaginator:"zlxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#zlxx")
    }
})
//作品著作权
listAjax({
    url:"/cccredit/web_interfaceController/web_getWorkCopyright.form",
    tableClass:"zpzzqxx_table",
    tplId:"zpzzqxx_tpl",
    jqPaginator:"zpzzqxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#zpzzqxx")
    }
})
//软件著作权
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNASoftwareCopyright.form",
    tableClass:"rjzzq_table",
    tplId:"rjzzq_tpl",
    jqPaginator:"rjzzq_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#rjzzqxx")
    }
})
//裁判文书
listAjax({
    url:"/cccredit/web_interfaceController/web_getJudgement.form",
    tableClass:"cpws_table",
    tplId:"cpws_tpl",
    jqPaginator:"cpws_page",
    objFun:function(page){
        return {keyWord:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#cpws")
    }
})
//法院公告
listAjax({
    url:"/cccredit/web_interfaceController/web_getCourtNotice.form",
    tableClass:"fygg_table",
    tplId:"fygg_tpl",
    jqPaginator:"fygg_page",
    objFun:function(page){
        return {keyWord:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#fygg")
    }
})

//失信被执行人
listAjax({
    url:"/cccredit/web_interfaceController/web_getDiscredit.form",
    tableClass:"sxbzxr_table",
    tplId:"sxbzxr_tpl",
    jqPaginator:"sxbzxr_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#sxbzxr")
    }
})

//开庭公告
listAjax({
    url:"/cccredit/web_interfaceController/web_getSessionNotice.form",
    tableClass:"ktgg_table",
    tplId:"ktgg_tpl",
    jqPaginator:"ktgg_page",
    objFun:function(page){
        return {keyWord:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#ktgg")
    }
})
//经营异常
listAjax({
    url:"/cccredit/web_interfaceController/web_getOpException.form",
    tableClass:"jyyc_table",
    tplId:"jyyc_tpl",
    jqPaginator:"jyyc_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#jyyc")
    }
})
//行政处罚
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNAAdminPenalty.form",
    tableClass:"xzcf_table",
    tplId:"xzcf_tpl",
    jqPaginator:"xzcf_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#xzcf")
    }
})
//欠税信息
listAjax({
    url:"/cccredit/web_interfaceController/web_getDNATaxDefault.form",
    tableClass:"qsxx_table",
    tplId:"qsxx_tpl",
    jqPaginator:"qsxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#qsxx")
    }
})
//评级信息
listAjax({
    url:"/cccredit/Web_RatingEnterpriseController/web_getRatingByEnterpriseName.form",
    tableClass:"pjxx_table",
    tplId:"pjxx_tpl",
    jqPaginator:"pjxx_page",
    objFun:function(page){
        return {enterpriseName:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#pjxx")
    }
})
//征信信息
listAjax({
    url:"/cccredit/web_creditManagement/web_datagridByName.form",
    tableClass:"zxxx_table",
    tplId:"zxxx_tpl",
    jqPaginator:"zxxx_page",
    objFun:function(page){
        return {name:decodeURI(company_name),page:page}
    },
    totalFun:function(total){
        totalNumber(total,"#zxxx")
    }
})

//财务信息
$.ajax({
    url: "/cccredit/Web_FinancialDataController/web_getFinancialData.form",
    type: "GET",
    data: {
        enterpriseName: decodeURI(company_name),
        //enterpriseCode: "",
        page: 1,
        rows: 2
    },
    success: function(data){
        jsonData = $.parseJSON(data);
        tableData = $.parseJSON(data).rows;
        tableHtml = "";
        if(jsonData.total == 0){
            $(".tab_table_cw").css({marginBottom:0}).after("<div style='text-align:center;font-size:16px;color:#333333;padding:10px;'>查询无结果</div>");
            return;
        } else if (jsonData.total != 0 && jsonData.total != undefined){
			//设定当前页面所需内容的字段，用于匹配对比返回数据中缺失的字段，统一做undefined替换处理
			/*var xs = {year:"",monetaryFund:"",accountsReceivable:"",inventory:"",totalCurrentAssets:"",longTermEquityInvestment:"",bookValueOfFixedAssets:"",assetsTotal:"",shortTermBorrowing:"",accountsPayable:"",totalCurrentLiabilities:"",longTermBorrowing:"",totalLiabilities:"",capitalReserves:"",undistributedProfit:"",operatingIncome:"",operatingCost:"",financeCharges:"",operatingProfit:"",totalProfit:"",netProfit:"",};
			tableData.unshift(xs);*/
			for(var i=0; i<tableData.length; i++){
				/*for(var x in tableData[0]){
					if(tableData[i][x] == undefined || tableData[i][x] == ""){
						tableData[i][x] = "-";
					}
				}*/
				if(tableData[i].year == undefined || tableData[i].year == ""){
					tableData[i].year = "-";
				}
				if(tableData[i].monetaryFund == undefined || tableData[i].monetaryFund == ""){
					tableData[i].monetaryFund = "-";
				}
				if(tableData[i].accountsReceivable == undefined || tableData[i].accountsReceivable == ""){
					tableData[i].accountsReceivable = "-";
				}
				if(tableData[i].inventory == undefined || tableData[i].inventory == ""){
					tableData[i].inventory = "-";
				}
				if(tableData[i].totalCurrentAssets == undefined || tableData[i].totalCurrentAssets == ""){
					tableData[i].totalCurrentAssets = "-";
				}
				if(tableData[i].longTermEquityInvestment == undefined || tableData[i].longTermEquityInvestment == ""){
					tableData[i].longTermEquityInvestment = "-";
				}
				if(tableData[i].bookValueOfFixedAssets == undefined || tableData[i].bookValueOfFixedAssets == ""){
					tableData[i].bookValueOfFixedAssets = "-";
				}
				if(tableData[i].assetsTotal == undefined || tableData[i].assetsTotal == ""){
					tableData[i].assetsTotal = "-";
				}
				if(tableData[i].shortTermBorrowing == undefined || tableData[i].shortTermBorrowing == ""){
					tableData[i].shortTermBorrowing = "-";
				}
				if(tableData[i].accountsPayable == undefined || tableData[i].accountsPayable == ""){
					tableData[i].accountsPayable = "-";
				}
				if(tableData[i].totalCurrentLiabilities == undefined || tableData[i].totalCurrentLiabilities == ""){
					tableData[i].totalCurrentLiabilities = "-";
				}
				if(tableData[i].longTermBorrowing == undefined || tableData[i].longTermBorrowing == ""){
					tableData[i].longTermBorrowing = "-";
				}
				if(tableData[i].totalLiabilities == undefined || tableData[i].totalLiabilities == ""){
					tableData[i].totalLiabilities = "-";
				}
				if(tableData[i].capitalReserves == undefined || tableData[i].capitalReserves == ""){
					tableData[i].capitalReserves = "-";
				}
				if(tableData[i].undistributedProfit == undefined || tableData[i].undistributedProfit == ""){
					tableData[i].undistributedProfit = "-";
				}
				if(tableData[i].operatingIncome == undefined || tableData[i].operatingIncome == ""){
					tableData[i].operatingIncome = "-";
				}
				if(tableData[i].operatingCost == undefined || tableData[i].operatingCost == ""){
					tableData[i].operatingCost = "-";
				}
				if(tableData[i].financeCharges == undefined || tableData[i].financeCharges == ""){
					tableData[i].financeCharges = "-";
				}
				if(tableData[i].operatingProfit == undefined || tableData[i].operatingProfit == ""){
					tableData[i].operatingProfit = "-";
				}
				if(tableData[i].totalProfit == undefined || tableData[i].totalProfit == ""){
					tableData[i].totalProfit = "-";
				}
				if(tableData[i].netProfit == undefined || tableData[i].netProfit == ""){
					tableData[i].netProfit = "-";
				}
			}
            tableHtml += "<tr>\n" +
                "<td>报表日期</td>\n" +
                "<td>" + tableData[0].year + "</td>\n" +
                "<td>" + tableData[1].year + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>货币单位</td>\n" +
                "<td>元</td>\n" +
                "<td>元</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>货币资金</td>\n" +
                "<td>" + tableData[0].monetaryFund + "</td>\n" +
                "<td>" + tableData[1].monetaryFund + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>应收账款</td>\n" +
                "<td>" + tableData[0].accountsReceivable + "</td>\n" +
                "<td>" + tableData[1].accountsReceivable + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>存货</td>\n" +
                "<td>" + tableData[0].inventory + "</td>\n" +
                "<td>" + tableData[1].inventory + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>流动资产合计</td>\n" +
                "<td>" + tableData[0].totalCurrentAssets + "</td>\n" +
                "<td>" + tableData[1].totalCurrentAssets + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>长期股权投资</td>\n" +
                "<td>" + tableData[0].longTermEquityInvestment + "</td>\n" +
                "<td>" + tableData[1].longTermEquityInvestment + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>固定资产账面价值</td>\n" +
                "<td>" + tableData[0].bookValueOfFixedAssets + "</td>\n" +
                "<td>" + tableData[1].bookValueOfFixedAssets + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>资产合计</td>\n" +
                "<td>" + tableData[0].assetsTotal + "</td>\n" +
                "<td>" + tableData[1].assetsTotal + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>短期借款</td>\n" +
                "<td>" + tableData[0].shortTermBorrowing + "</td>\n" +
                "<td>" + tableData[1].shortTermBorrowing + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>应付账款</td>\n" +
                "<td>" + tableData[0].accountsPayable + "</td>\n" +
                "<td>" + tableData[1].accountsPayable + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>流动负债合计</td>\n" +
                "<td>" + tableData[0].totalCurrentLiabilities + "</td>\n" +
                "<td>" + tableData[1].totalCurrentLiabilities + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>长期借款</td>\n" +
                "<td>" + tableData[0].longTermBorrowing + "</td>\n" +
                "<td>" + tableData[1].longTermBorrowing + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>负债合计</td>\n" +
                "<td>" + tableData[0].totalLiabilities + "</td>\n" +
                "<td>" + tableData[1].totalLiabilities + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>资本公积</td>\n" +
                "<td>" + tableData[0].capitalReserves + "</td>\n" +
                "<td>" + tableData[1].capitalReserves + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>未分配利润</td>\n" +
                "<td>" + tableData[0].undistributedProfit + "</td>\n" +
                "<td>" + tableData[1].undistributedProfit + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>营业收入</td>\n" +
                "<td>" + tableData[0].operatingIncome + "</td>\n" +
                "<td>" + tableData[1].operatingIncome + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>营业成本</td>\n" +
                "<td>" + tableData[0].operatingCost + "</td>\n" +
                "<td>" + tableData[1].operatingCost + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>财务费用</td>\n" +
                "<td>" + tableData[0].financeCharges + "</td>\n" +
                "<td>" + tableData[1].financeCharges + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>营业利润</td>\n" +
                "<td>" + tableData[0].operatingProfit + "</td>\n" +
                "<td>" + tableData[1].operatingProfit + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>利润总额</td>\n" +
                "<td>" + tableData[0].totalProfit + "</td>\n" +
                "<td>" + tableData[1].totalProfit + "</td>\n" +
                "</tr>\n" +
                "<tr>\n" +
                "<td>净利润</td>\n" +
                "<td>" + tableData[0].netProfit + "</td>\n" +
                "<td>" + tableData[1].netProfit + "</td>\n" +
                "</tr>";
        }
        $(".tab_table_cw").html(tableHtml);
    }
});

$(".tab_title_li").click(function(){
    var index = $(this).index();
    $(this).addClass("active").css({"color":"#1e8ed9","border-bottom":0}).siblings().removeClass("active").css({"color":"#333333","border-bottom":"1px solid #dddddd"})
    $(".tab_content_li").css("display","none").eq(index).fadeIn()
})







//关联关系图

$.ajax({
    url: "/cccredit/web_interfaceController/web_getRelatedParty.form",
    cache: false,
    async: true,
    dataType:"json",
    data: {name: decodeURI(company_name), depth: 1,calcute:0},
    success: function (data) {
        if(data.code != 2000) {
            var svg = d3.select("#d3_js").append("div")
                .attr("width",800)
                .attr("height",446)
                .html("<h3 style='text-align:center'>暂无数据</h3>");

        } else {

            var graph = data.data.graph;
            graph.relationList.forEach(function(value){
                graph.nodeList.forEach(function(val){
                    val.name=val.entityName
                    if(value.targetEntity == val.id){
                        value.target = val
                    }
                    if(value.sourceEntity == val.id){
                        value.source = val
                    }
                })
            })

            console.log(graph.nodeList)
            console.log(graph.relationList)

            var svg = d3.select("#d3_js").append("svg")
                .attr("width",800).attr("height",446);
            var force = d3.layout.force()
                .nodes(graph.nodeList)
                .links(graph.relationList)
                .size([400,400])	//指定范围
                .linkDistance(150)	//指定连线长度
                .charge(-400);	//相互之间的作用力
                force.start();	//开始作用



            //添加连线
            var svg_edges = svg.selectAll("line")
                .data(graph.relationList)
                .enter()
                .append("line")
                .style("stroke","#ccc")
                .style("stroke-width",1);

            var color = d3.scale.category20();

            //添加节点
            var svg_nodes = svg.selectAll("circle")
                .data(graph.nodeList)
                .enter()
                .append("circle")
                .attr("r",20)
                .style("fill",function(d,i){
                    return color(i);
                })
                .call(force.drag);	//使得节点能够拖动

            //添加描述节点的文字
            var svg_texts = svg.selectAll("text")
                .data(graph.nodeList)
                .enter()
                .append("text")
                .style("fill", "black")
                .attr("dx", -4)
                .attr("dy", 0)
                .attr("font-size",10)
                .text(function(d){
                    return d.name;
                });


            force.on("tick", function(){	//对于每一个时间间隔

                //更新连线坐标
                svg_edges.attr("x1",function(d){ return d.source.x; })
                    .attr("y1",function(d){ return d.source.y; })
                    .attr("x2",function(d){ return d.target.x; })
                    .attr("y2",function(d){ return d.target.y; });

                //更新节点坐标
                svg_nodes.attr("cx",function(d){ return d.x; })
                    .attr("cy",function(d){ return d.y; });

                //更新文字坐标
                svg_texts.attr("x", function(d){ return d.x; })
                    .attr("y", function(d){ return d.y; });
            });
            if(window.DrawRelation) {
                var drawRelation = new DrawRelation(graph, "d3_js", 0);
                drawRelation.init();
            } else {
                $.getScript('/js/findRelationship/common/common-relation.js', function () {
                    var drawRelation = new DrawRelation(graph, "d3_js", 0);
                    drawRelation.init();
                    //lhdna/relation/getRelatedParty?companyName=联合信用管理有限公司&depth=2&_=1519452566410
                });
            }
        }
    }
});
