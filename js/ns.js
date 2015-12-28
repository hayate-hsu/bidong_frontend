/**
 * Created by JavieChan on 2015/7/4.
 * Updated by JavieChan on 2015/12/23.
 */

$(function(){

    /*新版南沙区无线城市begin*/
    //var inc,int;
    $('#ns_free').click(function(){
        var firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
        $('#p2').text("正在验证,请耐心等待...").css("color", "#333");
        $('.ns_dialog button').text("取消验证").css("background", "#2d90ff");

        $('.ns_dialog').fadeIn();
        inc = setInterval(increFunc, 1000);

        $(this).attr('disabled', 'disabled');

        postAuthor(function() {
            int = setTimeout(function(url, param){
                return function(){
                    timeOutFunc(url, param);
                }
            }(firsturl, urlparam), 3000);
        }, firsturl, urlparam);

        //$.ajax({
        //    type: "POST",
        //    url: "/account",
        //    contentType: "application/json; charset=utf-8",
        //    data: JSON.stringify(PortalData()),
        //    dataType: "json",
        //    success: function (data) {
        //        clearInterval(inc);
        //        $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
        //        window.location.href = urlChange(firsturl, urlparam);
        //    },
        //    statusCode: {
        //        435: function() {
        //            clearInterval(inc);
        //            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
        //            window.location.href = urlChange(firsturl, urlparam);
        //        },
        //        436: function() {
        //            int = setTimeout(function(url, param){
        //                return function(){
        //                    timeOutFunc(url, param);
        //                }
        //            }(firsturl, urlparam), 3000);
        //        }
        //    },
        //    error: function(error){
        //        console.log(error.status);
        //        clearInterval(inc);
        //        $('#p2').text('验证失败').css("color", "#f00");
        //        $('.ns_dialog button').text("返回").css("background", "#ffa21c");
        //        clearTimeout(int);
        //    }
        //});
    });
    //取消验证
    $('.ns_dialog button').click(function(){
        clearInterval(inc);
        $('.ns_dialog').fadeOut();
        $('#p1 span').text(0);
        clearTimeout(int);
        $('#ns_free').removeAttr('disabled');
    });

    //APP下载
    $('.ns_app button, .ns_appnote a').click(function(){
        $('body').css('padding-right', '17px').addClass('open').append('<div class="zhez fade"></div>');
        $('.ns_modal').fadeIn(150, function(){
            $(this).addClass('in');
        });
        $('.zhez').addClass('in');
    });
    $(document).on('click', '.ns_modal, .ns_download .closed', function(){
        $('.ns_modal').removeClass('in').fadeOut(150);

        $('.zhez').removeClass('in');
        setTimeout(function(){
            $('.zhez').remove();
            $('body').css('padding-right', '0').removeClass('open');
        }, 150);
    });

    //相应输入框
    $('.ns_group').click(function(){
        $(this).find('input').focus();
    });

    //账号类型检测
    var isyzm = false;
    $('#ns_txt').change(function(){
        var v=$(this).val();
        $(this).parent().parent().find('p').removeClass('in');

        if(v==''){
            $('.ns_login, .ns_yzm, .ns_pwd').removeClass('in');
            $(this).parent().parent().find('p').addClass('in');
        }else if(/^1\d{10}$/.test(v)){
            $('.ns_pwd').removeClass('in');
            $('.ns_yzm').addClass('in');
            setTimeout(function(){
                $('.ns_login').addClass('in');
            }, 200);
            isyzm = true;
        }else{
            $('.ns_yzm').removeClass('in');
            $('.ns_pwd').addClass('in');
            setTimeout(function(){
                $('.ns_login').addClass('in');
            }, 200);
            isyzm = false;
        }
    });

    //账户登录验证
    $('#ns_login').click(function(){
        var admin=$('#ns_txt').val(), pwd=$('#ns_pwd').val(), yzm=$('#ns_yzm').val(), firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
        if(!isyzm){
            var obj = {
                user: admin,
                password: pwd
            };
            adminAuthor(obj, firsturl, urlparam);
        }
    });

    //验证码重发
    $('#yzm').click(function(){
        if(canyzm){
            $(this).html('倒计时<span>60</span>秒').addClass('disabled').attr('disabled', 'disabled');
            delayYZM();
        }
    });
    /*新版南沙区无线城市end*/
});

//账户认证
function adminAuthor(obj, firsturl, urlparam){
    $.ajax({
        type: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function(){
            $('.ns_login').text('正在验证...').attr('disabled', 'disabled');
        },
        success: function (data) {
            $('.ns_admin .ns_box').append('<span style="position: absolute; top: 184px; left: 59px;">验证成功，正在为您跳转~</span>');
            window.location.href= urlChange(firsturl, urlparam);
        },
        complete: function(){
            $('.ns_login').text('登录').removeAttr('disabled');
        },
        error: function (msg) {
            alert('验证失败！');
        }
    });
}

//一键上网认证
var inc, int;  //inc:计时器， int:timeout 【作用域全局】
function postAuthor(callback, url, param){
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
            436: callback
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
function timeOutFunc(url, param){
    postAuthor(function() {
        int = setTimeout(function(url, param){
            return function(){
                timeOutFunc2(url, param);
            }
        }(url, param), 3000);
    }, url, param);

    //$.ajax({
    //    type: "POST",
    //    url: "/account",
    //    contentType: "application/json; charset=utf-8",
    //    data: JSON.stringify(PortalData()),
    //    dataType: "json",
    //    success: function (data) {
    //        clearInterval(inc);
    //        $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //        window.location.href = urlChange(url, param);
    //    },
    //    statusCode: {
    //        435: function() {
    //            clearInterval(inc);
    //            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //            window.location.href = urlChange(url, param);
    //        },
    //        436: function() {
    //            int = setTimeout(function(url, param){
    //                return function(){
    //                    timeOutFunc2(url, param);
    //                }
    //            }(url, param), 3000);
    //        }
    //    },
    //    error: function(error){
    //        console.log(error.status);
    //        clearInterval(inc);
    //        $('#p2').text('验证失败').css("color", "#f00");
    //        $('.ns_dialog button').text("返回").css("background", "#ffa21c");
    //        clearTimeout(int);
    //    }
    //});
}
function timeOutFunc2(url, param){
    postAuthor(function(error){
        console.log(error.status);
        clearInterval(inc);
        $('#p2').text('验证失败').css("color", "#f00");
        $('.ns_dialog button').text("返回").css("background", "#ffa21c");
        clearTimeout(int);
    }, url, param);

    //$.ajax({
    //    type: "POST",
    //    url: "/account",
    //    contentType: "application/json; charset=utf-8",
    //    data: JSON.stringify(PortalData()),
    //    dataType: "json",
    //    success: function (data) {
    //        clearInterval(inc);
    //        $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //        window.location.href = urlChange(url, param);
    //    },
    //    statusCode: {
    //        435: function() {
    //            clearInterval(inc);
    //            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //            window.location.href = urlChange(url, param);
    //        }
    //    },
    //    error: function(error){
    //        console.log(error.status);
    //        clearInterval(inc);
    //        $('#p2').text('验证失败').css("color", "#f00");
    //        $('.ns_dialog button').text("返回").css("background", "#ffa21c");
    //        clearTimeout(int);
    //    }
    //});
}

//验证用时计时器
function increFunc(){
    var d = $('#p1 span').text();
    d++;
    $('#p1 span').text(d);
}

//验证码倒计时
var canyzm = true;//判断倒计时是否结束   【作用域全局】
function delayYZM(){
    var delay = $('#yzm span').text();
    var t = setTimeout('delayYZM()', 1000);
    if(delay>1){
        delay--;
        $('#yzm span').text(delay);
        canyzm = false;
    }else{
        clearTimeout(t);
        $('#yzm').html('获取验证码').removeClass('disabled').removeAttr('disabled');
        canyzm = true;
    }
}

//自动跳转
function urlChange(url, param){
    var reurl = '';
    if(url=='14.23.62.180:9898/login.html'){
        reurl = 'http://www.bidongwifi.com';
    }else{
        param=='' ? reurl=url : reurl=url+'?'+param;
    }
    return reurl;
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