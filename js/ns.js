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
    // tpLC二维码
    $('.tn_l .tn_po').hover(function(){
        $('.tn_wx').show();
    },function(){
        $('.tn_wx').hide();
    });

    //响应输入框
    $('.ns_group').click(function(){$(this).find('input').focus();});

    //账号类型检测
    var isyzm = false, verify;
    $('input[name=user]').change(function(){
        $('input[name=password]').val('');
        if(/^1\d{10}$/.test($(this).val()) && (!$(this).hasClass('onlyAct'))){   // onlyAct:只有账户登录
            isyzm = true;
            if($('#yzmMbo, #yzm').hasClass('fYzm')){
                $('.mYzm').show();
                $('input[name=password]').attr('type', 'text');
            }
        }else{
            isyzm = false;
            if($('#yzmMbo, #yzm').hasClass('fYzm')){
                $('.mYzm').hide();
                $('input[name=password]').attr('type', 'password');
            }
        }
    });

    //账户登录验证
    $(document).on('click', '#ns_login, #login', function(){
        var user=$('input[name=user]').val(),
            pwd=$('input[name=password]').val(),
            $apmac=$('#ap_mac').val(),
            $firsturl=$('#firsturl').val(),
            $urlparam=$('#urlparam').val();

        var obj = {
            user: user,
            password: pwd,
            openid: $('#openid').val(),
            ac_ip: $('#ac_ip').val(),
            vlanId: $('#vlanId').val(),
            ssid: $('#ssid').val(),
            user_ip: $('#user_ip').val(),
            user_mac: $('#user_mac').val(),
            ap_mac: $apmac,
            firsturl: $firsturl,
            urlparam: $urlparam,
            appid: $('#appid').val(),
            shopid: $('#shopid').val()
        };

        if(user==''||user==null){
            // mobile
            $('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            // pc
            $('.ns_msg').text('*输入账号/手机号').css('color', '#f36144').show();
            $('input[name=user]').focus();
            // all
            return false;
        }
        if(pwd==''||pwd==null){
            // mobile
            $('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            // pc
            $('.ns_msg').text('*输入密码/验证码').css('color', '#f36144').show();
            $('input[name=password]').focus();
            // all
            return false;
        }
        // mobile
        if($('#autoDuty').length>0 && (!$('#autoDuty input').is(':checked'))){
            alert('需同意无线上网业务免责声明！');
            return false;
        }
        $('.ns_rz_group').removeClass('borderRed');
        // pc
        $('.ns_msg').text('');
        // all
        if(isyzm){
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
                $('input[name=password]').val('');
                alert('验证码错误');
            }
        }else{
            adminAuthor(obj, $firsturl, $urlparam);
        }
    });

    //验证码重发
    $(document).on('click', '#yzm, #yzmMbo', function(){
        var $this=$(this), mobile=$('input[name=user]').val();
        if(!isyzm){alert('请输入正确的手机号');return false;}
        if(canyzm){
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
                    //delayYZMMbo($this);
                    delayYZMMbo();
                },
                error: function(msg){
                    console.log(msg);
                    alert('请检查网络状态');
                }
            });
        }
    });
    //验证码倒计时
    //$(document).on('click', '#yzmMbo', function(){
    //    var $this=$(this), mobile=$('input[name=user]').val();
    //    if(!isyzm){alert('请输入正确的手机号');return false;}
    //    if(canyzm){
    //        $.ajax({
    //            method: "post",
    //            url: '/wnl/mobile',
    //            dataType: "json",
    //            data: {
    //                mobile: mobile,
    //                mask: 256
    //            },
    //            success: function(data){
    //                verify = data.verify;
    //                alert("验证码已下发到手机，请注意查收！");
    //                $this.html('<span>60</span>秒重新获取').css('color', '#cbcbcb').attr("disabled", "disabled");
    //                delayYZMMbo();
    //            },
    //            error: function(msg){
    //                console.log(msg);
    //                alert('请检查网络是否已连接');
    //            }
    //        });
    //    }
    //});

    //移动账户认证
    //$(document).on('click', '#login', function(){
    //    var user=$('input[name=user]').val(),
    //        pwd=$('input[name=password]').val(),
    //        $openid=$('#openid').val(),
    //        $acip=$('#ac_ip').val(),
    //        $vlanId=$('#vlanId').val(),
    //        $ssid=$('#ssid').val(),
    //        $userip=$('#user_ip').val(),
    //        $usermac=$('#user_mac').val(),
    //        $apmac=$('#ap_mac').val(),
    //        $firsturl=$('#firsturl').val(),
    //        $urlparam=$('#urlparam').val(),
    //        $appid=$('#appid').val(),
    //        $shopid=$('#shopid').val();
    //
    //    var obj = {
    //        user: user,
    //        password: pwd,
    //        openid: $openid,
    //        ac_ip: $acip,
    //        vlanId: $vlanId,
    //        ssid: $ssid,
    //        user_ip: $userip,
    //        user_mac: $usermac,
    //        ap_mac: $apmac,
    //        firsturl: $firsturl,
    //        urlparam: $urlparam,
    //        appid: $appid,
    //        shopid: $shopid
    //    };
    //
    //    if(user=='' || user==null){
    //        $('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
    //        return false;
    //    }
    //    if(pwd=='' || pwd==null){
    //        $('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
    //        return false;
    //    }
    //    $('.ns_rz_group').removeClass('borderRed');
    //    if(isyzm){
    //        if(MD5yzm(pwd)==verify){
    //            $.ajax({
    //                method: "post",
    //                url: '/wnl/register',
    //                dataType: "json",
    //                data: {
    //                    mobile: user,
    //                    mask: 256,
    //                    mac: $apmac
    //                },
    //                success: function(data){
    //                    obj.user=data.user;
    //                    obj.password=data.password;
    //                    adminAuthorMbo(obj, $firsturl, $urlparam);
    //                }
    //            });
    //        }else{
    //            $('input[name=password]').val('');
    //            alert('验证码错误');
    //        }
    //    }else{
    //        adminAuthorMbo(obj, $firsturl, $urlparam);
    //    }
    //});
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
            $('.ns_msg').text('正在为您验证...').css('color', '#68d68f');
            $('#ns_login, #login').attr('disabled', 'disabled');
        },
        success: function (data) {
            $('.ns_msg').text('验证成功').css('color', '#68d68f');
            if($('#ns_login').hasClass('theNode')){
                window.location.href= 'http://www.thenode.cn/web/index.do';
            }else{
                window.location.href= urlChange(firsturl, urlparam);
            }
        },
        complete: function(){
            $('.ns_msg').text('');
            $('#ns_login, #login').removeAttr('disabled');
        },
        error: function (error) {
            alert('验证失败：'+error.responseJSON.Msg);
        }
    });
}
//移动端账户认证
//function adminAuthorMbo(obj, firsturl, urlparam){
//    $.ajax({
//        method: "POST",
//        url: "/account",
//        contentType: "application/json; charset=utf-8",
//        data: JSON.stringify(obj),
//        dataType: "json",
//        beforeSend: function(){
//            $('.ns_msg').text('正在为您验证...');
//            $('#login').attr('disabled', 'disabled');
//        },
//        success: function (data) {
//            $('.ns_msg').text('验证成功');
//            window.location.href=urlChange(firsturl, urlparam);
//        },
//        complete: function(){
//            $('.ns_msg').text('');
//            $('#login').removeAttr('disabled');
//        },
//        error: function (error) {
//            alert('验证失败：'+error.responseJSON.Msg);
//        }
//    });
//}

//验证码倒计时
var canyzm = true;//判断倒计时是否结束   【作用域全局】
//function delayYZM($this){
//    var delay = $this.find('span').text();
//    var t = setTimeout(_delayYZM($this), 1000);
//    if(delay>1){
//        delay--;
//        $this.find('span').text(delay);
//        canyzm = false;
//    }else{
//        clearTimeout(t);
//        $this.html('获取验证码').removeClass('disabled').removeAttr('disabled');
//        canyzm = true;
//    }
//}
//function _delayYZM($this){
//    return function (){
//        delayYZM($this);
//    }
//}
function delayYZMMbo(){
    var delay = $('#yzmMbo span, #yzm span').text();
    var t = setTimeout('delayYZMMbo()', 1000);
    if(delay>1){
        delay--;
        $('#yzmMbo span, #yzm span').text(delay);
        canyzm = false;
    }else{
        clearTimeout(t);
        $('#yzmMbo, #yzm').html('获取验证码').removeClass('disabled').removeAttr("disabled");
        canyzm = true;
    }
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

//验证码检测
function MD5yzm(yzm){
    var m = hex_md5(yzm);
    var md1=m.substr(12, 4), md2=m.substr(-4);
    m = md1+md2;
    return m;
}

//自动跳转
function urlChange(url, param){
    var reurl = '';
    param=='' ? reurl=url : reurl=url+'?'+param;
    return reurl;
}