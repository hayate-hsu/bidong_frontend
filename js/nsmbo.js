/**
 * Created by JavieChan on 2015/7/4.
 * Updatad by JavieChan on 2015/12/10.
 */

$(function(){

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

    //新版
    $('.ns_admin_btn').click(function(){
        $('.ns_login_wrapper').addClass('stotop');
        $('#closed').addClass('close_rotate');
        $('body').css("overflow-y", "hidden");
    });
    $('#closed').click(function(){
        $('.ns_login_wrapper').removeClass('stotop');
        $(this).removeClass('close_rotate');
        $('body').css("overflow-y", "auto");
    });

    //新版portal认证
    var int, inc;
    $('.ns_header button').click(function(){
        var firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();

        $('.anthor').fadeIn();
        $('body').css("overflow-y", "hidden");
        $('#p2').text("正在验证,请耐心等待...").css("color", "#333");
        $('.anthor button').text("取消验证").css("background", "#6fccf7");

        inc = setInterval(increFunc, 1000);

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
                $('.anthor button').text("返回").css("background", "#ffa21c");
                clearTimeout(int);
            }
        });
    });
    //取消验证
    $('.anthor button').click(function(){
        clearInterval(inc);
        $('.anthor').fadeOut();
        $('#p1 span').text(0);
        $('body').css("overflow-y", "auto");
        clearTimeout(int);
    });
});

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
            $('.anthor button').text("返回").css("background", "#ffa21c");
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
            $('.anthor button').text("返回").css("background", "#ffa21c");
            clearTimeout(int);
        }
    });
}

function increFunc(){
    var d = $('#p1 span').text();
    d++;
    $('#p1 span').text(d);
}

function delayAnthor(){
    var d = $('#p3 span').text();
    var t = setTimeout(delayAnthor, 1000);
    if(d<1){
        d--;
        $('#p3 span').text(d);
    }else{
        clearInterval(t);
        window.location.href = "http://www.bidongwifi.com";
    }
}

function urlChange(url, param){
    var reurl = '';
    param=='' ? reurl=url : reurl=url+'?'+param;
    return reurl;
}

function showError(msg){
    $('.errorMsg').remove();
    var original = $(document.body);
    var h = '<div class="errorMsg">'+msg+'</div>';
    original.append(h);

    setTimeout(function(){
        $('.errorMsg').fadeOut(300, function(){
            $(this).remove();
        })
    }, 5000);
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