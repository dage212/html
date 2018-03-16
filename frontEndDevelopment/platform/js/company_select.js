$(function() {
    //加载中实例化
    var loadFunObj = new loadFun(".rank_data",{"left":"50%","top":"50%","margin-left":"-100px","margin-top":"-40px"});
    loadFunObj.show();
	//tab切换
    $(".tab_box").click(function() {
		var index = $(this).index(".tab_box")
        $(this).find("img").css({"display": "inline-block"}).end().siblings().find("img").css({"display": "none"});
		$(".tab-filter").eq(index).css({"display":"block"}).siblings().css({"display":"none"});
    });
	
	//过滤方法
    var filter = function (pele, ele, table) {
        /*
            @pele=#xxx
            @ele=.xxx
            @table = #xxx
        */
		var opt;
		var ran;
        var filterQuery = {title: "", enterpriseClassification: "", year: "", regLocation: "", rank: ""};
        //删除过滤条件
        $(pele + " .filter_" + ele + " .filter_one_all").click(function () {
			opt = $(pele + " .years option:selected").val();
			ran = $(pele).attr("id");
            $(this).css({color: "#fff", "background": "#11A0EC"}).next().find(".list").removeClass("active");
            $(pele + " .filter_four .filter_content").children().remove(".filter_cur_" + ele);
			$(pele + " .filter_" + ele + " .range_start").val("");
			$(pele + " .filter_" + ele + " .range_end").val("");
            filterQuery = {
				title: ran,
				year: opt,
                enterpriseClassification: $(pele + " .filter_cur_one").attr("data-query"),
                regLocation: $(pele + " .filter_cur_two").attr("data-query"),
                rank: $(pele + " .filter_cur_three").attr("data-query"),
            }
            var start = $(pele + " .range_start").val();
            var end = $(pele + " .range_end").val();
			loadD(start, end);
        })
        $(pele + " .filter_content").on("click", ".filter_cur_" + ele, function () {
			opt = $(pele + " .years option:selected").val();
			ran = $(pele).attr("id");
            $(this).remove();
            $(pele + " .filter_" + ele + " .filter_one_all").css({
                color: "#fff",
                "background": "#11A0EC"
            }).next().find(".list").removeClass("active");
            $(pele + " .filter_four .filter_content").children().remove(".filter_cur_" + ele);
            filterQuery = {
				title: ran,
				year: opt,
                enterpriseClassification: $(pele + " .filter_cur_one").attr("data-query"),
                regLocation: $(pele + " .filter_cur_two").attr("data-query"),
                rank: $(pele + " .filter_cur_three").attr("data-query"),
            }
            var start = $(pele + " .range_start").val();
            var end = $(pele + " .range_end").val();
			loadD(start, end);
        })

        //添加过滤条件
		$(pele + " .years").change(function() {
			opt = $(pele + " .years option:selected").val();
			ran = $(pele).attr("id");
			$(opt).attr("selected","selected").siblings().attr("selected",false);
			$(pele + " .rank_head span").html(opt + "年");
			filterQuery = {
				title: ran,
				year: opt,
                enterpriseClassification: $(pele + " .filter_cur_one").attr("data-query"),
                regLocation: $(pele + " .filter_cur_two").attr("data-query"),
                rank: $(pele + " .filter_cur_three").attr("data-query"),
            }
            var start = $(pele + " .range_start").val();
            var end = $(pele + " .range_end").val();
			loadD(start, end);
		});
		$(pele + " .range_start").on("input propertychange",function(){
			var num1 = $(this).val();
			$(pele + " .range_end").val(parseInt(num1) + 49);
			if(num1 == ""){
                $(pele + " .range_end").val("");
			}
		});
        $(pele + " .filter_range").click(function () {
			opt = $(pele + " .years option:selected").val();
			ran = $(pele).attr("id");
			var start = $(pele + " .range_start").val();
			var end = $(pele + " .range_end").val();
            filterQuery = {
				title: ran,
				year: opt,
                enterpriseClassification: $(pele + " .filter_cur_one").attr("data-query"),
                regLocation: $(pele + " .filter_cur_two").attr("data-query"),
                rank: $(pele + " .filter_cur_three").attr("data-query"),
            }
			if(end != ""){
				$(this).parents(".filter_lists").find(".list").removeClass("active");
				$(pele + " .filter_four .filter_content").children().remove(".filter_cur_three");
				loadData(filterQuery.title, filterQuery.enterpriseClassification, filterQuery.year, filterQuery.regLocation, start-1, end, table);
			}
        })
        $(pele + " .filter_" + ele + " .list").click(function () {
			opt = $(pele + " .years option:selected").val();
			ran = $(pele).attr("id");
            $(this).addClass("active").siblings().removeClass("active").parent().prev().css({
                color: "#999999",
                "background": "#fff"
            })

            if ($(pele + " .filter_four .filter_cur_" + ele).length > 0) {

                $(pele + " .filter_cur_" + ele).html($(this).text() + '<span class="glyphicon glyphicon-remove quit"></span>').attr("data-query", $(this).data("query"))
            } else {
                if (ele == "one") {
                    var html = '<span class="filter_one_all filter_cur filter_cur_one" data-query="' + $(this).data('query') + '">' + $(this).text() + '<span class="glyphicon glyphicon-remove quit"></span></span>';

                } else if (ele == "two") {
                    var html = '<span class="filter_one_all filter_cur filter_cur_two" data-query="' + $(this).data('query') + '">' + $(this).text() + '<span class="glyphicon glyphicon-remove quit"></span></span>';

                } else if (ele == "three") {
                    var html = '<span class="filter_one_all filter_cur filter_cur_three" data-query="' + $(this).data('query') + '">' + $(this).text() + '<span class="glyphicon glyphicon-remove quit"></span></span>';

                }
                $(pele + " .filter_four .filter_content").append(html);
            }
            $(pele + " .filter_" + ele + " .range_start").val("");
            $(pele + " .filter_" + ele + " .range_end").val("");
            filterQuery = {
				title: ran,
				year: opt,
                enterpriseClassification: $(pele + " .filter_cur_one").attr("data-query"),
                regLocation: $(pele + " .filter_cur_two").attr("data-query"),
                rank: $(pele + " .filter_cur_three").attr("data-query"),
            }
            var start = $(pele + " .range_start").val();
            var end = $(pele + " .range_end").val();
			loadD(start, end);
        })
		
		function loadD(start,end){
			if(filterQuery.rank != undefined){
				var ranking = filterQuery.rank.split(":");
				loadData(filterQuery.title,filterQuery.enterpriseClassification,filterQuery.year,filterQuery.regLocation,ranking[0],ranking[1],table);
			} else if(filterQuery.rank == undefined && start == ""){
				loadData(filterQuery.title,filterQuery.enterpriseClassification,filterQuery.year,filterQuery.regLocation,0,50,table);
			} else if(filterQuery.rank == undefined && start != ""){
                loadData(filterQuery.title,filterQuery.enterpriseClassification,filterQuery.year,filterQuery.regLocation,start-1,end-1,table);
            }
		}
		
    }

    //行业筛选
    filter("#synthesize","one","#synthesize .rank_data");
    filter("#operationalEfficiency","one","#operationalEfficiency .rank_data");
    filter("#developmentStatus","one","#developmentStatus .rank_data");
    filter("#profitability","one","#profitability .rank_data");
    filter("#debtLevelsAndSolvency","one","#debtLevelsAndSolvency .rank_data");
    //地区筛选
    filter("#synthesize","two","#synthesize .rank_data");
    filter("#operationalEfficiency","two","#operationalEfficiency .rank_data");
    filter("#developmentStatus","two","#developmentStatus .rank_data");
    filter("#profitability","two","#profitability .rank_data");
    filter("#debtLevelsAndSolvency","two","#debtLevelsAndSolvency .rank_data");
    //排名筛选
    filter("#synthesize","three","#synthesize .rank_data");
    filter("#operationalEfficiency","three","#operationalEfficiency .rank_data");
    filter("#developmentStatus","three","#developmentStatus .rank_data");
    filter("#profitability","three","#profitability .rank_data");
    filter("#debtLevelsAndSolvency","three","#debtLevelsAndSolvency .rank_data");
	
    //ajax请求
		function loadData(ran, type, year, area, start, end, box){
			$.ajax({
				url: "/cccredit/web_secondaryIndicators/web_selectRanking.form",
				type: "GET",
				data: {
					byRanking: ran,
					enterpriseClassification: type,
					year: year,
					regLocation: area,
					startRow: start,
					endRow: end
				},
				success: function(data){
					var listData = $.parseJSON(data);
					var listHtml_left = "";
					var listHtml_right = "";
					if(listData.length <= 25){
						for(var i = 0; i<listData.length; i++){
							var listText_left = listData[i];
							var score = Math.round(listText_left.score);
							listHtml_left += "<div class='rank_data_left'>" +
											 "<div class='number'><span>" + listText_left.ranks + "</span></div>" +
											 "<span class='name' title='" + listText_left.name + "'><a class='' href='./info_search_basic.html?name=" + listText_left.name + "'>" + listText_left.name + "</a></span>" +
											 "<span class='marks'>" + score + "</span>" +
											 "<div class='percentage'>" +
											 "<div class='progress-box'>" +
											 "<div class='progress-bg' style='width: " + score + "%;'></div>" +
											 "</div>" +
											 "</div>" +
											 "</div>";
						}
					} else {
						for(var i = 0; i<25; i++){
							var listText_left = listData[i];
							var score = Math.round(listText_left.score);
							listHtml_left += "<div class='rank_data_left'>" +
											 "<div class='number'><span>" + listText_left.ranks + "</span></div>" +
											 "<span class='name' title='" + listText_left.name + "'><a class='' href='./info_search_basic.html?name=" + listText_left.name + "'>" + listText_left.name + "</a></span>" +
											 "<span class='marks'>" + score + "</span>" +
											 "<div class='percentage'>" +
											 "<div class='progress-box'>" +
											 "<div class='progress-bg' style='width: " + score + "%;'></div>" +
											 "</div>" +
											 "</div>" +
											 "</div>";
						}
					}
	
					for(var i = 25; i<listData.length; i++){
						var listText_right = listData[i];
						var score = Math.round(listText_left.score);
						listHtml_right += "<div class='rank_data_right'>" +
										  "<div class='number'><span>" + listText_right.ranks + "</span></div>" +
										  "<span class='name' title='" + listText_right.name + "'><a class='' href='./info_search_basic.html?name=" + listText_right.name + "'>" + listText_right.name + "</a></span>" +
										  "<span class='marks'>" + score + "</span>" +
										  "<div class='percentage'>" +
										  "<div class='progress-box'>" +
										  "<div class='progress-bg' style='width: " + score + "%;'></div>" +
										  "</div>" +
										  "</div>" +
										  "</div>";
					}
					$(box + " .rank_left").html(listHtml_left);
					$(box + " .rank_right").html(listHtml_right);

					if(data == "[]"){
                        $(box + " .data-no").text("没有找到匹配的记录").show();
					} else {
                        $(box + " .data-no").text("").hide();
					}

                    loadFunObj.hide();
				}
			});
		}
		
		function getYears(box){
			$.ajax({
				url: "/cccredit/web_secondaryIndicators/web_selectRankingYear.form",
				type: "GET",
				data: {},
				success: function(data){
					var years = $.parseJSON(data).obj;
					var yearHtml = "";
					for(var i = 0; i<years.length; i++){
						yearHtml += "<option value='" + years[i].year + "'>" + years[i].year + "</option>";
					}
					$(".years").html(yearHtml);
					var opt = $(".years option:selected").val();
					$(".rank_head span").html(opt + "年");
					loadData("synthesize","",opt,"",0,50,"#synthesize");
					loadData("operationalEfficiency","",opt,"",0,50,"#operationalEfficiency");
					loadData("developmentStatus","",opt,"",0,50,"#developmentStatus");
					loadData("profitability","",opt,"",0,50,"#profitability");
					loadData("debtLevelsAndSolvency","",opt,"",0,50,"#debtLevelsAndSolvency");
				}
			});
		}
		getYears();
});
