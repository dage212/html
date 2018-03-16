/*本页面js*/

//tab切换
$(".tab_box").click(function(){
    var index = $(this).index(".tab_box")
    $(this).find("img").css({"display":"inline-block"}).end().siblings().find("img").css({"display":"none"})
    $(".form_container").eq(index).css({"display":"block"}).siblings().css({"display":"none"})
})

var useID;
var userInfo = JSON.parse(sessionStorage.getItem("platformInfo"));
$("#confirmUser").click(function(){
    if(!verifyCheck._click()) return;
    setUser(useID);
});
$("#confirmPwd").click(function(){
    if(!verifyCheck._click()) return;
    setPwd(useID);
});
$.ajax({
    type: "POST",
    url: "/cccredit/web_loginRegisterController/web_getUserByLoginName.form",
    data: {
        loginName: userInfo.loginName
    },
    success: function(result){
        var userData = $.parseJSON(result).obj;
        $("#userName").val(userData.userName).attr("placeholder",userData.userName);
        $("#phone").val(userData.phone).attr("placeholder",userData.phone);
        $("#email").val(userData.mail).attr("placeholder",userData.mail);
        useID = userData.id;
    }
});
function setUser(id){
    $.ajax({
        type: "POST",
        url: "/cccredit/web_loginRegisterController/web_updateUserById.form",
        data: {
            id: id,
            userName: $("#userName").val(),
            phone: $("#phone").val(),
            mail: $("#email").val(),
        },
        success: function(result){
            var globalRespType = $.parseJSON(result);
            if (globalRespType.success == true) {
                layer.alert(globalRespType.msg,{
                    time: 0,
                    icon: 6,
                    yes: function(index){
                        layer.close(index);
                    }
                });
            } else {
                $(".valid").addClass("error").html(globalRespType.msg);
            }
        },
        error: function(result){
            $(".valid").addClass("error").html("操作无效！请联系管理员。");
        }
    });
}
function setPwd(id){
    $.ajax({
        type: "POST",
        url: "/cccredit/web_loginRegisterController/web_modifyPassword.form",
        data: {
			loginName: userInfo.loginName, 
			password: $("#initialPaw").val(),
			newPassword: $("#password").val(),
        },
        success: function(result){
            var globalRespType = $.parseJSON(result);
            if (globalRespType.success == true) {
                layer.alert(globalRespType.msg,{
                    time: 0,
                    icon: 6,
                    yes: function(index){
                        layer.close(index);
                    }
                });
            } else {
				layer.alert(globalRespType.msg,{
					time: 0, 
					icon: 2, 
					yes: function(index){
						layer.close(index);
					}
				});
            }
        },
        error: function(result){
            $(".valid").addClass("error").html("操作无效！请联系管理员。");
        }
    });
}
