// JavaScript Document

$(window).load(function() {
    $('section').eq(0).show();
    shCheckFunc(0, 1);
});

$(document).ready(function(e) {
    var arrList = [];
    var orrList = [];
    var arr = [];     //房东管理-提交前保存的对象数组
    var ap  = [];     //AP管理-MAC地址数组
    var ides = [];    //AP管理-绑定index位置
    var menuIndex = 0;

    //房东管理、AP管理切换
    $('nav a').click(function(){
        var index = $(this).parent().index();
        $('section').hide().eq(index).show();
        $('nav a').removeClass("actived");
        $(this).addClass("actived");

        if(index==0){
            $('#shCheck option:eq(0)').prop("selected", "selected");
            shCheckFunc(0, 1);
        }else{
            arr=[];
        }

        menuIndex = index;

        console.log(menuIndex);
    });

    //房东管理-过滤条件-审核
    $('#shCheck').change(function(){
        var sh = $(this).val();
        shCheckFunc(sh, 1);
    });

    //翻页
    $(document).on('click', '.ipusmall', function(){    //跳转到指定页
        var sh = $('#shCheck').val();
        var page = $(this).text();
        shCheckFunc(sh, parseInt(page));
    });
    $(document).on('click', '.phead', function(){       //跳转到首页
        var sh = $('#shCheck').val();
        shCheckFunc(sh, 1);
    });
    $(document).on('click', '.pfoot', function(){       //跳转到尾页
        var sh = $('#shCheck').val();
        var max = $('#footPage').val();  //房东管理-最后一页
        shCheckFunc(sh, parseInt(max));
    });
    $(document).on('click', '.next', function(){        //跳转到下一页
        var sh = $('#shCheck').val();
        var page = $('.ipunone').text();
        var max = $('#footPage').val();
        page = parseInt(page)+1;
        if(page>parseInt(max)){
            page = max;
        }
        shCheckFunc(sh, page);
    });
    $(document).on('click', '.prev', function(){        //跳转到上一页
        var sh = $('#shCheck').val();
        var page = $('.ipunone').text();
        page = parseInt(page)-1;
        if(page<1){
            page = 1;
        }
        shCheckFunc(sh, page);
    });

    //AP管理-AP绑定
    $('#bindCheck').click(function(){
        var _html = "<tr><th>MAC</th></tr>", mac="", t="";
        ap = []; ides = [];
        $('section table :checkbox').each(function(index, element){
            if(element.checked){
                mac = $(this).parent().parent().find('td:eq(2)').html();
                t += "<tr><td>"+mac+"</td></tr>";
                ap.push(mac);
                ides.push(index+1);
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
        $(this).parent().find('input').val("");
        $('#asAP').hide();
        $('#asAP table').empty();
        ap = [];
    });
    $('#bindToH').click(function(){
        var $t = $(this);
        var holder = $t.parent().siblings("p").find("input").val();

        $.ajax({
            type: "PUT",
            url: "/manager/bind_ap",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(bindData(ap, holder)),
            dataType: "json",
            success: function (msg) {
                if(msg.Code == 200){
                    for(var i=0; i<=ides.length; i++){
                        $('section:eq(1) table tr').eq(ides[i]).find('td:eq(1)').text(holder);
                    }
                    $.MsgBox.Alert("绑定成功");
                    $t.parent().siblings("p").find("input").val("");
                    $('#asAP').hide();
                    ap = [];
                }else{
                    $.MsgBox.Alert(msg.Msg);
                }
            },
            error: function(msg){
                $.MsgBox.Alert("绑定失败");
            }
        });
    });

    //AP管理-AP解绑
    $(document).on('click', '.polH', function(){
        ap = [];
        var $t = $(this);
        var holder = $t.parent().parent().find("td:eq(1)").text();
        var mac = $t.parent().parent().find("td:eq(2)").text();
        ap.push(mac);

        $.MsgBox.Confirm("是否确定解绑该MAC？", function () {
            $.ajax({
                type: "PUT",
                url: "/manager/unbind_ap",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(bindData(ap, holder)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        $.MsgBox.Alert("解绑成功");
                        $t.parent().parent().find("td:eq(1)").html("");
                        ap = [];
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function(msg){
                    $.MsgBox.Alert("解绑失败");
                }
            });
        });
    });

    //AP管理-AP删除
    $(document).on('click', '.delapH', function(){
        ap = [];
        var $t = $(this);
        var mac = $t.parent().parent().find("td:eq(2)").text();
        ap.push(mac);

        $.MsgBox.Confirm("是否确定删除该用户？", function () {
            $.ajax({
                type: "DELETE",
                url: "/manager/ap",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(apData(ap)),
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

    //AP管理-AP搜索
    $("#apSearch").click(function(){
        var manager = $("#manager").val();
        var token = $("#token").val();
        var s = $(this).siblings(".ipu_txt").val();
        var ss = Trim(s);
        var obj = {};
        obj.manager = manager;
        obj.token = token;

        ss = maoStr(ss).toUpperCase();
        console.log(ss);

        obj.field = ss;

        $.ajax({
            type: "GET",
            url: "/manager/ap",
            data: obj,
            dataType: "json",
            success: function (msg) {
                if(msg.Code == 200){
                    $('section:eq(1) table tr:not(:first)').remove();
                    var t=h=ysh="";
                    for(var i=0; i<msg.aps.length; i++){
                        h = apLoad(msg.aps[i].holder, msg.aps[i].mac, msg.aps[i].vendor, msg.aps[i].model, msg.aps[i].fm, msg.aps[i].profile, ysh, msg.aps[i].note);
                        t += h;
                    }
                    $('section:eq(1) table').append(t);
                }else{
                    $.MsgBox.Alert("没有数据");
                }
            },
            error: function(msg){
                $.MsgBox.Alert("服务器繁忙，请重新搜索！");
            }
        });
    });

    //AP管理-添加AP
    $('#addAP').click(function(){
        var mac = $('#admac').val();
        var vendor = $('#vendor').val();
        var model = $('#model').val();
        var fm = $('#fm').val();
        var profile = $('#profile').val();
        var note = $('#note').val();

        var pattern = /^[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}:[a-fA-F\d]{2}$/;
        mac = Trim(mac);
        mac = maoStr(mac);

        if(mac=="" || mac==null){
            showError("填写MAC");$('#admac').focus();
        }else if(!pattern.test(mac)){
            showError("检查MAC格式");$('#mac').focus();
        }else if(vendor=="" || vendor==null){
            showError("填写厂商");$('#vendor').focus();
        }else if(model=="" || model==null){
            showError("填写型号");$('#model').focus();
        }else if(fm=="" || fm==null){
            showError("填写固件版本");$('#fm').focus();
        }else if(profile=="" || profile==null){
            showError("填写策略");$('#profile').focus();
        }else{
            clearError();
            mac = mac.toUpperCase();
            console.log(mac);
            var a = addAPData(mac, vendor, model, fm, profile, note);

            $.ajax({
                type: "POST",
                url: "/manager/ap",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(apData(a)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        var holder="", ysh="ysh";
                        var h = apLoad(holder, mac, vendor, model, fm, profile, ysh, note);
                        $('section:eq(1) table tr:eq(0)').after(h);
                        $.MsgBox.Alert("添加成功");
                        $('#asbox').hide();unmask("#shade");
                        $('#admac').val("");$('#vendor').val("");$('#model').val("");$('#fm').val("");$('#profile').val("");$('#note').val("");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function(msg){
                    $.MsgBox.Alert("添加失败");
                }
            });
        }
    });

    //AP管理-提交
    $(document).on('click', '#apsunH', function(){
        console.log(apData(arr));

        $.ajax({
            type: "PUT",
            url: "/manager/ap",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(apData(arr)),
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

    //房东管理-添加房东
    $('#addHolder').click(function(){
        var lxr = $('#lxr').val();
        var lxdh = $('#lxdh').val();
        var xxdz = $('#xxdz').val();
        var dqsj = $('#dqsj').val();
        var rzym = $('#rzym').val();
        var jffs = $('#jffs').val();

        if(lxr=="" || lxr==null){
            showError("填写联系人");$('#lxr').focus();
        }else if(lxdh=="" || lxdh==null){
            showError("填写联系电话");$('#lxdh').focus();
        }else if(xxdz=="" || xxdz==null){
            showError("填写详细地址");$('#xxdz').focus();
        }else if(dqsj=="" || dqsj==null){
            showError("填写截止时间");
        }else if(rzym=="" || rzym==null){
            showError("填写认证页面");
        }else{
            clearError();
            var a = addHolderData(lxr, lxdh, xxdz, dqsj, rzym, jffs);
            console.log(roomData(a));
            $.ajax({
                type: "POST",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(roomData(a)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        var flag=1, ysh="ysh", fol="";
                        var h = moduleLoad(msg.Ids[0], lxr, lxdh, xxdz, dqsj, 3, flag, ysh, fol, rzym, jffs);
                        $('section:eq(0) table tr:eq(1)').before(h);
                        $('.dpicker').datepicker({ dateFormat: 'yy-mm-dd', changeYear: true });
                        $.MsgBox.Alert("添加成功");
                        $('#asbox').hide();unmask("#shade");
                        $('#lxr').val("");$('#lxdh').val("");$('#xxdz').val("");$('#dqsj').val("");$('#rzym').val("");
                    }else{
                        $.MsgBox.Alert(msg.Msg);
                    }
                },
                error: function(msg){
                    $.MsgBox.Alert("添加失败");
                }
            });
        }
    });

    //房东管理-冻结用户
    $(document).on('click', '.folH', function(){
        var $t = $(this);

        $.MsgBox.Confirm("是否确定要冻结该用户？", function(){
            var drr=[], num=1, idx=8, n;
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

            changeData(drr, id, mask, num, idx, menuIndex);

            $.ajax({
                type: "PUT",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(roomData(drr)),
                dataType: "json",
                success: function (msg) {
                    if(msg.Code == 200){
                        arr.splice(n,1);                    //删除已提交的数据
                        $t.parent().parent().find('td').each(function(n){
                            $(this).addClass('fol');
                            if($(this).find('input').length>0){
                                $(this).find('input').attr("disabled", "disabled");
                            }
                            if($(this).find('select').length>0){
                                $(this).find('select').attr("disabled", "disabled");
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
        var $t = $(this), drr = [], num=0, idx=8;
        var id = $t.parent().parent().find("td:first-child").text();
        var mask = $t.parent().parent().find('td:eq(1) div').text();
            mask = mask & (~(1<<30));

        changeData(drr, id, mask, num, idx, menuIndex);

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
                        if($(this).find('select').length>0){
                            $(this).find('select').removeAttr("disabled");
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

    //房东管理-删除用户
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

            changeData(drr, id, mask, num, idx, menuIndex);

            $.ajax({
                type: "PUT",
                url: "/manager/holder",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(roomData(drr)),
                dataType: "json",
                success: function (msg) {
                    arr.splice(n,1);                    //删除已提交的数据
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
        }else{
            $.MsgBox.Alert('选择到期时间，重新审核');
        }
    });

    //房东管理-联系人、联系电话、地址、到期时间更改
    $(document).on("change", '.realnamebtn, .mobilebtn, .addressbtn, .dpicker, .portal, .policy', function() {
        var id = $(this).parent().parent().find('td:first-child').text();
        var mask = $(this).parent().parent().find('td:eq(1) div').text();
        var num = $(this).val();
        var idx = $(this).parent().index();

        changeData(arr, id, mask, num, idx, menuIndex);
    });

    //AP管理-固件版本、策略、备注更改
    $(document).on("change", '.fmbtn, .policybtn, .notebtn', function() {
        var mac = $(this).parent().parent().find('td:eq(2)').text();
        var num = $(this).val();
        var idx = $(this).parent().index();

        changeAPData(arr, mac, num, idx, menuIndex);
    });

});

function changeData(arr, id, mask, num, idx, menuIndex){    //arr需要提交的数据,   id:房东ID,   num:改动的数据，   idx：改动数据的位置（realname,expored,address）
    var orr = {}, drr = {};
    var flag = true;                       //判断arr中是否存在同一条ID数据的标记
    orr.id = drr.id = id;
    orr.mask = drr.mask = mask;
    orr.num = num;
    if(arr.length>0){                      //arr是否为空
        $(arr).each(function(index){       //遍历arr
            var val = arr[index];          //arr[index]，index多条数据
            if(val.id == orr.id){
                pushToArr(val, orr, idx, menuIndex);
                flag = false;
            }
        });
        if(flag){
            pushToArr(drr, orr, idx, menuIndex);
            arr.push(drr);
        }
    }else{
        pushToArr(drr, orr, idx, menuIndex);
        arr.push(drr);
    }
}

function pushToArr(a,b,i,z){    //b为旧数据，a为新数据, z:头部menu的index值
    if(z==0){
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
                a.expored  = b.num;
                break;
            case 5:
                a.portal = b.num;      //认证页面
                break;
            case 6:
                a.policy = b.num;      //计费方式
                break;
            case 8:
                a.frozen = b.num;   //冻结
                break;
            default :
                a.verify = b.num;
        }
    }else{
        switch(i){
            case 5:
                a.fm = b.num;      //固件版本
                break;
            case 6:
                a.profile = b.num;   //策略
                break;
            case 7:
                a.note = b.num;     //备注
                break;
        }
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

function addHolderData(realname, mobile, address, expored, portal, policy){
    var a = [];
    var holderObj = {
        realname: realname,
        mobile: mobile,
        address: address,
        expored: expored,
        portal: portal,
        policy: policy
    };
    a.push(holderObj);
    return a;
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

function shCheckFunc(verifyed, page){
    var manager = $("#manager").val();
    var token = $("#token").val();
    var ids = $('#footPage').val();
    arr=[];

    if(verifyed==1){                 //显示【添加房东】button
        $('section:eq(0) .bread input').css("display", "block");
    }else{
        $('section:eq(0) .bread input').css("display", "none");
    }

    $.ajax({
        type: "GET",
        url: "/manager/holder",
        data: {
            manager: manager,
            token: token,
            verified: verifyed,
            page: page-1
        },
        dataType: "json",
        success: function (msg) {
            if(msg.Code == 200){
                $('section:eq(0) table tr:not(:first)').remove();
                var h=t=ysh=fol="";
                if(verifyed==0){
                    for(var i=0; i<msg.Holders.length; i++){
                        h = moduleLoad(msg.Holders[i].id, msg.Holders[i].realname, msg.Holders[i].mobile, msg.Holders[i].address, msg.Holders[i].expored, msg.Holders[i].mask, verifyed, ysh, fol, msg.Holders[i].portal, msg.Holders[i].policy);
                        t += h;
                    }
                }else{
                    for(var i=0; i<msg.Holders.length; i++){
                        if((msg.Holders[i].mask>>30&1)==0){
                            fol="";
                            h = moduleLoad(msg.Holders[i].id, msg.Holders[i].realname, msg.Holders[i].mobile, msg.Holders[i].address, msg.Holders[i].expored, msg.Holders[i].mask, verifyed, ysh, fol, msg.Holders[i].portal, msg.Holders[i].policy);
                            t += h;
                        }else {
                            fol = "fol";
                            h = moduleLoad(msg.Holders[i].id, msg.Holders[i].realname, msg.Holders[i].mobile, msg.Holders[i].address, msg.Holders[i].expored, msg.Holders[i].mask, verifyed, ysh, fol, msg.Holders[i].portal, msg.Holders[i].policy);
                            t += h;
                        }
                    }
                }
                $('section:eq(0) table').append(t);
                $("section:eq(0) table td").each(function(index){
                    if($(this).hasClass("fol")){
                        $(this).find('input').attr("disabled", "disabled");
                    }
                });
                $('.dpicker').datepicker({ dateFormat: 'yy-mm-dd', changeYear: true });

                //pages显示分页
                if(msg.Pages>0){
                    $('#footPage').val(msg.Pages);
                    ids = msg.Pages;
                }
                Pheadfoot(parseInt(page), ids);
                var ps = showPages(parseInt(page), ids);
                $('.fanye div').html(ps);
            }else{
                $.MsgBox.Alert("没有数据");
            }
        },
        error: function(msg){
            $.MsgBox.Alert("请求失败");
        }
    });
}

function showPages(page, len){   //page:当前页   len:总页数
    var h=t="", ex=3, mp=7;        //ex:可扩展页数  mp:最多可显示页数
    if(len>mp){
        if(page<=mp-ex){
            for(var i=1; i<=mp; i++){
                h=PagesNum(page, i);
                t+=h;
            }
        }else if(page+ex>len){
            for(var i=len-mp+1; i<=len;i++){
                h=PagesNum(page, i);
                t+=h;
            }
        }else{
            for(var i=page-ex; i<=page+ex; i++){
                h=PagesNum(page, i);
                t+=h;
            }
        }
    }else{
        for(var i=1; i<=len; i++){
            h=PagesNum(page, i);
            t+=h;
        }
    }

    return t;
}

function PagesNum(page, index){
    var h="";
    if(index==page){
        h='<span class="ipunone">'+index+'</span>';
    }else{
        h='<span class="ipusmall">'+index+'</span>';
    }
    return h;
}

function Pheadfoot(page, len){
    $('.phead').show();$('.pfoot').show();
    if(page==1) $('.phead').hide();
    if(page == len) $('.pfoot').hide();
}

function moduleLoad(a, b, c, d, e, f, g, h, i, j, k){
    var t = '<tr class="'+ h +'">'+
            '<td class="'+i+'">'+a+'</td>'+
            '<td class="'+i+'"><input type="text" class="realnamebtn" value="'+b+'" /><div class="hidden">'+f+'</div></td>'+
            '<td class="'+i+'"><input type="text" class="mobilebtn" value="'+c+'" /></td>'+
            '<td class="'+i+'"><input type="text" class="addressbtn" title="'+d+'" value="'+d+'" /></td>'+
            '<td class="'+i+'"><input type="text" class="dpicker" value="'+e+'" /></td>'+
            '<td class="'+i+'"><input type="text" class="portal" title="'+j+'" value="'+j+'" /></td><td class="'+i+'">';

    if(k==1){
        t += '<select class="policy"><option value="0">普通计费</option><option value="1" selected>免费</option></select></td><td class="'+i+'">'
    }else{
        t += '<select class="policy"><option value="0">普通计费</option><option value="1">免费</option></select></td><td class="'+i+'">'
    }

    if(g == 0){
        t += '<a href="javascript:void(0);" class="chbH">审核</a>';
    }else if(i==""){
        t += '<a href="javascript:void(0);" class="folH">冻结</a>';
    }else{
        t += '<a href="javascript:void(0);" class="unfolH">解冻</a>';
    }
    t += '<span>|</span><a href="javascript:void(0);" class="delH">删除</a></td></tr>';
    return t;
}

function apLoad(a, b, c, d, e, f, g, i){   //a:房东， b:MAC, c:厂商， d:型号， e:固件版本， f:策略,  i:备注
    var h = "";
    h = '<tr class="'+g+'">'+
            '<td><input type="checkbox" class="ckb" /></td>'+
            '<td>'+a+'</td>'+
            '<td>'+b+'</td>'+
            '<td>'+c+'</td>'+
            '<td>'+d+'</td>'+
            '<td><input type="text" value="'+e+'" class="fmbtn" /></td>'+
            '<td><input type="text" value="'+f+'" class="policybtn" /></td>'+
            '<td><input type="text" value="'+i+'" class="notebtn" /></td>'+
            '<td><a href="javascript:void(0);" class="polH">解绑</a><span>|</span><a href="javascript:void(0);" class="delapH">删除</a></td></tr>';
    return h;
}

function addAPData(mac, vendor, model, fm, profile, note){
    var a = [];
    var apObj = {
        mac: mac,
        vendor: vendor,
        model: model,
        fm: fm,
        profile: profile,
        note: note
    };
    a.push(apObj);
    return a;
}

function apData(a){
    var manager = $("#manager").val();
    var token = $("#token").val();

    var apObj = {
        manager: manager,
        token: token,
        aps: a
    };
    return apObj;
}

function changeAPData(arr, mac, num, idx, menuIndex){    //arr需要提交的数据,    num:改动的数据，   idx：改动数据的位置
    var orr = {}, drr = {};
    var flag = true;                       //判断arr中是否存在同一条ID数据的标记
    orr.mac = drr.mac = mac;
    orr.num = num;
    if(arr.length>0){                      //arr是否为空
        $(arr).each(function(index){       //遍历arr
            var val = arr[index];          //arr[index]，index多条数据
            if(val.mac == orr.mac){
                pushToArr(val, orr, idx, menuIndex);
                flag = false;
            }
        });
        if(flag){
            pushToArr(drr, orr, idx, menuIndex);
            arr.push(drr);
        }
    }else{
        pushToArr(drr, orr, idx, menuIndex);
        arr.push(drr);
    }
}

function bindData(a, h){
    var manager = $("#manager").val();
    var token = $("#token").val();

    var apObj = {
        manager: manager,
        token: token,
        aps: a,
        holder: h
    };
    return apObj;
}

function maoStr(ss){
    var result="";
    if(ss.length==12){
        for(var i=0;i<ss.length-1;i++){
            result += ss[i];
            if(i % 2 == 1) result += ':';
        }
        result += ss[ss.length-1];
    }else{
        result = ss;
    }
    return result;
}

function Trim(str){   //去掉所有空格、转换中文符号
    var result=index="", m="：";
    result = str.replace(/\s/g,"");
    result = result.replace(/\：/g,":");
    return result;
}