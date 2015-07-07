/**
 * Created by JavieChan on 2015/7/4.
 */

$(document).ready(function(){

    //新闻公告翻页
    $('.nsContentMbo h2:eq(0)').css("display","block");
    $('.nsContentMbo p:eq(0)').css("display","block");

    var changePage = function(num){
        $('.nsContentMbo h2').css("display","none");
        $('.nsContentMbo p').css("display","none");
        $('.nsContentMbo h2').eq(num).css("display","block");
        $('.nsContentMbo p').eq(num).css("display","block");
    };

    $('#next').click(function(){
        var num = $('#num').val();   //目前显示第num篇文章

        num = parseInt(num) + 1;

        if(num>2){
            return false;
        }else if(num==2){
            $('#num').val(num);
            $(this).addClass("nsdisabled");
            $('#prev').removeClass('nsdisabled');
            changePage(num);
        }else{
            $('#num').val(num);
            $('#prev').removeClass('nsdisabled');
            changePage(num);
        }
    });
    $('#prev').click(function(){
        var num = $('#num').val();   //目前显示第num篇文章

        num = parseInt(num) - 1;

        if(num<0){
            return false;
        }else if(num==0){
            $('#num').val(num);
            $(this).addClass("nsdisabled");
            $('#next').removeClass('nsdisabled');
            changePage(num);
        }else{
            $('#num').val(num);
            $('#next').removeClass('nsdisabled');
            changePage(num);
        }
    });

    //一键上网
    $('#yjsw').click(function(){
        var $t = $(this);

        $.ajax({
            type: "POST",
            url: "/account",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(PortalData()),
            dataType: "json",
            success: function (msg) {
                //if($('.errorMsg').length>0){
                //    hideError($('.errorMsg'));
                //}
                //$t.hide();
                //$('.nsadmMbo').show();
                window.location.href = "/nansha.html";
            },
            error: function(){
                showError("一键上网失败，请重新尝试！");
            }
        })
    });

    //退出一键上网
    $('.nsRightMbo a').click(function(){
        $(this).parent().parent().hide();
        $('#yjsw').show();
    });
});

function showError(msg){
    var original = $(document.body);
    var h = '<div class="errorMsg">'+msg+'</div>';
    $('.errorMsg').remove();
    original.append(h);
}

function PortalData(){
    var $user = $('#user').val();
    var $password =  $('#password').val();
    var $openid =  $('#openid').val();
    var $acip =  $('#ac_ip').val();
    var $vlanId =  $('#vlanId').val();
    var $ssid =  $('#ssid').val();
    var $userip =  $('#user_ip').val();
    var $usermac =  $('#user_mac').val();
    var $apmac =  $('#ap_mac').val();
    var $firsturl =  $('#firsturl').val();
    var $urlparam =  $('#urlparam').val();

    var jsonObj = {
        "user": $user,
        "password": $password,
        "openid": $openid,
        "ac_ip": $acip,
        "vlanId": $vlanId,
        "ssid": $ssid,
        "user_ip": $userip,
        "user_mac": $usermac,
        "ap_mac": $apmac,
        "firsturl": $firsturl,
        "urlparam": $urlparam
    };

    return jsonObj;
}