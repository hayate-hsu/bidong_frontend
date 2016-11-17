/**
 * Created by JavieChan on 2015/7/4.
 * Updated by JavieChan on 2016/11/17.
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

$(function(){
    var isyzm = false, verify;
    // tpLC二维码
    $('.tn_l .tn_po').hover(function(){
        $('.tn_wx').show();
    },function(){
        $('.tn_wx').hide();
    });

    // 记住账号
    if($('#autoLogin').length>0){
        var name = $('#autoLogin').data('name');
        var user = localStorage[name];
        if(!!user){
            $('input[name=user]').val(user);
            $('#autoLogin input').attr('checked', true);
            if(/^1\d{10}$/.test(user)){
                isyzm = true;
                $('input[name=password]').attr('type', 'text');
                $('#yzm').show();
            }else{
                isyzm = false;
                $('input[name=password]').attr('type', 'password');
                if(!$('#yzm').hasClass('sYzm'))
                    $('#yzm').hide();
            }
        }
    }

    //响应输入框
    $('.ns_group').click(function(){$(this).find('input').focus();});

    //账号类型检测
    $('#userCtrl').change(function(){
        var $parent = $(this).parent().siblings('div');
        //$('input[name=password]').val('');
        if(/^1\d{10}$/.test($(this).val())){
            isyzm = true;
            $parent.find('input[name=password]').attr('type', 'text');
            $('#yzm').show();
        }else{
            isyzm = false;
            $parent.find('input[name=password]').attr('type', 'password');
            if(!$('#yzm').hasClass('sYzm'))
                $('#yzm').hide();
        }
    });

    //账户登录验证
    $(document).on('click', '#ns_login, #login', function(){
        var $parent = $(this).parents('.FormAccount'), self = $(this);

        var user=$parent.find('input[name=user]').val(),
            pwd=$parent.find('input[name=password]').val(),
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
            $parent.find('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            // pc
            //$parent.find('.ns_msg').text('*输入账号/手机号').css('color', '#f36144').show();
            $parent.find('input[name=user]').focus();
            // all
            return false;
        }
        if(pwd==''||pwd==null){
            // mobile
            $parent.find('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            // pc
            //$parent.find('.ns_msg').text('*输入密码/验证码').css('color', '#f36144').show();
            $parent.find('input[name=password]').focus();
            // all
            return false;
        }
        if($('#autoDuty').length>0 && (!$('#autoDuty input').is(':checked'))){
            alert('需同意无线上网业务免责声明！');
            return false;
        }
        // mobile
        $parent.find('.ns_rz_group').removeClass('borderRed');
        // pc
        $parent.find('.ns_msg').text('');
        // all
        // 普通认证
        if (isyzm) {
            if (MD5yzm(pwd) == verify) {
                $.ajax({
                    method: "post",
                    url: '/wnl/register',
                    dataType: "json",
                    data: {
                        mobile: user,
                        mask: 256,
                        mac: $apmac
                    },
                    success: function (data) {
                        obj.user = data.user;
                        obj.password = data.password;
                        adminAuthor(obj, $firsturl, $urlparam, user, self);
                    }
                });
            } else {
                $parent.find('input[name=password]').val('');
                alert('验证码错误');
            }
        } else {
            adminAuthor(obj, $firsturl, $urlparam, user, self);
        }
    });
    $(document).on('click', '#loginAccount', function(){
        var $parent = $(this).parents('.FormAccount'), self = $(this);

        var user=$parent.find('input[name=user]').val(),
            pwd=$parent.find('input[name=password]').val(),
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
            $parent.find('.ns_rz_group:eq(0)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            $parent.find('input[name=user]').focus();
            // all
            return false;
        }
        if(pwd==''||pwd==null){
            // mobile
            $parent.find('.ns_rz_group:eq(1)').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            $parent.find('input[name=password]').focus();
            // all
            return false;
        }
        // mobile
        $parent.find('.ns_rz_group').removeClass('borderRed');
        // all
        // 学生认证
        adminAuthor(obj, $firsturl, $urlparam, user, self);
    });

    //验证码重发
    $(document).on('click', '#yzm', function(){
        var $this=$(this);
        if(!isyzm){alert('请输入正确的手机号');return false;}
        if(canyzm){
            $.ajax({
                method: "post",
                url: '/wnl/mobile',
                dataType: "json",
                data: {
                    mobile: $this.parents('.FormAccount').find('input[name=user]').val(),
                    mask: 256,
                    pn: $('#pn').val()
                },
                success: function(data){
                    verify = data.verify;
                    alert("验证码已下发到手机，请注意查收！");
                    $this.html('<span>60</span>秒重新获取').attr('disabled', true);
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
});

//账户认证
function adminAuthor(obj, firsturl, urlparam, user, $this){
    $.ajax({
        method: "POST",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        timeout: 30000,
        beforeSend: function(){
            $this.text('正在验证').attr('disabled', true);
        },
        success: function (data) {
            if($('#autoLogin').length>0 && $('#autoLogin input').is(':checked')){
                var name = $('#autoLogin').data('name');
                localStorage[name]=user;
            }
            $this.parent().find('.ns_msg').text('验证成功，可以上网').css('color', '#68d68f').show();
            setTimeout(function(){
                $this.parent().find('.ns_msg').fadeOut();
            }, 5000);
            if($this.hasClass('theNode')){
                window.location.href= 'http://www.thenode.cn/web/index.do';
            }else{
                window.location.href= urlChange(firsturl, urlparam);
            }
        },
        complete: function(xmlhttp, status){
            if(status=='timeout'){   // 超时,status还有success,error等值的情况
                $this.parent().find('.ns_msg').text('请求超时，请重新登录').css('color', '#ef635c').show();
                setTimeout(function(){
                    $this.parent().find('.ns_msg').fadeOut();
                }, 5000);
            }
            $this.text('登录').attr('disabled', false);
        },
        error: function (error) {
            try{
                alert('验证失败：'+error.responseJSON.Msg);
            }catch(e) {
                alert('验证失败，请重新登录！');
            }

        }
    });
}
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
        $('#yzmMbo, #yzm').html('获取验证码').attr('disabled', false);
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
    var reurl;
    var w=window.location.href;
    var d=w.indexOf('?');
    if(url==w.substr(0, d)){
        reurl = 'http://mbd.cniotroot.cn/';
    }else{
        reurl = (param=='' ? url : url+'?'+param);
    }
    return reurl;
}