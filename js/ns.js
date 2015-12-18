/**
 * Created by JavieChan on 2015/7/4.
 * Updated by JavieChan on 2015/12/16.
 */

$(function(){

    /*新版南沙区无线城市begin*/
    var inc,int;
    $('#ns_free').click(function(){
        var firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
        $('#p2').text("正在验证,请耐心等待...").css("color", "#333");
        $('.ns_dialog button').text("取消验证").css("background", "#2d90ff");

        $('.ns_dialog').fadeIn();
        inc = setInterval(increFunc, 1000);

        $(this).attr('disabled', 'disabled');

        $.ajax({
            type: "POST",
            url: "/account",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(PortalData()),
            dataType: "json",
            success: function (data) {
                clearInterval(inc);
                $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
                window.location.href = urlChange(firsturl, urlparam);
            },
            statusCode: {
                435: function() {
                    clearInterval(inc);
                    $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
                    window.location.href = urlChange(firsturl, urlparam);
                },
                436: function() {
                    int = setTimeout(function(url, param){
                        return function(){
                            timeOutFunc(url, param);
                        }
                    }(firsturl, urlparam), 3000);
                }
            },
            error: function(error){
                console.log(error.status);
                clearInterval(inc);
                $('#p2').text('验证失败').css("color", "#f00");
                $('.ns_dialog button').text("返回").css("background", "#ffa21c");
                clearTimeout(int);
            }
        });
    });
    //取消验证
    $('.ns_dialog button').click(function(){
        clearInterval(inc);
        $('.ns_dialog').fadeOut();
        $('#p1 span').text(0);
        clearTimeout(int);
        $('#ns_free').removeAttr('disabled');
    });
    /*新版南沙区无线城市end*/

    $('.nslgn .nsLong, .nslgn .nsShort').focus(function(){
        $(this).css({'background': '#fff', 'border': '1px solid #1bbc9b'});
    });
    $('.nslgn .nsLong, .nslgn .nsShort').blur(function(){
        if($(this).val()==''){
            $(this).css({'background': '#e9e9e9', 'border': '1px solid #e9e9e9'});
        }
    });

    //新闻公告翻页
    $('.nsContent h2:eq(0)').css("display","block");
    $('.nsContent p.nsTextM:eq(0)').css("display","block");

    var changePage = function(num){
        $('.nsContent h2').css("display","none");
        $('.nsContent p.nsTextM').css("display","none");
        $('.nsContent h2').eq(num).css("display","block");
        $('.nsContent p.nsTextM').eq(num).css("display","block");
    };

    $('#next').click(function(){
        var num = $('#num').val();   //目前显示第num篇文章

        num = parseInt(num) + 1;

        if(num>2){
            return false;
        }else if(num==2){
            $('#num').val(num);
            $(this).attr("class", "ipubtnNo");
            $('#prev').attr("class", "ipubtn");
            changePage(num);
        }else{
            $('#num').val(num);
            $('#prev').attr("class", "ipubtn");
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
            $(this).attr("class", "ipubtnNo");
            $('#next').attr("class", "ipubtn");
            changePage(num);
        }else{
            $('#num').val(num);
            $('#next').attr("class", "ipubtn");
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
                if(msg.Code == 200){
                    $t.hide();
                    $('.nsLogo ul').show();
                }else{
                    alert("一键上网失败，请重新尝试！");
                }
            },
            error: function(){
                alert("一键上网失败，请重新尝试！");
            }
        })
    });

    //退出一键上网
    $('.nsLogo li a').click(function(){
        $(this).parent().parent().hide();
        $('#yjsw').show();
    });

    //点击登录
    $('#nsSub').click(function(){
        var tel = $('.nslgn .nsLong').val();
        var yzm = $('.nslgn .nsShort').val();

        if(!/^1\d{10}$/.test(tel)){
            $('.errMsg').html('*请输入有效的手机号！');return;
        }else if(yzm==''){
            $('.errMsg').html('*验证码错误！');return;
        }else{
            $('.errMsg').html(' ');
            $('.nslgn').hide();
            $('.nsadm').show();
        }
    });

    $('.nsadm .logout').click(function(){
        $('.nsadm').hide();
        $('.nslgn').show();
    });


    //验证码重发
    $(document).on('click', '.yzm', function(){
        $(this).html('<span>61</span>秒后重发').addClass('on').removeClass('yzm');
        delayYZM();
    });
});

function increFunc(){
    var d = $('#p1 span').text();
    d++;
    $('#p1 span').text(d);
}

function delayYZM(){
    var delay = $('.yzmcss span').text();
    var t = setTimeout('delayYZM()', 1000);
    if(delay>1){
        delay--;
        $('.yzmcss span').text(delay);
    }else{
        clearTimeout(t);
        $('.yzmcss').html('发送验证码').addClass('yzm').removeClass('on');
    }
}

function timeOutFunc(url, param){
    console.log(urlChange(url, param));

    $.ajax({
        type: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(PortalData()),
        dataType: "json",
        success: function (data) {
            clearInterval(inc);
            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
            window.location.href = urlChange(url, param);
        },
        statusCode: {
            435: function() {
                clearInterval(inc);
                $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
                window.location.href = urlChange(url, param);
            },
            436: function() {
                int = setTimeout(function(url, param){
                    return function(){
                        timeOutFunc2(url, param);
                    }
                }(url, param), 3000);
            }
        },
        error: function(error){
            console.log(error.status);
            clearInterval(inc);
            $('#p2').text('验证失败').css("color", "#f00");
            $('.ns_dialog button').text("返回").css("background", "#ffa21c");
            clearTimeout(int);
        }
    });
}

function timeOutFunc2(url, param){
    console.log(urlChange(url, param));

    $.ajax({
        type: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(PortalData()),
        dataType: "json",
        success: function (data) {
            clearInterval(inc);
            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
            window.location.href = urlChange(url, param);
        },
        statusCode: {
            435: function() {
                clearInterval(inc);
                $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
                window.location.href = urlChange(url, param);
            }
        },
        error: function(error){
            console.log(error.status);
            clearInterval(inc);
            $('#p2').text('验证失败').css("color", "#f00");
            $('.ns_dialog button').text("返回").css("background", "#ffa21c");
            clearTimeout(int);
        }
    });
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