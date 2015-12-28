/**
 * Created by JavieChan on 2015/7/4.
 * Updatad by JavieChan on 2015/12/23.
 */
$(function(){

    //初始化
    orient();
    //禁止横屏
    $(window).bind( 'orientationchange', function(e){
        orient();
    });

    //新版
    /*智能机浏览器版本信息*/
    var browser = {
        versions: function() {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1 //是否iPad
            };
        }()
    };

    $('#appDownload').click(function(){
        if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
            window.location="https://mail.cstnet.cn/";
        }else if (browser.versions.android) {
            window.location="http://www.baidu.com/";
        }
    });

    //账户认证
    var isyzm = false;
    $('.ns_admin').change(function(){
        $('.ns_shuru, .ns_login').fadeOut(function(){
            $(this).remove();
        });

        var v = $(this).val();
        if(v==''){
            $('.ns_rz_wrapper p').fadeIn();
        }else if(/^1\d{10}$/.test(v)){
            $('.ns_rz_wrapper p').fadeOut();
            var t='<div class="ns_rz_group ns_shuru"><div><input type="text" placeholder="输入验证码：" class="pwd" /></div><button type="button" id="yzm">获取验证码</button></div> <input type="button" value="登录" class="ns_login" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = true;
        }else{
            $('.ns_rz_wrapper p').fadeOut();
            var t='<div class="ns_rz_group ns_shuru"><div><input type="password" placeholder="输入密码：" class="pwd" /></div></div> <input type="button" value="登录" class="ns_login" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = false;
        }
    });
    $(document).on('click', '.ns_login', function(){
        var admin=$('.ns_admin').val(), pwd=$('.pwd').val(), firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
        if(!isyzm){
            var obj = {
                user: admin,
                password: pwd
            };
            adminAuthor(obj, firsturl, urlparam);
        }
    });

    //验证码倒计时
    $(document).on('click', '#yzm', function(){
        $(this).html('倒计时<span>60</span>秒').css('background', '#d4d4d4').attr("disabled", "disabled");
        delayYZM();
    });

    //新版portal认证     【待定】
    //var int, inc;
    //$('.ns_header button').click(function(){
    //    var firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
    //
    //    $('.anthor').fadeIn();
    //    $('body').css("overflow-y", "hidden");
    //    $('#p2').text("正在验证,请耐心等待...").css("color", "#333");
    //    $('.anthor button').text("取消验证").css("background", "#6fccf7");
    //
    //    inc = setInterval(increFunc, 1000);
    //
    //    postAuthor(function() {
    //        int = setTimeout(function(url, param){
    //            return function(){
    //                timeOutFunc(url, param);
    //            }
    //        }(firsturl, urlparam), 3000);
    //    }, firsturl, urlparam);
    //
    //    //$.ajax({
    //    //    type: "POST",
    //    //    url: "/account",
    //    //    contentType: "application/json; charset=utf-8",
    //    //    data: JSON.stringify(PortalData()),
    //    //    dataType: "json",
    //    //    success: function (data) {
    //    //        clearInterval(inc);
    //    //        $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //    //        window.location.href = urlChange(firsturl, urlparam);
    //    //    },
    //    //    statusCode: {
    //    //        435: function() {
    //    //            clearInterval(inc);
    //    //            $('#p2').text("验证成功,马上为您跳转！").css("color", "#00a388");
    //    //            window.location.href = urlChange(firsturl, urlparam);
    //    //        },
    //    //        436: function() {
    //    //            int = setTimeout(function(url, param){
    //    //                return function(){
    //    //                    timeOutFunc(url, param);
    //    //                }
    //    //            }(firsturl, urlparam), 3000);
    //    //        }
    //    //    },
    //    //    error: function(error){
    //    //        console.log(error.status);
    //    //        clearInterval(inc);
    //    //        $('#p2').text('验证失败').css("color", "#f00");
    //    //        $('.anthor button').text("返回").css("background", "#ffa21c");
    //    //        clearTimeout(int);
    //    //    }
    //    //});
    //});
    //取消验证
    $('.anthor button').click(function(){       //【待定】
        clearInterval(inc);
        $('.anthor').fadeOut();
        $('#p1 span').text(0);
        $('body').css("overflow-y", "auto");
        clearTimeout(int);
    });
    //新版end
});

//一键上网认证
var inc,int;   //inc:用时计时器， int：timeout   【作用域全局】
function postAuthor(callback, url, param){                   //【待定】
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
            $('.anthor button').text("返回").css("background", "#ffa21c");
            clearTimeout(int);
        }
    });
}
function timeOutFunc(url, param){   //【待定】
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
    //        $('.anthor button').text("返回").css("background", "#ffa21c");
    //        clearTimeout(int);
    //    }
    //});
}
function timeOutFunc2(url, param){   //【待定】
    postAuthor(function(error){
        console.log(error.status);
        clearInterval(inc);
        $('#p2').text('验证失败').css("color", "#f00");
        $('.anthor button').text("返回").css("background", "#ffa21c");
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
    //        $('.anthor button').text("返回").css("background", "#ffa21c");
    //        clearTimeout(int);
    //    }
    //});
}

//计时器
function increFunc(){   //【待定】
    var d = $('#p1 span').text();
    d++;
    $('#p1 span').text(d);
}

//验证码倒计时
function delayYZM(){
    var delay = $('#yzm span').text();
    var t = setTimeout('delayYZM()', 1000);
    if(delay>1){
        delay--;
        $('#yzm span').text(delay);
    }else{
        clearTimeout(t);
        $('#yzm').html('获取验证码').css('background', '#83bfde').removeAttr("disabled");
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

//账户认证
function adminAuthor(obj, firsturl, urlparam){
    $.ajax({
        type: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function(){
            $('.ns_login').text('正在为你验证...').attr('disabled', 'disabled');
        },
        success: function (data) {
            window.location.href=urlChange(firsturl, urlparam);
        },
        complete: function(){
            $('.ns_login').text('登录').removeAttr('disabled');
        },
        error: function (msg) {
            showError("连接失败");
        }
    });
}

//错误提示
var err; //错误提示超时检测  【作用域全局】
function showError(msg){
    clearTimeout(err);
    $('.errorMsg').remove();
    var original = $(document.body);
    var h = '<div class="errorMsg">'+msg+'</div>';
    original.append(h);

    err = setTimeout(function(){
        $('.errorMsg').fadeOut(300, function(){
            $(this).remove();
        })
    }, 5000);
}

//判断屏幕横竖屏
function orient() {
    //alert('JavieChan');
    if (window.orientation == 0 || window.orientation == 180) {
        $("body").attr("class", "portrait");
        orientation = 'portrait';
        return false;
    } else if (window.orientation == 90 || window.orientation == -90) {
        $("body").attr("class", "landscape");
        orientation = 'landscape';
        return false;
    }
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