// JavaScript Document

$(document).ready(function(e) {
	var $arr = {};
	var $oldpwd = "";

    $(document).on('focus', '.fdpwd', function(){
		$oldpwd = $(this).val();
	});
	
	//加盟信息
	$('#clientmsg').click(function(){
		var $atten = $('#atten').val();
		var $tel = $('#tel').val();
		var $addr = "";
        var $selpro = $('#selpro option:selected').text();
        var $selcity = $('#selcity option:selected').text();
        var $selarea = $('#selarea option:selected').text();
		var $addrDet = $('#addrDet').val();
        var $openid = $('#openid').val();

        $addr = $selpro+$selcity+$selarea+$addrDet;
		
		var pattern = /^1\d{10}$/;   //检测电话号码有效性
		
		if($atten=="" || $atten==null){
			alert("请输入联系人！");
		}else if($tel=="" || $tel==null){
			alert("请输入联系电话！");
		}else if(!pattern.test($tel)){
			alert("请输入有效的联系电话");
		}else if($addrDet=="" || $addrDet==null){
			alert("请输入详细地址！");
		}else{
			$.ajax({
				type: "POST",
				url: "/holder/",
				data: {realname:$atten, mobile:$tel, address:$addr, openid:$openid},
				success: function (msg) {
					if(msg.Code == 200){
						alert("提交成功");
						$('#atten').val("");$('#tel').val("");$('#addrDet').val("");
					}else{
						alert(msg.Msg);
					}
				}
			})
		}
	});

    //新增房间号
    $(document).on('change', '.ronum', function(){
        var $room = $(this).val();

        var pattern = /^\d{1,4}$/;
        $room = FormatNum($room,4);

        if($room == "" || $room == null || $room=='0000'){
            alert("密码不能为空");
        }else if(!pattern.test($room)){
            alert("请输入4位数字房间号！");
            $(this).val("");
            return false;
        }else if($.inArray($room, allRooms()) != -1){
            alert("房间号已经存在，请输入其他房间号！");
            return false;
        }else{
            $(this).val($room);
        }
    });
	
	//禁用租户上网状态
    $(document).on('click', '.usable', function(){
        var $room = $(this).parent().parent().find('td:first').html();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).siblings("div").html();

        if ($(this).hasClass("frozen")) {
            $(this).siblings("div").html($mask & 1073741823);   //30位致0，可使用
            $mask = $(this).siblings("div").html();

            $(this).removeClass("frozen");

            if ($(this).parent().parent().find('td:eq(3) input').length > 0) {
                var $ends = $(this).parent().parent().find('td:eq(3) input').val();
                addData($arr, $room, $pwd, $date, $mask, $ends);
                ajaxSubmit($arr);
            }else{
                addData($arr, $room, $pwd, $date, $mask);
                ajaxSubmit($arr);
            }
        } else if (confirm("是否确定禁用该用户？")){
            $(this).siblings("div").html($mask | 1 << 30);   //30位致1，禁用
            $mask = $(this).siblings("div").html();

            $(this).addClass("frozen");

            if ($(this).parent().parent().find('td:eq(3) input').length > 0) {
                var $ends = $(this).parent().parent().find('td:eq(3) input').val();
                addData($arr, $room, $pwd, $date, $mask, $ends);
                ajaxSubmit($arr);
            }else{
                addData($arr, $room, $pwd, $date, $mask);
                ajaxSubmit($arr);
            }
        }
	});

    //可用终端数更改
    $(document).on('change', '.ends', function(){
        var $room = $(this).parent().parent().find('td:first').html();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();

        var $ends = $(this).val();

        if ($(this).parent().parent().find('td:first input').length > 0) {
            return false;
        }else{
            addData($arr, $room, $pwd, $date, $mask, $ends);

            ajaxSubmit($arr);
        }
    });

    //到期时间更改
    $(document).on('change', '.datepicker', function(){
        var $room = $(this).parent().parent().find('td:first').html();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();

        if ($(this).parent().parent().find('td:first input').length > 0) {
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

	//房间密码更改
    $(document).on('change', '.fdpwd', function(){
        var $room = $(this).parent().parent().find('td:first').html();
        var $pwd = $(this).val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();

        var pattern = /^[a-zA-Z0-9]{4,8}$/;

        if (!pattern.test($pwd)) {
            alert("请输入4-8位数字英文密码！");
            $(this).val($oldpwd);
            $pwd = $(this).val();
            return false;
        } else if ($(this).parent().parent().find('td:first input').length > 0) {
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
    $(document).on('click', '.case', function(){
        var $room = $(this).parent().parent().find('td:first input').val();
        var $pwd = $(this).parent().parent().find('td:eq(1) input').val();
        var $date = $(this).parent().parent().find('td:eq(2) input').val();
        var $ends = $(this).parent().parent().find('td:eq(3) input').val();
        var $mask = $(this).parent().parent().find('td:eq(4) div').html();
        var $current_date = $('#curent_date').val();     //当前时间

        if($room=="" || $room==null){
            alert("请输入房间号！");
            return false;
        }else if ($pwd=="" || $pwd==null){
            alert("请输入密码！");
            return false;
        }else{
            addData($arr, $room, $pwd, $date, $mask, $ends);

            ajaxSubmit($arr);

            var h = '<tr>' +
                '<td><input type="text" class="ronum" value="" placeholder="请输入房间号" /></td>' +
                '<td><input type="text" class="fdpwd" value="" placeholder="请输入密码" /></td>' +
                '<td><input type="date" class="datepicker" value="'+ $current_date +'" /></td>' +
                '<td><input type="number" class="ends" value="2" min="1" /></td>' +
                '<td><input type="button" class="case" value="提交" />' +
                '<div class="hid">258</div>' +
                '</td></tr>';

            $(this).parent().parent().before(h);

            $(this).parent().parent().find('td:first').html($room);
            $(this).val("禁用").attr('class', 'usable');
        }
    });

	//提交所有更新信息
	$('#subAll').click(function(){
		var str = $('#wrapper .wtext h1').html();
		var $length =  str.length;
		var index = str.indexOf('(');
		var id = str.substring(index+1, $length-1);

        $.ajax({
            type: "PUT",
            url: "/holder/" + id + "/room",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(GetFDData($arr)),
            dataType: "json",
            success: function (msg) {
                if (msg.Code == 200) {
                    alert("提交成功");
                    $arr = {};
                    submitDisable();
                } else {
                    alert(msg.Msg);
                }
            },
            error: function(msg){
                alert("error");
            }
        })
	});

	//提交登陆信息
    $('#sublogin').click(function(){
		var $user = $('#user').val();
		var $pwd = $('#password').val();
        var interval;

        var pattern = /^[\w]+$/;

        if($user==""  || $user==null){
            $.MsgBox.WXbox("请输入门牌号/电脑上网账号！");
            return false;
		}else if(!pattern.test($pwd)){
            $.MsgBox.WXbox("密码仅支持数字和英文");
            return false;
		}else{
			$.ajax({
				type: "POST",
				url: "/account",
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify(PortalData()),
				dataType: "json",
                beforeSend: function () {
                    // 禁用按钮防止重复提交
                    $("#sublogin").attr({ disabled: "disabled" });

                    $(".loading").show();
                    $(".loading .expand").addClass("expand99");
                    $('.expand #count').addClass("count");

                    var $c = $('#count');
                    var current = 0;
                    interval = setInterval(function(){
                        current++;
                        $c.html(current + '%');
                        if (current == 99 || !($c.parent().hasClass('expand99'))) {
                            clearInterval(interval);
                        }
                    }, 100);
                },
				success: function (msg) {
					if(msg.Code == 200){
                        clearInterval(interval);
                        $('.expand').removeClass("expand99").css("width", "100%");
                        $('.expand #count').html("100%").css("left", 237).removeClass('count');
                        setTimeout(function(){
                            window.location.href= "http://www.bidongwifi.com/account/"+msg.User+"?token="+msg.Token;
                        }, 1000);
					}else{
                        alert(msg.Msg);
					}
				},
                complete: function () {
                    $("#sublogin").removeAttr("disabled");
                },
				error: function (msg) {
                    $(".loading").hide();
                    alert(msg.responseJSON.Msg);
				}
			});
		}
	});

    $('#sub').click(function(){
        var $user = $('#user').val();
        var $pwd = $('#password').val();

        if($user==""  || $user==null){
            $.MsgBox.WXbox("请输入门牌号/电脑上网账号！");
            return false;
        }else if($pwd=="" || $pwd==null){
            $.MsgBox.WXbox("请输入密码");
            return false;
        }else{
            $.ajax({
                type: "POST",
                url: "/account",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(GetJsonData()),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        window.location.href= "/account/"+msg.User+"?token="+msg.Token;
                    }else{
                        $.MsgBox.WXbox(msg.Msg);
                    }
                },
                error: function (msg) {
                    $.MsgBox.WXbox(msg.responseJSON.Msg);
                }
            });
        }
    });

    //兑换上网时长
    $('#rechargeOnline').click(function(){
        var user = $('#user').val();
        var token = $('#token').val();
        var room = $('#room').val();
        var password = $('#password').val();

        $.ajax({
            type: "POST",
            url: "account/"+user+"/bind",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(rechargeData(room, password, token)),
            dataType: "json",
            success: function (msg) {
                if(msg.Code == 200){
                    var _html = msg.days+'天 + ' +msg.hours+'小时';
                    $('#canustime').html(_html);
                    $('#room').val("");$('#password').val("");
                }else{
                    $.MsgBox.WXbox("请检查输入信息是否有误！");
                }
            },
            error: function (msg) {
                $.MsgBox.WXbox("兑换失败");
            }
        });
    });
});

function rechargeData(room, password, token){
    var obj = {
        "room": room,
        "password": password,
        "token": token
    };

    return obj;
}

function addData(arr, room, pwd, date, mask, ends){
    if(arguments.length > 5){
        if(!(arr[room])){
            arr[room] = {};
            arr[room].password = pwd;
            arr[room].expire_date = date;
            arr[room].ends = ends;
            arr[room].mask = parseInt(mask);
        }else{
            arr[room].password = pwd;
            arr[room].expire_date = date;
            arr[room].ends = ends;
            arr[room].mask = parseInt(mask);
        }
    }else{
        if(!(arr[room])){
            arr[room] = {};
            arr[room].password = pwd;
            arr[room].expire_date = date;
            arr[room].mask = parseInt(mask);
        }else{
            arr[room].password = pwd;
            arr[room].expire_date = date;
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

function GetJsonData(){
    var $user = $('#user').val();
    var $password =  $('#password').val();

    var jsonObj = {
        "user": $user,
        "password": $password
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
    var str = $('#wrapper .wtext h1').html();
    var $length =  str.length;
    var index = str.indexOf('(');
    var id = str.substring(index+1, $length-1);

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
                alert(msg.Msg);
            }
        },
        error: function(msg){
            alert("error");
        }
    });
}

function urlChange(url){
	if(document.getElementById("txtHint")==undefined){
		alert("请登录！");
	}else{
		var s = document.getElementById("txtHint").innerHTML;
		var t = document.getElementById("anToken").value;
		window.location.href = url+s+"?token="+t;
	}
}

/*function randomString() {
	len = 8;
　　	var $chars = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ';
　　	var maxPos = $chars.length;
　　	var pwd = '';
　　	for (i = 0; i < len; i++) {
　　　　	pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　	}
　　	return pwd;
}*/



