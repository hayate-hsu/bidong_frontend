/**
 * Created by JavieChan on 2015/7/4.
 * Updated by JavieChan on 2016/2/16.
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
    $('.tn_l .tn_po').hover(function(){
        $('.tn_wx').show();
    },function(){
        $('.tn_wx').hide();
    });

    //响应输入框
    $('.ns_group').click(function(){
        $(this).find('input').focus();
    });

    //账号类型检测
    var isyzm = false;
    $('.ns_user input').change(function(){
        if(/^1\d{10}$/.test($(this).val())){
            $('#yzm').show().prev('input').css('width', '100px');
        }else{
            $('#yzm').hide().prev('input').css('width', '179px');
        }
    });

    //账户登录验证
    $('#ns_login').click(function(){
        var user=$('#ns_user').val(),
            pwd=$('#ns_pwd').val(),
            $openid=$('#openid').val(),
            $acip=$('#ac_ip').val(),
            $vlanId=$('#vlanId').val(),
            $ssid=$('#ssid').val(),
            $userip=$('#user_ip').val(),
            $usermac=$('#user_mac').val(),
            $apmac=$('#ap_mac').val(),
            $firsturl=$('#firsturl').val(),
            $urlparam=$('#urlparam').val(),
            $appid=$('#appid').val(),
            $shopid=$('#shopid').val();

        if(user==''||user==null){
            $('.ns_msg').text('*输入账号/手机号').css('color', '#f36144').show();$('#ns_user').focus();
        }else if(pwd==''||pwd==null){
            $('.ns_msg').text('*输入密码/验证码').css('color', '#f36144').show();$('#ns_pwd').focus();
        }else{
            $('.ns_msg').text('');
            var obj = {
                user: user,
                password: pwd,
                openid: $openid,
                ac_ip: $acip,
                vlanId: $vlanId,
                ssid: $ssid,
                user_ip: $userip,
                user_mac: $usermac,
                ap_mac: $apmac,
                firsturl: $firsturl,
                urlparam: $urlparam,
                appid: $appid,
                shopid: $shopid
            };
            adminAuthor(obj, $firsturl, $urlparam);
        }
    });

    //验证码重发
    $('#yzm, #byYzm').click(function(){
        if(canyzm){
            $(this).html('<span>60</span>秒重新获取').addClass('disabled').attr('disabled', 'disabled');
            delayYZM($(this));
        }
    });

    //移动账户认证
    $('.ns_admin_mbo').change(function(){
        if(/^1\d{10}$/.test($(this).val())){
            $('#yzmMbo').show();
        }else{
            $('#yzmMbo').hide();
        }
    });
    $(document).on('click', '.ns_login_mbo', function(){
        var admin=$('input[name=user]').val(),
            pwd=$('input[name=password]').val(),
            $openid=$('#openid').val(),
            $acip=$('#ac_ip').val(),
            $vlanId=$('#vlanId').val(),
            $ssid=$('#ssid').val(),
            $userip=$('#user_ip').val(),
            $usermac=$('#user_mac').val(),
            $apmac=$('#ap_mac').val(),
            $firsturl=$('#firsturl').val(),
            $urlparam=$('#urlparam').val(),
            $appid=$('#appid').val(),
            $shopid=$('#shopid').val();

        if(admin==''||admin==null){
            $('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
        }else if(pwd=='' || pwd==null){
            $('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
        }else{
            $('.ns_rz_group').removeClass('borderRed');
            var obj = {
                user: admin,
                password: pwd,
                openid: $openid,
                ac_ip: $acip,
                vlanId: $vlanId,
                ssid: $ssid,
                user_ip: $userip,
                user_mac: $usermac,
                ap_mac: $apmac,
                firsturl: $firsturl,
                urlparam: $urlparam,
                appid: $appid,
                shopid: $shopid
            };
            adminAuthorMbo(obj, $firsturl, $urlparam);
        }
    });

    //验证码倒计时
    $(document).on('click', '#yzmMbo', function(){
        $(this).html('<span>60</span>秒重新获取').css('color', '#cbcbcb').attr("disabled", "disabled");
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
            $('.ns_msg').text('正在为您验证...').css('color', '#68d68f').show();
            $('.ns_login').attr('disabled', 'disabled');
        },
        success: function (data) {
            $('.ns_msg').text('验证成功').css('color', '#68d68f').show();
            if($('#ns_login').hasClass('theNode')){
                window.location.href= 'http://www.thenode.cn/web/index.do';
            }else{
                window.location.href= urlChange(firsturl, urlparam);
            }
        },
        complete: function(){
            $('.ns_msg').text('').hide();
            $('.ns_login').removeAttr('disabled');
        },
        error: function (msg) {
            alert('验证失败！');
        }
    });
}

//验证码倒计时
var canyzm = true;//判断倒计时是否结束   【作用域全局】
function delayYZM($this){
    var delay = $this.find('span').text();
    var t = setTimeout(_delayYZM($this), 1000);
    if(delay>1){
        delay--;
        $this.find('span').text(delay);
        canyzm = false;
    }else{
        clearTimeout(t);
        $this.html('获取验证码').removeClass('disabled').removeAttr('disabled');
        canyzm = true;
    }
}
function _delayYZM($this){
    return function (){
        delayYZM($this);
    }
}

//自动跳转
function urlChange(url, param){
    var reurl = '';
    param=='' ? reurl=url : reurl=url+'?'+param;
    return reurl;
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
            $('.ns_msg').text('正在为您验证...');
            $('.ns_login_mbo').attr('disabled', 'disabled');
        },
        success: function (data) {
            $('.ns_msg').text('验证成功');
            window.location.href=urlChange(firsturl, urlparam);
        },
        complete: function(){
            $('.ns_msg').text('');
            $('.ns_login_mbo').removeAttr('disabled');
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
        $('#yzmMbo').html('获取验证码').css('color', '#489ad8').removeAttr("disabled");
    }
}
