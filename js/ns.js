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

var isyzm = false, ispc=false;   //【全局变量】
$(function(){
    var verify, $dmuser;
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
            $parent.find('input[name=user]').parents('.ns_rz_group').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
            // pc
            //$parent.find('.ns_msg').text('*输入账号/手机号').css('color', '#f36144').show();
            $parent.find('input[name=user]').focus();
            // all
            return false;
        }
        if(pwd==''||pwd==null){
            // mobile
            $parent.find('input[name=password]').parents('.ns_rz_group').addClass('borderRed').siblings('.ns_rz_group').removeClass('borderRed');
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
                        $dmuser = data.user;
                        obj.user = data.user;
                        obj.password = data.password;
                        adminAuthor(obj, $firsturl, $urlparam, user, self);
                    }
                });
            } else {
                //$parent.find('input[name=password]').val('');
                alert('验证码错误');
            }
        } else {
            $dmuser = user;
            adminAuthor(obj, $firsturl, $urlparam, user, self);
        }
    });

    //验证码重发
    $(document).on('click', '#yzm', function(){
        var $this=$(this);
        var mobile = $this.parents('.FormAccount').find('input[name=user]').val();
        if(!(/^1\d{10}$/.test(mobile))){
            alert('请输入正确的手机号');return false;
        }
        //if(!isyzm){alert('请输入正确的手机号');return false;}
        if(canyzm){
            $.ajax({
                method: "post",
                url: '/wnl/mobile',
                dataType: "json",
                data: {
                    mobile: mobile,
                    mask: 256,
                    pn: $('#pn').val()
                },
                success: function(data){
                    verify = data.verify;
                    alert("验证码已下发到手机，请注意查收！");
                    $this.html('<span>60</span>秒重新获取').attr('disabled', true);
                    delayYZMMbo();
                },
                error: function(msg){
                    console.log(msg);
                    alert('请检查网络状态');
                }
            });
        }
    });

    // 下线设备
    $(document).on('click', '#dmSub', function(){
        var $mac=[];
        $('.dmlist label input').each(function(i, n){
            if($(n).is(':checked')){
                $mac.push($(n).siblings('.mac').text());
            }
        });
        if($mac.length>0){
            var $obj={
                user: $dmuser,
                macs: $mac.join(',')
            };
            downMacs($obj);
        }else{
            alert('请选择下线设备！');
        }
    });
    $(document).on('click', '#dmQuit', function(){
        $('.ns_dmc').fadeOut();
    });

    // 2016-12-05新增
    // 修改密码
    function hidecgpwd(){
        $('.ns_cgpwd').fadeOut('normal', function(){
            $('.ns_cgpwd input').val('');
        });
    }
    $(document).on('click', '#changepwd', function(){
        var user = $('input[name=user]').val();
        if(user==''){
            alert('请输入账号！');
            return false;
        }
        $('.ns_cgpwd').fadeIn();
    });
    $(document).on('click', '#cgQuit', function(){hidecgpwd();});
    $(document).on('click', '#cgSub', function(){
        var user = $('input[name=user]').val();
        var $cgpwd = $('.ns_cgpwd .cgpwd');
        var $oldpwd = $cgpwd.find('input[name=oldpwd]'),
            $newpwd= $cgpwd.find('input[name=newpwd]'),
            $new2pwd= $cgpwd.find('input[name=new2pwd]');
        var oldpwd = $oldpwd.val(),
            newpwd = $newpwd.val(),
            new2pwd = $new2pwd.val();
        if(oldpwd==''){$oldpwd.focus();return false;}
        if(newpwd==''){$newpwd.focus();return false;}
        if(new2pwd==''){$new2pwd.focus();return false;}
        if(newpwd==new2pwd){
            var param = {
                newp: newpwd,
                password: oldpwd
            };
            $.ajax({
                method: "put",
                url: "/wnl/account/"+user,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(param),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    alert("修改密码成功");
                    hidecgpwd();
                },
                error: function (error) {
                    try{
                        alert('修改密码失败：'+error.responseJSON.Msg);
                    }catch(e) {
                        alert('修改密码失败，请重新提交！');
                    }
                }
            });
        }else{
            alert("两次新密码不一致!");
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
            console.log(data);
            if($('#autoLogin').length>0 && $('#autoLogin input').is(':checked')){
                var name = $('#autoLogin').data('name');
                localStorage[name]=user;
            }
            $this.parent().find('.ns_msg').text('验证成功，可以上网').css('color', '#68d68f').show();
            setTimeout(function(){
                $this.parent().find('.ns_msg').fadeOut();
            }, 5000);
            if((data.pn=='15914') && ispc){
                window.location.href = '/user/'+user+'?token='+data.token+'&code='+data.Code+'&pn='+data.pn+'&ssid='+data.ssid;
            }else{
                window.location.href = ( (!$this.data('url')) ? urlChange(firsturl, urlparam) : $this.data('url') );
            }
        },
        complete: function(xmlhttp, status){
            console.log(xmlhttp);
            if(status=='timeout'){   // 超时,status还有success,error等值的情况
                $this.parent().find('.ns_msg').text('请求超时，请重新登录').css('color', '#ef635c').show();
                setTimeout(function(){
                    $this.parent().find('.ns_msg').fadeOut();
                }, 5000);
            }
            $this.text('登录').attr('disabled', false);
        },
        error: function (error) {
            var err = error.responseJSON;
            try{
                console.log(ispc);
                if((err.Code==428) && (err.downMacs==1)){
                    dmList(err.macs);
                }else if((err.pn=='15914') && ispc){
                    window.location.href = '/user/'+user+'?token='+err.Token+'&code='+err.Code+'&pn='+err.pn+'&ssid='+err.ssid;
                }else{
                    alert('验证失败：'+err.Msg);
                }
            }catch(e) {
                alert('验证失败，请重新登录！');
            }
        }
    });
}
function dmList(macs){
    for(var h='',i= 0,len=macs.split(',').length;i<len; i++){
        var $m = (len>1 ? macs.split(',')[i] : macs);
        h+='<label><input type="checkbox" checked /><span class="mac">'+$m+'</span></label>';
    }
    $('.dmlist').html(h);
    $('.ns_dmc').fadeIn();
}
function downMacs(obj){
    $.ajax({
        method: "delete",
        url: "/account",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (data) {
            console.log(data);
            $('.ns_dmc').fadeOut('normal', function(){
                alert("请在5秒后重新认证!");
            });
        },
        error: function (error) {
            console.log(error);
            alert("下线失败");
        }
    });
}

//验证码倒计时
var canyzm = true;//判断倒计时是否结束;
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
//function delayYZMMbo($this){
//    var delay = $this.find('span').text();
//    var t = setTimeout(_delayYZM($this), 1000);
//    if(delay>1){
//        console.log(delay+'haha');
//        delay--;
//        $this.find('span').text(delay);
//        return false;
//    }else{
//        console.log(delay);
//        clearTimeout(t);
//        //if(typeof(callback)=="function") callback();
//        $this.html('获取验证码').attr('disabled', false);
//        return true;
//    }
//}
//function _delayYZM($this){
//    return function (){
//        delayYZMMbo($this);
//    }
//}

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
