/**
 * Created by JavieChan on 2015/7/4.
 * Updated by JavieChan on 2016/1/4.
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
    // alert('WeChat will call up : ' + result.success + '  data:' + result.data);
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

function weixinScan(appId, shopId, extend, authUrl){
    JSAPI.auth({
        target : document.getElementById('qrcode_zone'),
        appId : appId,
        shopId : shopId,
        extend : extend,
        //authUrl : 'http://wifi.weixin.qq.com/mbl/default.xhtml'
        authUrl : authUrl
    });
}

$(function(){
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
    $(document).on('click', '.ns_download', function(){return false;});

    //响应输入框
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

    //移动端认证
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

    //移动账户认证
    $('.ns_admin_mbo').change(function(){
        $('.ns_shuru, .ns_login_mbo').fadeOut(function(){
            $(this).remove();
        });

        var v = $(this).val();
        if(v==''){
            $('.ns_rz_wrapper p').fadeIn();
        }else if(/^1\d{10}$/.test(v)){
            $('.ns_rz_wrapper p').fadeOut();
            var t='<div class="ns_rz_group ns_shuru"><div><input type="text" placeholder="输入验证码：" /></div><button type="button" id="yzmMbo">获取验证码</button></div> <input type="button" value="登录" class="ns_login_mbo" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = true;
        }else{
            $('.ns_rz_wrapper p').fadeOut();
            var t='<div class="ns_rz_group ns_shuru"><div><input type="password" placeholder="输入密码：" /></div></div> <input type="button" value="登录" class="ns_login_mbo" />';
            $('.ns_rz_wrapper').append(t);
            isyzm = false;
        }
    });
    $(document).on('click', '.ns_login_mbo', function(){
        var admin=$('.ns_admin_mbo').val(), pwd=$('.ns_shuru div input').val(), firsturl=$('#firsturl').val(), urlparam=$('#urlparam').val();
        if(!isyzm){
            var obj = {
                user: admin,
                password: pwd
            };
            adminAuthorMbo(obj, firsturl, urlparam);
        }
    });

    //验证码倒计时
    $(document).on('click', '#yzmMbo', function(){
        $(this).html('倒计时<span>60</span>秒').css('background', '#d8d8d8').attr("disabled", "disabled");
        delayYZMMbo();
    });
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
    param=='' ? reurl=url : reurl=url+'?'+param;
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

//移动端账户认证
function adminAuthorMbo(obj, firsturl, urlparam){
    $.ajax({
        type: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function(){
            $('.ns_login_mbo').text('正在为你验证...').attr('disabled', 'disabled');
        },
        success: function (data) {
            window.location.href=urlChange(firsturl, urlparam);
        },
        complete: function(){
            $('.ns_login_mbo').text('登录').removeAttr('disabled');
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

//验证码倒计时
function delayYZMMbo(){
    var delay = $('#yzmMbo span').text();
    var t = setTimeout('delayYZMMbo()', 1000);
    if(delay>1){
        delay--;
        $('#yzmMbo span').text(delay);
    }else{
        clearTimeout(t);
        $('#yzmMbo').html('获取验证码').css('background', '#56aee9').removeAttr("disabled");
    }
}
