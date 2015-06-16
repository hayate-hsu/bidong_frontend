// JavaScript Document

$(window).load(function() {
    $('section').eq(0).show();
    shCheckFunc(0);
});

$(document).ready(function(e) {
    var arrList = [];
    var orrList = [];
    var arr = [];     //房东管理-提交前保存的对象数组

    //后台房东管理、AP管理切换
    $('nav a').click(function(){
        var index = $(this).parent().index();
        $('section').hide().eq(index).show();
        $('nav a').removeClass("actived");
        $(this).addClass("actived");

        if(index==0){
            shCheckFunc(0);
        }
    });

    //房东管理-过滤条件-审核
    $('#shCheck').change(function(){
        var sh = $(this).val();
        shCheckFunc(sh);
    });

    //绑定
    $('#bindCheck').click(function(){
        var _html = "<tr><th>ID</th><th>MAC</th></tr>", id="", mac="", t="";
        $('section table :checkbox').each(function(index, element){
            if(element.checked){
                id = $(this).parent().parent().find('td:eq(1)').html();
                mac = $(this).parent().parent().find('td:eq(3)').html();
                t += "<tr><td>"+id+"</td><td>"+mac+"</td></tr>";
            }
        });
        if(t==""){
            $.MsgBox.Alert("需要勾选至少一个选项！");
        }else{
            _html += t;
            $('#asAP table').empty().append(_html);
            $('#asAP').show();
        }
    });
    $('#asAP .closed').click(function(){
        $('#asAP').hide();
        $('#asAP table').empty();
    });

    //展开加载房间管理
    $(document).on("click", '.slideH', function() {
        var t = $(this);
        var id = $(this).parent().parent().find('td:first-child').html();

        $.ajax({
            type: "GET",
            url: "/manager/holder?holder="+id,
            success: function (msg) {
                if(msg.Code == 200){
                    var d="";

                    if(!(msg.Rooms)){
                        d = "";
                    }else{
                        for(var j=0; j<msg.Rooms.length; j++) {
                            orrList.push(msg.Rooms[j]);
                            var r = '<li><input type="text" value="'+ msg.Rooms[j] +'" placeholder="输入4位数字房间号" disabled="disabled" /></li>';
                            d += r;
                        }
                    }

                    var hroom = '<tr class="hroom">' +
                        '<td colspan="5">' +
                        '<div class="room">' +
                        '<h4>添加房间</h4>' +
                        '<ul>' +
                        d +
                        '<li><input type="text" value="" placeholder="输入4位数字房间号" /></li>' +
                        '</ul>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';

                    if ($(this).parent().next().hasClass('hroom')) {
                        $('.hroom').remove();
                        arrList = [];
                    } else {
                        $('.hroom').remove();
                        arrList = [];
                        arrList = orrList;
                        t.parent().after(hroom);
                    }

                    $('.room li').css("background", getColor);
                }else{
                    $.MsgBox.Alert(msg.Msg);
                }
            },
            error: function(msg){
                $.MsgBox.Alert("没有数据");
            }
        });

    });

	//$('.room li').css("background", getColor);

	//增加房间判断规则
    $(document).on("change", '.room li input', function(){
        //var num=$(this).parent().nextAll().length, max=$('.room ul li').length;
		var pattern = /^\d{1,4}$/;
		var r = $(this).val();
        r = FormatNum(r,4);
		if(r == "" || r == null || r=='0000'){
			alert("房间号不能为空");
            return false;
		}else if(!pattern.test(r)){
			alert("请输入4位数字房间号！");
            $(this).val("");
			$(this).focus();
            return false;
		}else if($.inArray(r, arrList) != -1){
			alert("房间号已经存在，请输入其他房间号！");
			$(this).focus();
            return false;
		}else{
            $(this).val(r).attr("disabled", "disabled");
            var h = '<li><input type="text" value="" placeholder="输入4位数字房间号" /></li>';
            $('.room ul').append(h);
            $(this).parent().next().css("background", getColor);
            arrList.push(r);
        }
	});

	//增加删除控件
    $(document).on("hover", '.room li', function(event){
		if(event.type=='mouseenter'){
			var a = '<a href="javascript:void(0)">X</a>';
			$('.room li a').remove();
			$(this).append(a);
		}else{
			$('.room li a').remove();
		}
	});

	//删除房间号
    $(document).on("click", '.room li a', function(){
		var r = $(this).prev("input").val();
		var index = $.inArray(r, arrList);
		arrList.splice(index, 1);
		$(this).parent().remove();
	});

    //添加房东
    $('#addHolder').click(function(){
        var lxr = $('#lxr').val();
        var lxdh = $('#lxdh').val();
        var xxdz = $('#xxdz').val();
        var dqsj = $('#dqsj').val();

        if(lxr=="" || lxr==null){
            showError("填写联系人");$('#lxr').focus();
        }else if(lxdh=="" || lxdh==null){
            showError("填写联系电话");$('#lxdh').focus();
        }else if(xxdz=="" || xxdz==null){
            showError("填写详细地址");$('#xxdz').focus();
        }else if(dqsj=="" || dqsj==null){
            showError("填写截止时间");
        }else{
            $.ajax({
                type: "POST",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(addHolderData(lxr, lxdh, xxdz, dqsj)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        var t,h;
                        h = '<tr>'+
                                '<td>'+msg.Holders[i].id+'</td>'+
                                '<td><input type="text" class="realnamebtn" value="'+msg.Holders[i].realname+'" /><div class="hidden">'+msg.Holders[i].mask+'</div></td>'+
                                '<td><input type="text" class="mobilebtn" value="'+msg.Holders[i].mobile+'" /></td>'+
                                '<td><input type="text" class="addressbtn" value="'+msg.Holders[i].address+'" /></td>'+
                                '<td><input type="text" class="dpicker" value="'+msg.Holders[i].expire_date+'" /></td>'+
                                '<td><a href="javascript:void(0);" class="folH">冻结</a><span>|</span><a href="javascript:void(0);" class="delH">删除</a><span>|</span><a href="javascript:void(0);" class="chbH">审核</a></td>'+
                                '</tr>';
                        t += h;
                        $('table tr:eq(1)').before(t);
                        $('#lxr').val("");$('#lxdh').val("");$('#xxdz').val("");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                }
            });
        }
    });

    //房东管理-冻结用户
    $(document).on('click', '.folH', function(){
        var $t = $(this);
        $.MsgBox.Confirm("是否确定要冻结该用户？", function(){
            var drr=[], num=1, idx=5, n;
            var id = $t.parent().parent().find("td:first-child").text();
            var mask = $t.parent().parent().find('td:eq(1) div').text();
                mask = mask | 1<<30;

            if(arr.length>0){
                $(arr).each(function(index){       //遍历arr
                    var v = arr[index];          //arr[index]，index多条数据
                    if(v.id == id){
                        drr.push(v);
                        n = index;
                    }
                });
            }

            changeData(drr, id, mask, num, idx);
            arr.splice(n,1);                    //删除已提交的数据

            $.ajax({
                type: "PUT",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(roomData(drr)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        $t.parent().parent().find('td').each(function(n){
                            $(this).addClass('fol');
                            if($(this).find('input').length>0){
                                $(this).find('input').attr("disabled", "disabled");
                            }
                        });
                        $t.parent().parent().find('td:eq(1) div').text(mask);
                        $t.html("解冻").addClass("unfolH").removeClass("folH");
                        $.MsgBox.Alert("账号已冻结");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function(msg){
                    $.MsgBox.Alert("提交失败");
                }
            });
        })
    });

    //房东管理-解冻用户
    $(document).on('click', '.unfolH', function(){
        var $t = $(this), drr = [], num=0, idx=5;
        var id = $t.parent().parent().find("td:first-child").text();
        var mask = $t.parent().parent().find('td:eq(1) div').text();
            mask = mask & (~(1<<30));

        changeData(drr, id, mask, num, idx);

        $.ajax({
            type: "PUT",
            url: "/manager/holder",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(roomData(drr)),
            dataType: "json",
            success: function (msg) {
                if(msg.Code == 200){
                    $t.parent().parent().find('td').each(function(n){
                        $(this).removeClass('fol');
                        if($(this).find('input').length>0){
                            $(this).find('input').removeAttr("disabled");
                        }
                    });
                    $t.parent().parent().find('td:eq(1) div').text(mask);
                    $t.html("冻结").addClass("folH").removeClass("unfolH");
                    $.MsgBox.Alert("账号已解冻");
                }else{
                    $.MsgBox.Alert(msg.Msg);
                }
            },
            error: function(msg){
                $.MsgBox.Alert("提交失败");
            }
        });
    });

    //删除用户
    $(document).on('click', '.delH', function(){
        var $t = $(this);
        var id = $t.parent().parent().find('td:first-child').text();

        $.MsgBox.Confirm("是否确定删除该用户？", function () {
            $.ajax({
                type: "DELETE",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(delHolderData(id)),
                success: function(msg){
                    if(msg.Code == 200){
                        $t.parent().parent().remove();
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
    });

    //房东管理-提交
    $(document).on('click', '#subH', function(){
        console.log(arr);

        $.ajax({
            type: "PUT",
            url: "/manager/holder",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(roomData(arr)),
            dataType: "json",
            success: function (msg) {
                if(msg.Code == 200){
                    $.MsgBox.Alert("提交成功");
                    arr = [];
                }else{
                    $.MsgBox.Alert(msg.Msg);
                }
            },
            error: function(msg){
                $.MsgBox.Alert("提交失败");
            }
        });
    });

    //房东管理-审核
    $(document).on('click', '.chbH', function(){
        var d = $(this).parent().parent().find("td:eq(4) input").val();
        if(d){
            var $t=$(this), drr=[], num=1, idx=0, n;
            var id = $t.parent().parent().find("td:first-child").text();
            var mask = $t.parent().parent().find('td:eq(1) div').text();
                mask = mask|1;

            if(arr.length>0){
                $(arr).each(function(index){       //遍历arr
                    var v = arr[index];          //arr[index]，index多条数据
                    if(v.id == id){
                        drr.push(v);
                        n = index;
                    }
                });
            }

            changeData(drr, id, mask, num, idx);
            arr.splice(n,1);                    //删除已提交的数据

            $.ajax({
                type: "PUT",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(roomData(drr)),
                dataType: "json",
                success: function (msg) {
                    if (msg.Code == 200) {
                        $t.html("冻结").addClass("folH").removeClass("chbH");
                        $t.parent().parent().addClass("ysh");
                        $.MsgBox.Alert("审核成功");
                    } else {
                        $.MsgBox.Alert("没有数据");
                    }
                },
                error: function (msg) {
                    $.MsgBox.Alert("请求失败");
                }
            });
        }
    });

    //房东管理-联系人、联系电话、地址、到期时间更改
    $(document).on("change", '.realnamebtn, .mobilebtn, .addressbtn, .dpicker', function() {
        var id = $(this).parent().parent().find('td:first-child').text();
        var mask = $(this).parent().parent().find('td:eq(1) div').text();
        var num = $(this).val();
        var idx = $(this).parent().index();

        changeData(arr, id, mask, num, idx);
    });

});

function changeData(arr, id, mask, num, idx){    //arr需要提交的数据,   id:房东ID,   num:改动的数据，   idx：改动数据的位置（realname,expire_date,address）
    var orr = {}, drr = {};
    var flag = true;                       //判断arr中是否存在同一条ID数据的标记
    orr.id = drr.id = id;
    orr.mask = drr.mask = mask;
    orr.num = num;
    if(arr.length>0){                      //arr是否为空
        $(arr).each(function(index){       //遍历arr
            var val = arr[index];          //arr[index]，index多条数据
            if(val.id == orr.id){
                pushToArr(val, orr, idx);
                flag = false;
            }
        });
        if(flag){
            pushToArr(drr, orr, idx);
            arr.push(drr);
        }
    }else{
        pushToArr(drr, orr, idx);
        arr.push(drr);
    }
}

function pushToArr(a,b,i){    //b为旧数据，a为新数据
    switch(i){
        case 1:
            a.realname = b.num;
            break;
        case 2:
            a.mobile = b.num;
            break;
        case 3:
            a.address = b.num;
            break;
        case 4:
            a.expire_date  = b.num;
            break;
        case 5:
            a.frozen = b.num;
            break;
        default :
            a.verify = b.num;
    }
}

function roomData(a){
    var manager = $("#manager").val();
    var token = $("#token").val();

    var roomObj = {
        manager: manager,
        token: token,
        holders: a
    };
    return roomObj;
}

function addHolderData(realname, mobile, address, expire_date){
    var holderObj = {
        Realname: realname,
        Mobile: mobile,
        Address: address,
        Expire_date: expire_date
    };
    return holderObj;
}

function delHolderData(id){
    var manager = $("#manager").val();
    var token = $("#token").val();

    var roomObj = {
        manager: manager,
        token: token,
        id: id
    };
    return roomObj;
}

function shCheckFunc(verifyed){
    var manager = $("#manager").val();
    var token = $("#token").val();
    arr=[];

    $.ajax({
        type: "GET",
        url: "/manager/holder",
        data: {
            manager: manager,
            token: token,
            verified: verifyed
        },
        dataType: "json",
        success: function (msg) {
            if(msg.Code == 200){
                $('section:eq(0) table tr:not(:first)').remove();
                var h="", t="";
                if(verifyed==0){
                    for(var i=0; i<msg.Holders.length; i++){
                        h = '<tr>'+
                        '<td>'+msg.Holders[i].id+'</td>'+
                        '<td><input type="text" class="realnamebtn" value="'+msg.Holders[i].realname+'" /><div class="hidden">'+msg.Holders[i].mask+'</div></td>'+
                        '<td><input type="text" class="mobilebtn" value="'+msg.Holders[i].mobile+'" /></td>'+
                        '<td><input type="text" class="addressbtn" value="'+msg.Holders[i].address+'" /></td>'+
                        '<td><input type="text" class="dpicker" value="'+msg.Holders[i].expire_date+'" /></td>'+
                        '<td><a href="javascript:void(0);" class="chbH">审核</a><span>|</span><a href="javascript:void(0);" class="delH">删除</a></td>'+
                        '</tr>';
                        t += h;
                    }
                }else{
                    for(var i=0; i<msg.Holders.length; i++){
                        if((msg.Holders[i].mask>>30&1)==0){
                            h = '<tr>'+
                            '<td>'+msg.Holders[i].id+'</td>'+
                            '<td><input type="text" class="realnamebtn" value="'+msg.Holders[i].realname+'" /><div class="hidden">'+msg.Holders[i].mask+'</div></td>'+
                            '<td><input type="text" class="mobilebtn" value="'+msg.Holders[i].mobile+'" /></td>'+
                            '<td><input type="text" class="addressbtn" value="'+msg.Holders[i].address+'" /></td>'+
                            '<td><input type="text" class="dpicker" value="'+msg.Holders[i].expire_date+'" /></td>'+
                            '<td><a href="javascript:void(0);" class="folH">冻结</a><span>|</span><a href="javascript:void(0);" class="delH">删除</a></td>'+
                            '</tr>';
                            t += h;
                        }else {
                            h = '<tr>'+
                            '<td class="fol">'+msg.Holders[i].id+'</td>'+
                            '<td class="fol"><input disabled type="text" class="realnamebtn" value="'+msg.Holders[i].realname+'" /><div class="hidden">'+msg.Holders[i].mask+'</div></td>'+
                            '<td class="fol"><input disabled type="text" class="mobilebtn" value="'+msg.Holders[i].mobile+'" /></td>'+
                            '<td class="fol"><input disabled type="text" class="addressbtn" value="'+msg.Holders[i].address+'" /></td>'+
                            '<td class="fol"><input disabled type="text" class="dpicker" value="'+msg.Holders[i].expire_date+'" /></td>'+
                            '<td class="fol"><a href="javascript:void(0);" class="unfolH">解冻</a><span>|</span><a href="javascript:void(0);" class="delH">删除</a></td>'+
                            '</tr>';
                            t += h;
                        }
                    }
                }
                $('section:eq(0) table').append(t);
                $('.dpicker').datepicker({ dateFormat: 'yy-mm-dd' });
            }else{
                $.MsgBox.Alert("没有数据");
            }
        },
        error: function(msg){
            $.MsgBox.Alert("请求失败");
        }
    });
}

//function showPages(len){
//
//    var h="", n="", t="";
//    n = len/10+1;     //多少页
//    if(n>3){
//
//    }
//    for(var i=1; i<=n; i++){
//        h = '<input type="button" value="'+ i +'" class="ipusmall" />';
//        t += h;
//    }
//}