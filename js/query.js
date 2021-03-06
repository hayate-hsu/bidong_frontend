// JavaScript Document

$(document).ready(function(e) {
	var $arr = {};
	var $oldpwd = "", $oldend = "";
    var id = $('#user').html();

    $(document).on('focus', '.fdpwd', function(){
		$oldpwd = $(this).val();
	});

    //修改密码
    $('.changePwd').click(function(){
        var oldpwd = $('#oldpwd').val();
        var newpwd = $('#newpwd').val();
        var repwd = $('#repwd').val();
        var $user = $('#user').text();

        if(newpwd != repwd){
            showError("两次输入新密码不一致！");
        }else if(oldpwd == newpwd){
            showError("新旧密码相同，请重新设置！");
        }else{
            clearError();
            $.ajax({
                type: "PUT",
                url: "/account/"+$user,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(changePwdData(oldpwd, newpwd)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        $('.pwdbox').fadeOut();unmask('#shade');
                        $('#oldpwd').val("");$('#newpwd').val("");$('#repwd').val("");
                        $.MsgBox.Alert("修改成功");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function (msg) {
                    $.MsgBox.Alert(msg.responseJSON.Msg);
                }
            });
        }
    });

    //在线申请
    $('.applyok').click(function(){
        var $atten = $('#atten').val();
        var $tel = $('#tel').val();
        var $addr = "";
        var $selpro = $('#selpro option:selected').text();
        var $selcity = $('#selcity option:selected').text();
        var $selarea = $('#selarea option:selected').text();
        var $addrDet = $('#addrDet').val();

        $addr = $selpro+$selcity+$selarea+$addrDet;

        var pattern = /^1\d{10}$/;   //检测电话号码有效性

        if($atten=="" || $atten==null){
            showError("请输入联系人！");
        }else if($tel=="" || $tel==null){
            showError("请输入联系电话！");
        }else if(!pattern.test($tel)){
            showError("请输入有效的联系电话");$('#tel').focus();
        }else if($addrDet=="" || $addrDet==null){
            showError("请输入详细地址！");
        }else{
            clearError();
            $.ajax({
                type: "POST",
                url: "/holder/",
                data: {realname:$atten, mobile:$tel, address:$addr},
                success: function (msg) {
                    if(msg.Code == 200){
                        $.MsgBox.Alert("提交成功");
                        $('#atten').val("");$('#tel').val("");$('#addrDet').val("");
                        $('.addressbox').fadeOut();unmask("#shade");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function(msg){
                    $.MsgBox.Alert("请求失败");
                }
            })
        }
    });

	//禁用租户上网状态
    $(document).on('click', '.usable', function(){
        var $room = $(this).parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).siblings("div").html();

        var t = $(this);

        if (t.hasClass("frozen")) {
            t.siblings("div").html($mask & 1073741823);   //30位致0，可使用
            $mask = t.siblings("div").html();

            t.removeClass("frozen");

            if (t.parent().parent().find('td:eq(3) input').length > 0) {
                var $ends = t.parent().parent().find('td:eq(3) input').val();
                addData($arr, $room, $pwd, $date, $mask, $ends);
                ajaxSubmit($arr);
            }else{
                addData($arr, $room, $pwd, $date, $mask);
                ajaxSubmit($arr);
            }

            t.parent().parent().find('td').each(function(i){
                var d = t.parent().parent().find('td').eq(i);
                d.css("background","#fff");
                if(i<4){
                    if(d.find('input').length>0){
                        d.find('input').removeAttr('disabled');
                    }
                    if(d.find('a.btnaddNone').length>0){
                        d.find('a.btnaddNone').addClass('btnadd').removeClass('btnaddNone');
                    }
                    if(d.find('a.btnreduceNone').length>0){
                        d.find('a.btnreduceNone').addClass('btnreduce').removeClass('btnreduceNone');
                    }
                }
            });
        } else {
            $.MsgBox.Confirm("是否确定禁用该用户？", function () {

                t.siblings("div").html($mask | 1 << 30);   //30位致1，禁用
                $mask = t.siblings("div").html();

                t.addClass("frozen");

                if(t.parent().parent().find('td:eq(3) input').length > 0) {
                        var $ends = t.parent().parent().find('td:eq(3) input').val();
                        addData($arr, $room, $pwd, $date, $mask, $ends);
                        ajaxSubmit($arr);
                }else{
                    addData($arr, $room, $pwd, $date, $mask);
                    ajaxSubmit($arr);
                }

                t.parent().parent().find('td').each(function(i){
                    var d = t.parent().parent().find('td').eq(i);
                    d.css("background","#eee");
                    if(i<4){
                        if(d.find('input').length>0){
                            d.find('input').attr('disabled', 'disabled');
                        }
                        if(d.find('a.btnadd').length>0){
                            d.find('a.btnadd').addClass('btnaddNone').removeClass('btnadd');
                        }
                        if(d.find('a.btnreduce').length>0){
                            d.find('a.btnreduce').addClass('btnreduceNone').removeClass('btnreduce');
                        }
                    }
                });
            });
        }
	});

    //可用终端数更改
    $(document).on('click', '.clientbox .btnadd', function(){
        var $room = $(this).parent().parent().parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).parent().parent().parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().parent().parent().find('td:eq(4) div').html();

        $(this).addTM();

        var $ends = $(this).parent().find('input').val();

        addData($arr, $room, $pwd, $date, $mask, $ends);

        ajaxSubmit($arr);
    });

    $(document).on('click', '.clientbox .btnreduce', function(){
        var $room = $(this).parent().parent().parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).parent().parent().parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().parent().parent().find('td:eq(4) div').html();

        $(this).reduceTM();

        var $ends = $(this).parent().find('input').val();

        addData($arr, $room, $pwd, $date, $mask, $ends);

        ajaxSubmit($arr);
    });

    $(document).on('focus', '.clientbox .JV_Amount', function(){
        $oldend = $(this).val();
    });
    $(document).on('change', '.clientbox .JV_Amount', function(){
        var $room = $(this).parent().parent().parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).parent().parent().parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().parent().parent().find('td:eq(4) div').html();

        $(this).modifyTM($oldend);

        var $ends = $(this).val();

        addData($arr, $room, $pwd, $date, $mask, $ends);

        ajaxSubmit($arr);
    });

    //到期时间更改
    $(document).on('change', '.datepicker', function(){
        var $room = $(this).parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();

        if ($(this).parent().parent().find('td:eq(3) input').length > 0) {
            var $ends = $(this).parent().parent().find('td:eq(3) input').val();
            addData($arr, $room, $pwd, $date, $mask, $ends);
            ajaxSubmit($arr);
        } else {
            addData($arr, $room, $pwd, $date, $mask);
            ajaxSubmit($arr);
        }
    });

	//房间密码更改
    $(document).on('change', '.fdpwd', function(){
        var $room = $(this).parent().parent().find('td:first em.bd_room').text();
        var $pwd = $(this).val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();

        if (pwdCorrect($pwd)) {
            $.MsgBox.Alert("输入4-8位密码");
            $(this).val($oldpwd);
            return false;
        } else if ($(this).parent().parent().find('td:eq(3) input').length > 0) {
            var $ends = $(this).parent().parent().find('td:eq(3) input').val();
            addData($arr, $room, $pwd, $date, $mask, $ends);
            ajaxSubmit($arr);
        } else {
            addData($arr, $room, $pwd, $date, $mask);
            ajaxSubmit($arr);
        }
    });

    //添加房间信息
    $('.addbox .btnadd').click(function(){
        $(this).addTM();
    });
    $('.addbox .btnreduce').click(function(){
        $(this).reduceTM();
    });
    $('.addbox .JV_Amount').click(function(){
        $(this).modifyTM();
    });
    $(document).on('click', '.case', function(){
        var t = $(this);
        var $room = $('#room').val(), $pwd = $('#pwd').val(), $date = $('#sdate').val(), $ends = $('#ends').val(), $mask = $('#mask').val();

        var pattern = /^[\w\?%&=\-_]+$/;
        //$room = FormatNum($room,4);

        if(!pattern.test($room)){
            showError("输入数字或英文的房间号");
            $('#room').val("").focus();
        }else if($.inArray($room, allRooms()) != -1){
            showError("房间号已经存在，请输入其他房间号");
            $('#room').focus();
        }else if (pwdCorrect($pwd)){
            $('#room').val($room);
            showError("输入4-8位密码");
            $('#pwd').focus();
        }else if($date=="" || $date==null){
            showError("选择到期时间");
        }else{
            $('#room').val($room);
            clearError();
            addData($arr, $room, $pwd, $date, $mask, $ends);

            if(id==10000){
                var h = '<tr>' +
                    '<td title="'+(id+$room)+'"><div><em class="bd_host">'+id+'</em><em class="bd_room">'+$room+'</em></div></td>' +
                    '<td><input type="text" class="fdpwd" value="'+ $pwd +'" /></td>' +
                    '<td><input type="text" class="datepicker" value="'+ $date +'" /></td>' +
                    '<td><div class="amountbox"><div class="amount">' +
                    '<input type="text" value="'+ $ends +'" class="JV_Amount" />' +
                    '<a href="javascript:void(0);" class="btnadd">+</a>' +
                    '<a href="javascript:void(0);" class="btnreduce">-</a>' +
                    '</div></div></td>' +
                    '<td><input type="button" class="usable" value="禁用" /><span>|</span>' +
                    '<a href="javascript:void(0);" class="delete">删除</a>' +
                    '<div class="hid">'+ $mask +'</div>' +
                    '</td></tr>';

                $('.clientbox table tr:eq(0)').after(h);
                $('.datepicker').datetimepicker({dateFormat: 'yy-mm-dd', changeYear: true, stepMinute: 10});
                $arr = {};
                $('#room').val("");$('#pwd').val("");$('#pwd').val("");
                $(this).parent().parent().fadeOut();
                unmask('#shade');
            }else{
                $.ajax({
                    type: "PUT",
                    url: "/holder/" + id + "/room",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(GetFDData($arr)),
                    dataType: "json",
                    success: function (msg) {
                        t.attr("disabled", "disabled");
                        if (msg.Code == 200) {
                            var h = '<tr>' +
                                '<td title="'+(id+$room)+'"><div><em class="bd_host">'+id+'</em><em class="bd_room">'+$room+'</em></div></td>' +
                                '<td><input type="text" class="fdpwd" value="'+ $pwd +'" /></td>' +
                                '<td><input type="text" class="datepicker" value="'+ $date +'" /></td>' +
                                '<td><div class="amountbox"><div class="amount">' +
                                '<input type="text" value="'+ $ends +'" class="JV_Amount" />' +
                                '<a href="javascript:void(0);" class="btnadd">+</a>' +
                                '<a href="javascript:void(0);" class="btnreduce">-</a>' +
                                '</div></div></td>' +
                                '<td><input type="button" class="usable" value="禁用" /><span>|</span>' +
                                '<a href="javascript:void(0);" class="delete">删除</a>' +
                                '<div class="hid">'+ $mask +'</div>' +
                                '</td></tr>';

                            $('.clientbox table tr:eq(0)').after(h);
                            $('.datepicker').datetimepicker({dateFormat: 'yy-mm-dd', changeYear: true, stepMinute: 10});
                            $arr = {};
                            $('#room').val("");$('#pwd').val("");
                            t.parent().parent().fadeOut();
                            unmask('#shade');
                            t.removeAttr('disabled');
                        } else {
                            $.MsgBox.Alert(msg.Msg);
                        }
                    },
                    error: function(msg){
                        $.MsgBox.Alert("请求失败");
                    }
                });
            }
        }
    });
	
	//提交登陆信息
    $('#sub').click(function(){
		var $user = $('#user').val();
		var $pwd = $('#password').val();
		
		if($user==""  || $user==null){
            showError("请输入门牌号/电脑上网账号！");$('#user').focus();
		}else if($pwd=="" || $pwd==null){
            showError("请输入密码");$('#password').focus();
		}else{
            $('span.errorMsg').html("");
			$.ajax({
				method: "POST",
				url: "/account",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify(GetJsonData($user, $pwd)),
				dataType: "json"
			}).done(function(data){
                if(data.Code == 200){
                    window.location.href= "/account/"+data.User+"?token="+data.Token;
                }else{
                    $.MsgBox.Alert(data.Msg);
                }
            }).fail(function(error){
                //$.MsgBox.Alert(error.responseJSON.Msg);
                $.MsgBox.Alert('连接失败，请检查网络是否已连接');
            });
		}
	});

    //提交登陆信息
    $('#protallogin').click(function(){
        var $user = $('#user').val();
        var $pwd = $('#password').val();

        var pattern = /^[\w]+$/;         //+号必须有输入  *号可以没有输入

        if($user==""  || $user==null){
            showError("请输入门牌号/电脑上网账号！");
            $('#user').focus();
            return false;
        }else if(!pattern.test($pwd)){
            showError("密码仅支持数字和英文！");
            $('#password').focus();
            return false;
        }else{
            $('span.errorMsg').html("");
            $.ajax({
                type: "POST",
                url: "/account",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(PortalData()),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        window.location.href= "http://www.bidongwifi.com/account/"+msg.User+"?token="+msg.Token;
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function (msg) {
                    $.MsgBox.Alert(msg.responseJSON.Msg);
                }
            });
        }
    });

    //删除房间号
    $(document).on('click', '.delete', function(){
        var room = $(this).parent().parent().find('td:eq(0)').text();
        var id = $('#user').html();

        var t = $(this);

        if(id==10000){
            $.MsgBox.Confirm("是否确定删除该用户？", function () {
                t.parent().parent().remove();
                $.MsgBox.Alert("删除成功！");
            });
        }else{
            $.MsgBox.Confirm("是否确定删除该用户？", function () {
                $.ajax({
                    type: "DELETE",
                    url: "/holder/" + id + "/room",
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(DeleteFDData(room)),
                    success: function(msg){
                        if(msg.Code == 200){
                            t.parent().parent().remove();
                            $.MsgBox.Alert("删除成功！");
                        }else{
                            $.MsgBox.Alert("删除失败！");
                        }
                    },
                    error: function(msg){
                        $.MsgBox.Alert("请求失败！");
                    }
                })
            });
        }
    });
});

function changePwdData(oldpwd, newpwd){
    var $token = $('#fdtoken').text();

    var $obj = {
        token: $token,
        password: oldpwd,
        newp: newpwd
    };

    return $obj;
}

function addData(arr, room, pwd, date, mask, ends){
    if(arguments.length > 5){
        if(!(arr[room])){
            arr[room] = {};
            arr[room].password = pwd;
            arr[room].expired = date;
            arr[room].ends = ends;
            arr[room].mask = parseInt(mask);
        }else{
            arr[room].password = pwd;
            arr[room].expired = date;
            arr[room].ends = ends;
            arr[room].mask = parseInt(mask);
        }
    }else{
        if(!(arr[room])){
            arr[room] = {};
            arr[room].password = pwd;
            arr[room].expired = date;
            arr[room].mask = parseInt(mask);
        }else{
            arr[room].password = pwd;
            arr[room].expired = date;
            arr[room].mask = parseInt(mask);
        }
    }
}

function GetFDData(arr){
	var t = $('#fdtoken').html();
	
	var $obj = {};
	$obj["rooms"] = arr;
	$obj["token"] = t;
	
	return $obj;	
}

function DeleteFDData(room){
    var t = $('#fdtoken').html();

    var $obj = {};
    $obj["room"] = room;
    $obj["token"] = t;

    return $obj;
}

function GetJsonData(user, pwd){
	var jsonObj = {
		user: user,
		password: pwd
	};
	
	return jsonObj;
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

function ajaxSubmit(arr){
    var id = $('#user').html();

    if(id==10000){
        return;
    }else{
        $.ajax({
            type: "PUT",
            url: "/holder/" + id + "/room",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(GetFDData(arr)),
            dataType: "json",
            success: function (msg) {
                if (msg.Code == 200) {
                    $arr = {};
                } else {
                    $.MsgBox.Alert(msg.Msg);
                }
            },
            error: function(msg){
                $.MsgBox.Alert("请求失败");
            }
        });
    }
}
