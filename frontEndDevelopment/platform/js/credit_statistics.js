$(function(){
	var y = false;
	var a = false;
	var i = false;
	$("#toggle_year").click(function(){
		$(this).parents("article").find(".toggle_con").slideToggle("fast");
		if(y = !y){
			$(this).html("展开 ∨");
		} else {
			$(this).html("收起 ∧");
		}
	})
	$("#toggle_area").click(function(){
		$(this).parents("article").find(".toggle_con").slideToggle("fast");
		if(a = !a){
			$(this).html("展开 ∨");
		} else {
			$(this).html("收起 ∧");
		}
	})
	$("#toggle_industry").click(function(){
		$(this).parents("article").find(".toggle_con").slideToggle("fast");
		if(i = !i){
			$(this).html("展开 ∨");
		} else {
			$(this).html("收起 ∧");
		}
	})
});
//加载中实例化
var loadFunObj1 = new loadFun(".tongji_data_one",{"left":"50%","top":"50%","margin-left":"-100px"})
var loadFunObj2 = new loadFun(".tongji_data_two",{"left":"50%","top":"50%","margin-left":"-100px"})
var loadFunObj3 = new loadFun(".tongji_data_three",{"left":"50%","top":"50%","margin-left":"-100px"})

var startYear;
var endYear;
var regLocation;
var regLocationStr;
var enterpriseClassification;
var industryCode;

loadFunObj1.show();
loadFunObj2.show();
loadFunObj3.show();
$.when($.ajax({
		url: "/cccredit/web_selectManageController/web_getYears.form",
		type: "GET",
		data: {},
		success: function(data){
			var years = $.parseJSON(data).obj;
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i] + "'>" + years[i] + "</option>"
			}
			$(".yearDesc").html(yearHtml);
			endYear = years[0];
		}
	}),$.ajax({
		url: "/cccredit/web_selectManageController/web_getYears.form",
		type: "GET",
		data: {
			orderMethod: "asc"	
		},
		success: function(data){
			var years = $.parseJSON(data).obj;
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i] + "'>" + years[i] + "</option>"
			}
			$(".yearAsc").html(yearHtml);
			startYear = years[0];
		}
	}),$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: "regLocation"	
		},
		success: function(data){
			var area = $.parseJSON(data).rows;
			var areaHtml = "<option value='北京市' name='' selected>北京市</option>";
			for(var i = 0; i<area.length; i++){
				areaHtml += "<option value='" + area[i].detailName + "' name='" + area[i].detailCode + "'>" + area[i].detailName + "</option>"
			}
			$(".areas").html(areaHtml);
			regLocation = "";
			regLocationStr = "北京市";
		}
	}),$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: "enterpriseClassification"	
		},
		success: function(data){
			var ind = $.parseJSON(data).rows;
			var indHtml = "<option value='全部' name='' selected>全部</option>";
			for(var i = 0; i<ind.length; i++){
				indHtml += "<option value='" + ind[i].detailName + "' name='" + ind[i].detailCode + "'>" + ind[i].detailName + "</option>"
			}
			$(".indClass1").html(indHtml);
			enterpriseClassification = "";
		}
	})).done(function(res1,res2,res3,res4){
		yearStatistics();
		areaStatistics();
		indStatistics();
	});
	
/*function getParameter(){
//下拉年份筛选条件请求
	//降序
	$.ajax({
		url: "/cccredit/web_selectManageController/web_getYears.form",
		type: "GET",
		data: {},
		success: function(data){
			var years = $.parseJSON(data).obj;
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i] + "'>" + years[i] + "</option>"
			}
			$(".yearDesc").html(yearHtml);
			endYear = years[0];
		}
	});
	//升序
	$.ajax({
		url: "/cccredit/web_selectManageController/web_getYears.form",
		type: "GET",
		data: {
			orderMethod: "asc"	
		},
		success: function(data){
			var years = $.parseJSON(data).obj;
			//years.reverse();
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i] + "'>" + years[i] + "</option>"
			}
			$(".yearAsc").html(yearHtml);
			startYear = years[0];
		}
	});

//下拉地区筛选条件请求
	$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: "regLocation"	
		},
		success: function(data){
			var area = $.parseJSON(data).rows;
			var areaHtml = "<option value='北京市' name='' selected>北京市</option>";
			for(var i = 0; i<area.length; i++){
				areaHtml += "<option value='" + area[i].detailName + "' name='" + area[i].detailCode + "'>" + area[i].detailName + "</option>"
			}
			$(".areas").html(areaHtml);
			regLocation = "";
			regLocationStr = "北京市";
		}
	});

//下拉行业分类筛选条件请求
	$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: "enterpriseClassification"	
		},
		success: function(data){
			var ind = $.parseJSON(data).rows;
			var indHtml = "<option value='全部' name='' selected>全部</option>";
			for(var i = 0; i<ind.length; i++){
				indHtml += "<option value='" + ind[i].detailName + "' name='" + ind[i].detailCode + "'>" + ind[i].detailName + "</option>"
			}
			$(".indClass1").html(indHtml);
			enterpriseClassification = "";
		}
	});
	function getIndSecond(){
		$.ajax({
			url: "/cccredit/dictionaryDetailController/web_datagrid.form",
			type: "GET",
			data: {
				typeCode: ""	
			},
			success: function(data){
				var ind = $.parseJSON(data).rows;
				var indHtml = "<option value='全部' name='' selected>全部</option>";
				for(var i = 0; i<ind.length; i++){
					indHtml += "<option value='" + ind[i].detailName + "' name='" + ind[i].detailCode + "'>" + ind[i].detailName + "</option>"
				}
				$(".indClass2").html(indHtml);
				industryCode = "";
			}
		})
	}
}*/

//年度统计情况
function yearStatistics(){
var start = startYear;
var end = endYear;
var area = regLocation;
var areaStr = regLocationStr;
var indClass1 = enterpriseClassification;
var indClass2 = industryCode;
//年度统计情况ajax请求
$("#filter_year .yearAsc").change(function(){
    loadFunObj1.show();
	var option = $("#filter_year .yearAsc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	start = $(option).val();
	loadDataYear(start,end,area,areaStr,indClass1,indClass2);
});
$("#filter_year .yearDesc").change(function(){
    loadFunObj1.show();
	var option = $("#filter_year .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	loadDataYear(start,end,area,areaStr,indClass1,indClass2);
});
$("#filter_year .areas").change(function(){
    loadFunObj1.show();
	var option = $("#filter_year .areas option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	area = $(option).attr("name");
	areaStr = $(option).val();
	loadDataYear(start,end,area,areaStr,indClass1,indClass2);
});
$("#filter_year .indClass1").change(function() {
    loadFunObj1.show();
	var option = $("#filter_year .indClass1 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass1 = $(option).attr("name");
	indClass2 = "";
	$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: indClass1	
		},
		success: function(data){
			var ind = $.parseJSON(data).rows;
			var indHtml = "<option value='全部' name='' selected>全部</option>";
			for(var i = 0; i<ind.length; i++){
				indHtml += "<option value='" + ind[i].detailName + "' name='" + ind[i].detailCode + "'>" + ind[i].detailName + "</option>"
			}
			$("#filter_year .indClass2").html(indHtml);
		}
	})
	loadDataYear(start,end,area,areaStr,indClass1,indClass2);
});
$("#filter_year .indClass2").change(function() {
    loadFunObj1.show();
	var option = $("#filter_year .indClass2 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass2 = $(option).attr("name");
	loadDataYear(start,end,area,areaStr,indClass1,indClass2);
});

loadDataYear(start,end,area,areaStr,indClass1,indClass2);
function loadDataYear(start,end,area,areaStr,indClass1,indClass2){
	$.ajax({
		url: "/cccredit/web_enterpriseInfoController/web_getEnterpriseNumByYear.form",
		type: "GET",
		data: {
			startYear: start,
			endYear: end,
			regLocation: area,
			enterpriseClassification: indClass1,
			industryCode: indClass2
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			var dataTxt = $.parseJSON(data).extra.comment;
			var dataTit = "";
			var dataHtml = "";
			if(dataTxt != undefined && loadData != undefined){
				dataTit += "" + start + "年至" + end + "年" + areaStr + "文创企业数量及增速";
				dataHtml += "<p>在<i>" + start + "</i>年至<i>" + end + "</i>年的<i>" + (end - start)+ "</i>年间，<i>" + areaStr + "</i>文创企业数量从<i>" + dataTxt.startYearNum + "</i>家增长到<i>" + dataTxt.endYearNum + "</i>家，其中<i>" + dataTxt.firstRateOfIncreaseYear + "</i>年增幅最大，增速达<i>" + dataTxt.firstRateOfIncreaseYearIncrease + "%</i>，<i>" + dataTxt.lastRateOfIncreaseYear + "</i>年增速最慢，其增速为<i>" + dataTxt.lastRateOfIncreaseYearIncrease + "%</i>。截止<i>" + dataTxt.lastRateOfIncreaseYear + "</i>年，<i>" + dataTxt.endYearNum + "</i>家文创企业相比<i>" + dataTxt.beforeYear + "</i>年<i>" + dataTxt.beforeYearNum + "</i>家文创企业，这一年期间新增企业<i>" + dataTxt.endYearincreaseNum + "</i>家，增速达到<i>" + dataTxt.endYearRateOfIncreaseYear + "%</i>。</p>";
				$("#txt-year").html(dataHtml);
				$("#tit_year").html(dataTit);
				
				var year = [];
				var number = [];
				var rateOfIncrease = [];
	
				year.splice(0,year.length)
				number.splice(0,number.length)
				rateOfIncrease.splice(0,rateOfIncrease.length)
				$.each(loadData, function (key, val) {
					year.push(val.years);          
					number.push(val.num);
					rateOfIncrease.push(val.rateOfIncrease);
				});
				
				/*var numMax = Math.max.apply(null,number)
				var numMax2 = numMax + ((numMax * 20)/100);
				var first = numMax2.toString().split(".")[0].substring(0,1);
				var zero = numMax2.toString().split(".")[0].substring(1).replace(/[0-9]/g,"0");
				var yMax = first + zero; 
				if(yMax < numMax){
					var yMax = (parseInt(first) + 1) + zero;
				} else {
					var yMax = first + zero; 
				}*/
							
				tdc_year(year,number,rateOfIncrease);
				loadFunObj1.hide();
			}
		}
	});
}

//年度统计情况echart实例
function tdc_year(year,number,rateOfIncrease){
var tdc_year = echarts.init(document.getElementById("tdc_year"));
var option = {
	title: {
		subtext: "",
		right: 50,
		subtextStyle: {
			color: "#666",
			fontSize: 10,
			fontWeight: "normal",
		}
	},
	legend: {
		data: ["企业数量","增速（%）"],
		top: "bottom"
	},
	grid: {
		left: "8%",
		right: "5%"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		data: year
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
		//max: yMax,
		min: 0,
		nameTextStyle: {
			color: "#666",
			fontSize: 10,
		},
		axisLine: {
			show: false	
		},
		axisTick: {
			show: false	
		}
	},{
	    type: "value",	
		name: "增速（%）",
		max: 100,
		min: 0,
		nameTextStyle: {
			color: "#666",
			fontSize: 10,
		},
		axisLine: {
			show: false	
		},
		axisTick: {
			show: false	
		},
		splitLine: {
			show: false
		}
	}],
	color: ['#00a2e0','#0071a8'],
	series: [{
		name: '企业数量',
		type: 'bar',
		data: number,
		barWidth: 30,
		label: {
		  show: false,
		}
	},{
		name: '增速（%）',
		type: "line",
		data: rateOfIncrease,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	}]
};
tdc_year.setOption(option);
}
}

//区域统计情况
function areaStatistics(){
var end = endYear;
var indClass1 = enterpriseClassification;
var indClass2 = industryCode;

//区域统计情况ajax请求
$("#filter_area .yearDesc").change(function(){
    loadFunObj2.show();
	var option = $("#filter_area .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	loadDataArea(end,indClass1,indClass2);
});
$("#filter_area .indClass1").change(function() {
    loadFunObj2.show();
	var option = $("#filter_area .indClass1 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass1 = $(option).attr("name");
	indClass2 = "";
	$.ajax({
		url: "/cccredit/dictionaryDetailController/web_datagrid.form",
		type: "GET",
		data: {
			typeCode: indClass1	
		},
		success: function(data){
			var ind = $.parseJSON(data).rows;
			var indHtml = "<option value='全部' name='' selected>全部</option>";
			for(var i = 0; i<ind.length; i++){
				indHtml += "<option value='" + ind[i].detailName + "' name='" + ind[i].detailCode + "'>" + ind[i].detailName + "</option>"
			}
			$("#filter_area .indClass2").html(indHtml);
		}
	})
	loadDataArea(end,indClass1,indClass2);
});
$("#filter_area .indClass2").change(function() {
    loadFunObj2.show();
	var option = $("#filter_area .indClass2 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass2 = $(option).attr("name");
	loadDataArea(end,indClass1,indClass2);
});

loadDataArea(end,indClass1,indClass2);
function loadDataArea(end,indClass1,indClass2){
	$.ajax({
		url: "/cccredit/web_enterpriseInfoController/web_getEnterpriseNumByRegLocation.form",
		type: "GET",
		data: {
			endYear: end,
			enterpriseClassification: indClass1,
			industryCode: indClass2
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			var dataTxt = $.parseJSON(data).extra.comment;
			var dataTit = "";
			var dataHtml = "";
			dataTit += "" + end + "年度北京市各区全行业企业数量";
			dataHtml += "<p>截止<i>" + end + "</i>年，北京市<i>" + dataTxt.firstRegLocation + "</i>文创<i>全</i>行业<i>存量企业数量</i>已达到<i>" + dataTxt.firstNum + "</i>家，位列第一，按<i>存量企业数量</i>最多排名前5个区分别为：<i>" + dataTxt.firstFiveRegLocation[0] + "、" + dataTxt.firstFiveRegLocation[1] + "、" + dataTxt.firstFiveRegLocation[2] + "、" + dataTxt.firstFiveRegLocation[3] + "、" + dataTxt.firstFiveRegLocation[4] + "</i>。</p>";
			$("#txt-area").html(dataHtml);
			$("#tit_area").html(dataTit);
			
			var area = [];
			var number = [];
			
			area.splice(0,area.length);
			number.splice(0,number.length);
			$.each(loadData, function (key, val) {
				area.push(val.regLocationStr);
				number.push(val.num);
			});
							
			/*var numMax = Math.max.apply(null,number)
			var numMax2 = numMax + ((numMax * 20)/100);
			var first = numMax2.toString().split(".")[0].substring(0,1);
			var zero = numMax2.toString().split(".")[0].substring(1).replace(/[0-9]/g,"0");
			var yMax = first + zero; 
			if(yMax < numMax){
				var yMax = (parseInt(first) + 1) + zero;
			} else {
				var yMax = first + zero; 
			}*/
			
			tdc_area(area,number);
            loadFunObj2.hide();
		}
	});
}

//区域统计情况echart实例
function tdc_area(area,number){
var tdc_area = echarts.init(document.getElementById("tdc_area"));
var option = {
	title: {
		subtext: "",
		right: 50,
		subtextStyle: {
			color: "#666",
			fontSize: 10,
			fontWeight: "normal",
		}
	},
	legend: {
		data: ["企业数量"],
		top: "bottom"
	},
	grid: {
		left: "8%",
		right: "5%"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		axisLabel: {
			interval: 0,
		},
		data: area
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
		//max: yMax,
		min: 0,
		nameTextStyle: {
			color: "#666",
			fontSize: 10,
		},
		axisLine: {
			show: false	
		},
		axisTick: {
			show: false	
		}
	}],
	color: ['#00a2e0'],
	series: [{
		name: '企业数量',
		type: 'bar',
		data: number,
		barWidth: 30,
		label: {
		  show: false,
		}
	}]
};
tdc_area.setOption(option);
}
}

//行业统计情况
function indStatistics(){
var end = endYear;
var area = regLocation;
var areaStr = regLocationStr;

//行业统计情况ajax请求
$("#filter_industry .yearDesc").change(function(){
    loadFunObj3.show();
	var option = $("#filter_industry .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	loadDataInd(end,area,areaStr);
});
$("#filter_industry .areas").change(function(){
    loadFunObj3.show();
	var option = $("#filter_industry .areas option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	area = $(option).attr("name");
	areaStr = $(option).val();
	loadDataInd(end,area,areaStr);
});

loadDataInd(end,area,areaStr);
function loadDataInd(end,area,areaStr){
	$.ajax({
		url: "/cccredit/web_enterpriseInfoController/web_getEnterpriseNumByEnterpriseClassification.form",
		type: "GET",
		data: {
			endYear: end,
			regLocation: area
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			var dataTxt = $.parseJSON(data).extra.comment;
			var dataTit = "";
			var dataHtml = "";
			dataTit += "" + end + "年度" + areaStr + "文创各行业企业数量";
			dataHtml += "<p>截止<i>" + end + "</i>年，<i>" + areaStr + "</i>文创企业共有<i>" + dataTxt.totalNum + "</i>家企业，其中<i>" + dataTxt.firstThreeEnterpriseClassification[0].enterpriseClassificationStr + "</i>行业存量企业数量已到达<i>" + dataTxt.firstThreeEnterpriseClassification[0].num + "</i>家，位列第一，按存量企业数量最多排名前3个行业分别为：<i>" + dataTxt.firstThreeEnterpriseClassification[0].enterpriseClassificationStr + "（" + dataTxt.firstThreeEnterpriseClassification[0].num + "家）、" + dataTxt.firstThreeEnterpriseClassification[1].enterpriseClassificationStr + "（" + dataTxt.firstThreeEnterpriseClassification[1].num + "家）、" + dataTxt.firstThreeEnterpriseClassification[2].enterpriseClassificationStr + "（" + dataTxt.firstThreeEnterpriseClassification[2].num + "家）</i></p>";
			$("#txt-industry").html(dataHtml);
			$("#tit_industry").html(dataTit);
			
			var number = [];
			var indName = [];
			
			number.splice(0,number.length)
			indName.splice(0,indName.length)
			$.each(loadData, function (key, val) {
				number.push(val.num);
				indName.push(val.enterpriseClassificationStr);
			});
							
			/*var numMax = Math.max.apply(null,number)
			var numMax2 = numMax + ((numMax * 20)/100);
			var first = numMax2.toString().split(".")[0].substring(0,1);
			var zero = numMax2.toString().split(".")[0].substring(1).replace(/[0-9]/g,"0");
			var yMax = first + zero; 
			if(yMax < numMax){
				var yMax = (parseInt(first) + 1) + zero;
			} else {
				var yMax = first + zero; 
			}*/
			
			tdc_industry(indName,number);
            loadFunObj3.hide();
		}
	});
}

//行业统计情况echart实例
function tdc_industry(indName,number){
var tdc_industry = echarts.init(document.getElementById("tdc_industry"));
var option = {
	title: {
		subtext: "",
		right: 50,
		subtextStyle: {
			color: "#666",
			fontSize: 10,
			fontWeight: "normal",
		}
	},
	legend: {
		data: ["企业数量"],
		top: "bottom"
	},
	grid: {
		left: "8%",
		right: "5%"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		axisLabel: {
			interval: 0,
			rotate: -15
		},
		data: indName
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
		splitNumber: 6,
		//max: yMax,
		min: 0,
		nameTextStyle: {
			color: "#666",
			fontSize: 10,
		},
		axisLine: {
			show: false	
		},
		axisTick: {
			show: false	
		}
	}],
	color: ['#00a2e0'],
	series: [{
		name: '企业数量',
		type: 'bar',
		data: number,
		barWidth: 30,
		label: {
		  show: false,
		  position: "inside",
		}
	}]
};
tdc_industry.setOption(option);
}
}
