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
var loadFunObj1 = new loadFun(".tongji_data_one",{"left":"50%","top":"50%","margin-left":"-100px"});
var loadFunObj2 = new loadFun(".tongji_data_two",{"left":"50%","top":"50%","margin-left":"-100px"});
var loadFunObj3 = new loadFun(".tongji_data_three",{"left":"50%","top":"50%","margin-left":"-100px"});

var startYear;
var endYear;
var regLocation;
var enterpriseClassification;
var industryCode;

loadFunObj1.show();
loadFunObj2.show();
loadFunObj3.show();
$.when($.ajax({
		url: "/cccredit/web_secondaryIndicators/web_selectRankingYear.form",
		type: "GET",
		data: {},
		success: function(data){
			var years = $.parseJSON(data).obj;
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i].year +  "'>" + years[i].year + "</option>"
			}
			$(".yearDesc").html(yearHtml);
			endYear = years[0].year;
		}
	}),$.ajax({
		url: "/cccredit/web_secondaryIndicators/web_selectRankingYear.form",
		type: "GET",
		data: {
			orderMethod: "asc"	
		},
		success: function(data){
			var years = $.parseJSON(data).obj;
            years.reverse();
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i].year + "'>" + years[i].year + "</option>"
			}
			$(".yearAsc").html(yearHtml);
			startYear = years[0].year;
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
			$(".areas2").html(areaHtml);
			regLocation = "";
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
			$(".indClass11").html(indHtml);
			enterpriseClassification = "";
		}
	})).done(function(res1,res2,res3,res4){
		areaScore();
		indScore();
		yearScore();
	});

/*function getParameter(){
//下拉年份筛选条件请求
	//降序
	$.ajax({
		url: "/cccredit/web_secondaryIndicators/web_selectRankingYear.form",
		type: "GET",
		data: {},
		success: function(data){
			var years = $.parseJSON(data).obj;
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i].year +  "'>" + years[i].year + "</option>"
			}
			$(".yearDesc").html(yearHtml);
			endYear = years[0].year;
		}
	})
	//升序
	$.ajax({
		url: "/cccredit/web_secondaryIndicators/web_selectRankingYear.form",
		type: "GET",
		data: {
			orderMethod: "asc"	
		},
		success: function(data){
			var years = $.parseJSON(data).obj;
            years.reverse();
			var yearHtml = "";
			for(var i = 0; i<years.length; i++){
				yearHtml += "<option value='" + years[i].year + "'>" + years[i].year + "</option>"
			}
			$(".yearAsc").html(yearHtml);
			startYear = years[0].year;
		}
	})

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
			$(".areas2").html(areaHtml);
			regLocation = "";
		}
	})

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
			$(".indClass11").html(indHtml);
			enterpriseClassification = "";
		}
	})
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
				$(".indClass22").html(indHtml);
				industryCode = "";
			}
		})
	}
}*/

function areaScore(){
var score = [];
var number = [];
var number2 = [];
var percentage = [];
var percentage2 = [];
var name = "北京市";
var name2 = "北京市";

var end = endYear;
var area = regLocation;
//区域评分分布情况ajax请求
$("#filter_area .yearDesc").change(function(){
    loadFunObj1.show();
	var option = $("#filter_area .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	var opt_area = $("#filter_area .areas option:selected");
	$(opt_area).attr("selected","selected").siblings().attr("selected",false);
	area = $(opt_area).attr("name");
	var opt_area2 = $("#filter_area .areas2 option:selected");
	$(opt_area2).attr("selected","selected").siblings().attr("selected",false);
	area2 = $(opt_area2).attr("name");
	loadDataArea(end,area);
	loadDataArea2(end,area2);
});
$("#filter_area .areas").change(function(){
    loadFunObj1.show();
	var option = $("#filter_area .areas option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	area = $(option).attr("name");
	name = $(option).val();
	loadDataArea(end,area);
});
$("#filter_area .areas2").change(function(){
    loadFunObj1.show();
	var option = $("#filter_area .areas2 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	area = $(option).attr("name");
	name2 = $(option).val();
	loadDataArea2(end,area);
});

loadDataArea(end,area);
loadDataArea2(end,area);
function loadDataArea(end,area){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: end,
			regLocation: area
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number.splice(0,number.length)
			percentage.splice(0,percentage.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number.push(val.num);
				percentage.push(val.cumulativePercentages);
			});
			
			tdc_area();
			loadFunObj1.hide();
		}
	});
}
function loadDataArea2(end,area){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: end,
			regLocation: area
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number2.splice(0,number2.length)
			percentage2.splice(0,percentage2.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number2.push(val.num);
				percentage2.push(val.cumulativePercentages);
			});
			
			tdc_area();
			loadFunObj1.hide();
		}
	});
}

//区域评分分布情况情况echart实例
function tdc_area(){
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
		data: [name + "-企业数量", name2 + "-企业数量 ", name + "-累计百分比占比", name2 + "-累计百分比占比 "],
		top: "bottom"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		data: score
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
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
		name: "累计百分比占比（%）",
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
	color: ['#0075aa','#00a2e0','#23869a','#69c0b0'],
	series: [{
		name: name + '-企业数量',
		type: 'bar',
		data: number,
		barWidth: 15,
		barGap: 0,
		label: {
		  show: false,
		}
	},{
		name: name2 + '-企业数量 ',
		type: 'bar',
		data: number2,
		barWidth: 15,
		label: {
		  show: false,
		}
	},{
		name: name + '-累计百分比占比',
		type: "line",
		data: percentage,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	},{
		name: name2 + '-累计百分比占比 ',
		type: "line",
		data: percentage2,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	}]
};
tdc_area.setOption(option);
}
}

function indScore(){
var score = [];
var number = [];
var number2 = [];
var percentage = [];
var percentage2 = [];
var name = "全部";
var name2 = "全部";

var end = endYear;
var indClass1 = enterpriseClassification;
var indClass2 = industryCode;
//行业评分分布情况ajax请求
$("#filter_industry .yearDesc").change(function(){
	loadFunObj2.show();
	var option = $("#filter_industry .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	var opt_ind1 = $("#filter_industry .indClass1 option:selected");
	$(opt_ind1).attr("selected","selected").siblings().attr("selected",false);
	indClass1 = $(opt_ind1).attr("name");
	var opt_ind2 = $("#filter_industry .indClass2 option:selected");
	$(opt_ind2).attr("selected","selected").siblings().attr("selected",false);
	indClass2 = $(opt_ind2).attr("name");
	var opt_ind11 = $("#filter_industry .indClass11 option:selected");
	$(opt_ind11).attr("selected","selected").siblings().attr("selected",false);
	indClass11 = $(opt_ind11).attr("name");
	var opt_ind22 = $("#filter_industry .indClass22 option:selected");
	$(opt_ind22).attr("selected","selected").siblings().attr("selected",false);
	indClass22 = $(opt_ind22).attr("name");
	loadDataInd(end,indClass1,indClass2);
	loadDataInd2(end,indClass11,indClass22);
});
$("#filter_industry .indClass1").change(function() {
	loadFunObj2.show();
	var option = $("#filter_industry .indClass1 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass1 = $(option).attr("name");
	name = $(option).val();
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
			$("#filter_industry .indClass2").html(indHtml);
		}
	})
	loadDataInd(end,indClass1,indClass2);
});
$("#filter_industry .indClass2").change(function() {
	loadFunObj2.show();
	var option = $("#filter_industry .indClass2 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass2 = $(option).attr("name");
	loadDataInd(end,indClass1,indClass2);
});
$("#filter_industry .indClass11").change(function() {
	loadFunObj2.show();
	var option = $("#filter_industry .indClass11 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass1 = $(option).attr("name");
	name2 = $(option).val();
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
			$("#filter_industry .indClass22").html(indHtml);
		}
	})
	loadDataInd2(end,indClass1,indClass2);
});
$("#filter_industry .indClass22").change(function() {
	loadFunObj2.show();
	var option = $("#filter_industry .indClass22 option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	indClass2 = $(option).attr("name");
	loadDataInd2(end,indClass1,indClass2);
});

loadDataInd(end,indClass1,indClass2);
loadDataInd2(end,indClass1,indClass2);
function loadDataInd(end,indClass1,indClass2){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: end,
			enterpriseClassification: indClass1,
			industryCode: indClass2
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number.splice(0,number.length)
			percentage.splice(0,percentage.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number.push(val.num);
				percentage.push(val.cumulativePercentages);
			});
			tdc_industry();
			loadFunObj2.hide();
		}
	});
}
function loadDataInd2(end,indClass1,indClass2){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: end,
			enterpriseClassification: indClass1,
			industryCode: indClass2
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number2.splice(0,number2.length)
			percentage2.splice(0,percentage2.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number2.push(val.num);
				percentage2.push(val.cumulativePercentages);
			});
			tdc_industry();
			loadFunObj2.hide();
		}
	});
}
//行业评分分布情况情况echart实例
function tdc_industry(){
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
		data: [name + "-企业数量", name2 + "-企业数量 ", name + "-累计百分比占比", name2 + "-累计百分比占比 "],
		top: "bottom"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		data: score
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
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
		name: "累计百分比占比（%）",
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
	color: ['#0075aa','#00a2e0','#23869a','#69c0b0'],
	series: [{
		name: name + '-企业数量',
		type: 'bar',
		data: number,
		barWidth: 15,
		barGap: 0,
		label: {
		  show: false,
		}
	},{
		name: name2 + '-企业数量 ',
		type: 'bar',
		data: number2,
		barWidth: 15,
		label: {
		  show: false,
		}
	},{
		name: name + '-累计百分比占比',
		type: "line",
		data: percentage,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	},{
		name: name2 + '-累计百分比占比 ',
		type: "line",
		data: percentage2,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	}]
};
tdc_industry.setOption(option);
}
}

function yearScore(){
var score = [];
var number = [];
var number2 = [];
var percentage = [];
var percentage2 = [];

var start = startYear;
var end = endYear;
var area = regLocation;
//年度评分分布情况ajax请求
$("#filter_year .yearAsc").change(function(){
	loadFunObj3.show();
	var option = $("#filter_year .yearAsc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	start = $(option).val();
	loadDataYear(start,area);
});
$("#filter_year .yearDesc").change(function(){
	loadFunObj3.show();
	var option = $("#filter_year .yearDesc option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	end = $(option).val();
	loadDataYear2(end,area);
});
$("#filter_year .areas").change(function(){
	loadFunObj3.show();
	var option = $("#filter_year .areas option:selected");
	$(option).attr("selected","selected").siblings().attr("selected",false);
	area = $(option).attr("name");
	var opt_year = $("#filter_year .yearAsc option:selected");
	$(opt_year).attr("selected","selected").siblings().attr("selected",false);
  	start = $(opt_year).val();
	var opt_year2 = $("#filter_year .yearDesc option:selected");
	$(opt_year2).attr("selected","selected").siblings().attr("selected",false);
	end = $(opt_year2).val();
	loadDataYear(start,area);
	loadDataYear2(end,area);
});

loadDataYear(start,area);
loadDataYear2(end,area);
function loadDataYear(start,area){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: start,
			regLocation: area
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number.splice(0,number.length)
			percentage.splice(0,percentage.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number.push(val.num);
				percentage.push(val.cumulativePercentages);
			});
			tdc_year();
			loadFunObj3.hide();
		}
	});
}
function loadDataYear2(end,area){
	$.ajax({
		url: "/cccredit/web_creditScoreController/web_getCreditScoreByYear.form",
		type: "GET",
		data: {
			year: end,
			regLocation: area
		},
		success: function(data){
			var loadData = $.parseJSON(data).obj;
			score.splice(0,score.length)
			number2.splice(0,number2.length)
			percentage2.splice(0,percentage2.length)
			$.each(loadData, function (key, val) {
				score.push(val.scoreSection);          
				number2.push(val.num);
				percentage2.push(val.cumulativePercentages);
			});
			tdc_year();
			loadFunObj3.hide();
		}
	});
}
//年度评分分布情况情况echart实例
function tdc_year(){
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
		data: [start + "-企业数量", end + "-企业数量 ", start + "-累计百分比占比", end + "-累计百分比占比 "],
		top: "bottom"
	},
	tooltip:{
		show: true
	},
	xAxis: {
		data: score
	},
	yAxis: [{
	    type: "value",	
		name: "企业数量",
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
		name: "累计百分比占比（%）",
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
	color: ['#0075aa','#00a2e0','#23869a','#69c0b0'],
	series: [{
		name: start + '-企业数量',
		type: 'bar',
		data: number,
		barWidth: 15,
		barGap: 0,
		label: {
		  show: false,
		}
	},{
		name: end + '-企业数量 ',
		type: 'bar',
		data: number2,
		barWidth: 15,
		barGap: 0,
		label: {
		  show: false,
		}
	},{
		name: start + '-累计百分比占比',
		type: "line",
		data: percentage,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	},{
		name: end + '-累计百分比占比 ',
		type: "line",
		data: percentage2,
		yAxisIndex: 1,
		label: {
		  show: false,
		}
	}]
};
tdc_year.setOption(option);
}
}


