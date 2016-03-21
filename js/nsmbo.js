/**
 * Created by JavieChan on 2015/7/4.
 * Updatad by JavieChan on 2016/1/4.
 */

//weixin-portal
var loadIframe = null;
var noResponse = null;
var callUpTimestamp = 0;

function putNoResponse(ev){
    clearTimeout(noResponse);
}

function errorJump()
{
    var now = new Date().getTime();
    if((now - callUpTimestamp) > 4*1000){
        return;
    }
    alert('该浏览器不支持自动跳转微信请手动打开微信\n如果已跳转请忽略此提示');
}

myHandler = function(error) {
    errorJump();
};

function createIframe(){
    var iframe = document.createElement("iframe");
    iframe.style.cssText = "display:none;width:0px;height:0px;";
    document.body.appendChild(iframe);
    loadIframe = iframe;
}

function jsonpCallback(result){
    if(result && result.success){
        alert('WeChat will call up : ' + result.success + '  data:' + result.data);
        var ua=navigator.userAgent;
        if (ua.indexOf("iPhone") != -1 ||ua.indexOf("iPod")!=-1||ua.indexOf("iPad") != -1) {   //iPhone
            document.location = result.data;
        }else{
            createIframe();
            callUpTimestamp = new Date().getTime();
            loadIframe.src=result.data;
            noResponse = setTimeout(function(){
                errorJump();
            },3000);
        }
    }else if(result && !result.success){
        alert(result.data);
    }
}
function Wechat_GotoRedirect(appId, extend, timestamp, sign, shopId, authUrl, mac, ssid, bssid){
    var url = "https://wifi.weixin.qq.com/operator/callWechatBrowser.xhtml?appId=" + appId
            + "&extend=" + extend
            + "&timestamp=" + timestamp
            + "&sign=" + sign;

    if(authUrl && shopId){
        url = "https://wifi.weixin.qq.com/operator/callWechat.xhtml?appId=" + appId
        + "&extend=" + extend
        + "&timestamp=" + timestamp
        + "&sign=" + sign
        + "&shopId=" + shopId
        + "&authUrl=" + encodeURIComponent(authUrl)
        + "&mac=" + mac
        + "&ssid=" + ssid
        + "&bssid=" + bssid;

    }

    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

document.addEventListener('visibilitychange', putNoResponse, false);

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
            var t='<div class="ns_rz_group ns_shuru"><div><input type="text" placeholder="输入验证码：" /></div><button type="button" id="yzm">获取验证码</button></div> <input type="button" value="登录" class="ns_login" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = true;
        }else{
            $('.ns_rz_wrapper p').fadeOut();
            var t='<div class="ns_rz_group ns_shuru"><div><input type="password" placeholder="输入密码：" /></div></div> <input type="button" value="登录" class="ns_login" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = false;
        }
    });
    $(document).on('click', '.ns_login', function(){
        var admin=$('.ns_admin').val(), pwd=$('.ns_shuru div input').val(), firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
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
        $(this).html('倒计时<span>60</span>秒').css('background', '#d8d8d8').attr("disabled", "disabled");
        delayYZM();
    });
});

//验证码倒计时
function delayYZM(){
    var delay = $('#yzm span').text();
    var t = setTimeout('delayYZM()', 1000);
    if(delay>1){
        delay--;
        $('#yzm span').text(delay);
    }else{
        clearTimeout(t);
        $('#yzm').html('获取验证码').css('background', '#56aee9').removeAttr("disabled");
    }
}

//自动跳转
function urlChange(url, param){
    var reurl = '';
    param=='' ? reurl=url : reurl=url+'?'+param;
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
            alert("连接失败");
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
    var $appid =  $('#appid').val();
    var $shopid=  $('#shopid').val();

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
        "urlparam": $urlparam,
        appid: $appid,
        shopid: $shopid
    };

    return jsonObj;
}
