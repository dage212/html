//创建地图
var map = new BMap.Map("map");
map.centerAndZoom(new BMap.Point(116.4136103013, 39.9110666857), 11);  // 设置中心点
map.centerAndZoom( "北京");       //指定中心城市
map.setCurrentCity("北京");
map.addControl(new BMap.MapTypeControl());  //设置可拖拽
map.enableScrollWheelZoom(true);  //添加滚轮缩放



//加载中实例化
var loadFunObj = new loadFun(".demo",{"left":"50%","top":"50%","margin-left":"-100px"})









var leftHeight = $(".map_content").height()-180;
var leftNum = Math.ceil(leftHeight/110);
// var leftNum = 10;
//请求公司方法
var mapAjax = function(obj,scroll){
    loadFunObj.show()
    var option = {
        rows:obj.rows||5,
        page:obj.page||1,
        enterpriseClassification:obj.enterFic,
        regLocation:obj.regLocation,
        enterpriseAddress:obj.name,
        scores:obj.score
    }
    if(option.enterpriseClassification == ""){
        option.enterpriseClassification = undefined;
    }
    if(option.regLocation == ""){
        option.regLocation = undefined;
    }
    if(option.name == ""){
        option.name = undefined;
    }
    if(option.scores == ""){
        option.scores = undefined;
    }

    $.get("/cccredit/web_enterpriseInfoController/web_getEnterpriseCreditMap.form",option,function(res){
        loadFunObj.hide()
        var points = [];
        $(".company_total span").text(res.total+"家")
        $.each(res.rows,function(index,val){
            points.push({latitude:val.latitude,longitude:val.longitude,name:val.name,scores:val.score})
        })
        addMarker(points); //添加标注
        //数组转字符串
        template.defaults.imports.format = function(val,arr) {
            if(arr == 'floor'){
                return Math.floor(val)
            }

        }
        var tpl = template("scrollbar-inner_tpl",res);
        if(scroll){
            $(".scroll-content").append(tpl)
        }else{

            $(".scroll-content").html(tpl)
        }


    },"json")
}
mapAjax({rows:leftNum*2,page:1})

//搜索框
$(".search_input").keydown(function(e){
    if(e.which == 13){
        var enterFic = $("#industry").val()
        var regLocation = $("#area").val()
        var area = $(".search_input").val()
        var score = $("#score").val()
        clearPointer()
        mapAjax({rows:leftNum*2,page:1,enterFic:enterFic,regLocation:regLocation,name:area,score:score})
    }
})
$(".search").click(function(){
    var enterFic = $("#industry").val()
    var regLocation = $("#area").val()
    var area = $(".search_input").val()
    var score = $("#score").val()
    clearPointer()
    mapAjax({rows:leftNum*2,page:1,enterFic:enterFic,regLocation:regLocation,name:area,score:score})
})
//企业类型筛选
$("#industry").change(function(){
    var enterFic = $("#industry").val()
    var regLocation = $("#area").val()
    var area = $(".search_input").val()
    var score = $("#score").val()
    clearPointer()
    mapAjax({rows:leftNum*2,page:1,enterFic:enterFic,regLocation:regLocation,score:score,name:area})
})
//企业地区筛选
$("#area").change(function(){
    var enterFic = $("#industry").val()
    var regLocation = $("#area").val()
    var area = $(".search_input").val()
    var score = $("#score").val()
    clearPointer()
    mapAjax({rows:leftNum*2,page:1,enterFic:enterFic,regLocation:regLocation,score:score,name:area})
})

//信用分筛选
$("#score").change(function(){

    var enterFic = $("#industry").val()
    var regLocation = $("#area").val()
    var area = $(".search_input").val()
    var score = $("#score").val()
    clearPointer()
    mapAjax({rows:leftNum*2,page:1,enterFic:enterFic,regLocation:regLocation,score:score,name:area})
})
var pageInit = 1;

$(".scroll-content").scroll(function(){
        if($(this).scrollTop()> pageInit*545){
            pageInit +=1
            var enterFic = $("#industry").val()
            var regLocation = $("#area").val()
            var area = $(".search_input").val()
            var score = $("#score").val()
            // $img = $("<div class='gif_load_box' >拼命加载中...</div>").appendTo(".scroll-scrolly_visible")
            // $img.css({"width":"200px","height":"60px","bottom":"0px","left":"20px","backgroundColor":"rgba(0,0,0,0.5)","color":"white","textAlign":"center","line-height":"60px","border-radius":"4px"}).parent().attr("class").css({"position":"relative"})

            mapAjax({rows:leftNum,page:pageInit+1,enterFic:enterFic,regLocation:regLocation,score:score,name:area},"scroll")
        }
    })
// $.get("/cccredit/web_enterpriseInfoController/web_getEnterpriseCreditMap.form",{rows:10,page:1},function(res){
//     var points = [];
//     $.each(res.rows,function(index,val){
//         points.push({latitude:val.latitude,longitude:val.longitude})
//     })
//     addMarker(points); //添加标注
//     var tpl = template("scrollbar-inner_tpl",res);
//     $(".scrollbar-inner").append(tpl)
// },"json")

//创建标注点并添加到地图中
function addMarker(points) {
    //循环建立标注点
    for(var i=0, pointsLen = points.length; i<pointsLen; i++) {
        var point = new BMap.Point(points[i].longitude, points[i].latitude); //将标注点转化成地图上的点
        var marker = new BMap.Marker(point); //将点转化成标注点
        map.addOverlay(marker);  //将标注点添加到地图上
        //添加监听事件
        (function() {
            var thePoint = points[i];
            marker.addEventListener("click",
                //显示信息的方法
                function() {
                    showInfo(this,thePoint);
                });
        })();
    }
}
//清除标注
function clearPointer(){
    map.clearOverlays();//清除图层覆盖物
}

function showInfo(thisMarker,point) {
    //获取点的信息
    var sContent =
        '<ul style="margin:0 0 5px 0;padding:0.2em 0">'
        +'<li style="line-height: 26px;font-size: 15px;">'
        +'<span style="display: inline-block;">企业名称：</span>' + point.name + '</li>'
        +'<li style="line-height: 26px;font-size: 15px;">'
        +'<span style="display: inline-block;">信用分：</span>' + Math.floor(point.scores) + '</li>'
        +'</ul>';
    var infoWindow = new BMap.InfoWindow(sContent); //创建信息窗口对象
    thisMarker.openInfoWindow(infoWindow); //图片加载完后重绘infoWindow
}
