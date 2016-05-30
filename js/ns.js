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
    var isyzm = false, verify;
    $('.ns_user input').change(function(){
        if(/^1\d{10}$/.test($(this).val())){
            isyzm = true;
            $('#yzm').show().prev('input').css('width', '100px');
            $('#ns_pwd').attr('type', 'text').val('');
        }else{
            isyzm = false;
            $('#yzm').hide().prev('input').css('width', '179px');
            $('#ns_pwd').attr('type', 'password').val('');
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

        if(user==''||user==null){
            $('.ns_msg').text('*输入账号/手机号').css('color', '#f36144').show();$('#ns_user').focus();
        }else if(pwd==''||pwd==null){
            $('.ns_msg').text('*输入密码/验证码').css('color', '#f36144').show();$('#ns_pwd').focus();
        }else if(isyzm){
            $('.ns_msg').text('');
            if(MD5yzm(pwd)==verify){
                $.ajax({
                    method: "post",
                    url: '/wnl/register',
                    dataType: "json",
                    data: {
                        mobile: user,
                        mask: 256,
                        mac: $apmac
                    },
                    success: function(data){
                        obj.user=data.user;
                        obj.password=data.password;
                        adminAuthor(obj, $firsturl, $urlparam);
                    }
                });
            }else{
                $('#ns_pwd').val('');
                $('.ns_msg').text('验证码错误');return false;
            }
        }else{
            $('.ns_msg').text('');
            adminAuthor(obj, $firsturl, $urlparam);
        }
    });

    //验证码重发
    $('#yzm, #byYzm').click(function(){
        var $this=$(this), mobile=$('#ns_user').val();
        if(!isyzm){
            alert('请输入正确的手机号');
        }else if(canyzm){
            $.ajax({
                method: "post",
                url: '/wnl/mobile',
                dataType: "json",
                data: {
                    mobile: mobile,
                    mask: 256
                },
                success: function(data){
                    verify = data.verify;
                    alert("验证码已下发到手机，请注意查收！");
                    $this.html('<span>60</span>秒重新获取').addClass('disabled').attr('disabled', 'disabled');
                    delayYZM($this);
                },
                error: function(msg){
                    alert('请检查网络状态');
                }
            });
        }
    });

    //移动账户认证
    $('.ns_admin_mbo').change(function(){
        if(/^1\d{10}$/.test($(this).val())){
            isyzm = true;
            $('#yzmMbo').show();
            $('input[name=password]').attr('type', 'text').val('');
        }else{
            isyzm = false;
            $('#yzmMbo').hide();
            $('input[name=password]').attr('type', 'password').val('');
        }
    });
    $(document).on('click', '.ns_login_mbo', function(){
        var user=$('input[name=user]').val(),
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

        if(user==''||user==null){
            $('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
        }else if(pwd=='' || pwd==null){
            $('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
        }else if(isyzm){
            $('.ns_rz_group').removeClass('borderRed');
            if(MD5yzm(pwd)==verify){
                $.ajax({
                    method: "post",
                    url: '/wnl/register',
                    dataType: "json",
                    data: {
                        mobile: user,
                        mask: 256,
                        mac: $apmac
                    },
                    success: function(data){
                        obj.user=data.user;
                        obj.password=data.password;
                        adminAuthorMbo(obj, $firsturl, $urlparam);
                    }
                });
            }else{
                alert('验证码错误');
            }
        }else{
            $('.ns_rz_group').removeClass('borderRed');
            adminAuthorMbo(obj, $firsturl, $urlparam);
        }
    });

    //验证码倒计时
    $(document).on('click', '#yzmMbo', function(){
        var $this=$(this), mobile=$('.ns_admin_mbo').val();
        if(!isyzm){
            alert('请输入正确的手机号');
        }else if(canyzm){
            $.ajax({
                method: "post",
                url: '/wnl/mobile',
                dataType: "json",
                data: {
                    mobile: mobile,
                    mask: 256
                },
                success: function(data){
                    verify = data.verify;
                    alert("验证码已下发到手机，请注意查收！");
                    $this.html('<span>60</span>秒重新获取').css('color', '#cbcbcb').attr("disabled", "disabled");
                    delayYZMMbo();
                },
                error: function(msg){
                    console.log(msg);
                    alert('请检查网络是否已连接');
                }
            });
        }
    });
});

//账户认证
function adminAuthor(obj, firsturl, urlparam){
    $.ajax({
        method: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        beforeSend: function(){
            $('.ns_msg').text('正在为您验证...').css('color', '#68d68f').show();
            $('#ns_login').attr('disabled', 'disabled');
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
            $('#ns_login').removeAttr('disabled');
        },
        error: function (error) {
            alert('验证失败：'+error.responseJSON.Msg);
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
        method: "POST",
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
        error: function (error) {
            alert('验证失败：'+error.responseJSON.Msg);
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

//验证码检测
function MD5yzm(yzm){
    var m = hex_md5(yzm);
    var md1=m.substr(12, 4), md2=m.substr(-4);
    m = md1+md2;
    return m;
}
