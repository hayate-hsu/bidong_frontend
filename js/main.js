// JavaScript Document

$(document).ready(function() {

    $('#mybd').click(function(){
        $.MsgBox.Alert("请登录！");
        return false;
    });

    //提示连接操作步骤
    $('.werror').click(function(){
        $.MsgBox.WXbox('进入手机【设置】-【无线网络】选择-【BIDONG】连接上网');
    });

    //添加房东和AP显示与隐藏
    $('.bread .ipubtn').click(function(){
        var index = $('nav a.actived').parent().index();
        $('#asbox h2').hide().eq(index).show();
        $('#asbox div').hide().eq(index).show();
        $('#asbox').fadeIn();
        shade();
    });
    $('#asbox .closed').click(function(){
        $('#asbox').fadeOut();
        unmask('#shade');
        clearError();
    });

    //侧边工具栏定位
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();      //滚动高度
        var windowHeight = $(window).height();    //屏幕高度

        if(scrollTop > 480){
            $('.suspend').addClass('suspendFixed');
            $('#toTop').fadeIn();
        }else{
            $('.suspend').removeClass('suspendFixed');
            $('#toTop').fadeOut();
        }
    });
    $('#toTopFix').hover(
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.stop().animate({'width':'164px'}, 300);
            $slidelem.find('p').stop(true,true).fadeIn();
            $this.addClass('on');
        },
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.find('p').stop(true,true).hide();
            $slidelem.stop().animate({'width':'64px'}, 200, function(){
                $this.removeClass('on');
            });
        }
    );
    $('#showPhoneFix').hover(
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.stop().animate({'width':'230px'}, 300);
            $slidelem.find('p').stop(true,true).fadeIn();
            $this.addClass('on');
        },
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.find('p').stop(true,true).hide();
            $slidelem.stop().animate({'width':'64px'}, 200, function(){
                $this.removeClass('on');
            });
        }
    );
    $('#showEwmFix').hover(
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.stop().animate({'width':'190px'}, 300);
            $slidelem.find('p').stop(true,true).fadeIn();
            $this.addClass('on');
        },
        function () {
            var $this 		= $(this);
            var $slidelem 	= $this.prev();
            $slidelem.find('p').stop(true,true).hide();
            $slidelem.stop().animate({'width':'64px'}, 200, function(){
                $this.removeClass('on');
            });

        }
    );

    //滚动至头部
    $('#toTop').click(function(){
        $('body,html').animate({scrollTop: 0}, 700);
    });

    //主页放大图片
    $('#catbox .cat img').hover(function(){
        //var d = $(this).index();
        //d += 1;
        //switch (d){
        //    case 1:
        //        $('.ccbox h3').html('<i>'+ d + '</i>黄村新建整栋居民楼');
        //        $('.ccbox p').html("黄村是壁咚WiFi的第一个试验地点，共安装无线路由器20余台。解决了房东拉网线的烦恼。我们有自己的施工队，负责安装调试，房东只需要支付机器费用就可以后顾无忧的使用。");
        //        break;
        //    case 2:
        //        $('.ccbox h3').html('<i>'+ d + '</i>黄村新建整栋居民楼');
        //        $('.ccbox p').html("黄村是壁咚WiFi的第一个试验地点，共安装无线路由器20余台。解决了房东拉网线的烦恼。我们有自己的施工队，负责安装调试，房东只需要支付机器费用就可以后顾无忧的使用。");
        //        break;
        //    case 3:
        //        $('.ccbox h3').html('<i>'+ d + '</i>黄村新建整栋居民楼');
        //        $('.ccbox p').html("黄村是壁咚WiFi的第一个试验地点，共安装无线路由器20余台。解决了房东拉网线的烦恼。我们有自己的施工队，负责安装调试，房东只需要支付机器费用就可以后顾无忧的使用。");
        //        break;
        //    case 4:
        //        $('.ccbox h3').html('<i>'+ d + '</i>黄村新建整栋居民楼');
        //        $('.ccbox p').html("黄村是壁咚WiFi的第一个试验地点，共安装无线路由器20余台。解决了房东拉网线的烦恼。我们有自己的施工队，负责安装调试，房东只需要支付机器费用就可以后顾无忧的使用。");
        //        break;
        //}

        $('div.zk').hide();
        $(this).parent().find('div.zk').show();
    });
    $('#catbox .cat').mouseleave(function(){
        $('div.zk').hide();
    });
    $('div.zk').click(function(){
        var i = $(this).next('img').attr('src');
        $('#imgbig img').attr('src', i).show();
        $('#imgbig').show();
    });
    $('#imgbig').mouseleave(function(){
        $(this).hide();
    });

    //增加租客addbox在线申请addressbox显示与隐藏
    $('#addpeo').click(function(){
        $('.addbox').fadeIn();shade();
    });
    $('.addbox .close').click(function(){
        $('.addbox').fadeOut();unmask('#shade');clearError();
    });
    $('.apply').click(function(){
        $('.addressbox').fadeIn();shade();
    });
    $('.addressbox .close').click(function(){
        $('.addressbox').fadeOut();unmask('#shade');clearError();
    });
    //投资项目显示与隐藏
    $("#touzi").click(function(){
        $("#noticebox").fadeIn();
    });
    $("#noticebox input").click(function(){
        $("#noticebox").fadeOut();
    });

    //主页登录input【type=text】focus&blur
    $('.ipu_text').focus(function(){
        $('.ipu_text').css({"border-color":"#ceced1", "box-shadow":"none"});
        $(this).css({"box-shadow":"0 0 3px #05AF93 inset","border-color":"#05AF93"});
    });
    $('.ipu_text').blur(function(){
        $('.ipu_text').css({"border-color":"#ceced1", "box-shadow":"none"});
    });

    //搜索展开
    $('.clientbox span').click(function(){
        $(this).addClass('on');
    });

    //切换支付方式
    $('.zf').click(function(){
        $('.zf').removeClass('on');
        $(this).addClass('on');
    });

	//立即加盟
	$('#addmeng').click(function(){
        if($('#msgxx').is(":hidden")){
            $('#msgxx').slideDown();
            $(this).val("收起");
        }else{
            $('#msgxx').slideUp();
            $(this).val("立即加盟");
        }
	});

    //送货地址
    $('.arrowBottom').click(function(){
        if($('.martop').is(":hidden")){
            $('.martop').slideDown();
            //$('.wlist .arrowBottom span').css({'background':'url("../images/aupdown.png") bottom center no-repeat'});
            $('.wlist .arrowBottom span').css({'transform':'rotate(180deg)'});
        }else{
            $('.martop').slideUp();
            $('.wlist .arrowBottom span').css({'transform':'rotate(0deg)'});
        }
    });
		
	//切换支付方式
	//$('#charge a').click(function(){
	//	var i = document.createElement('i');
	//	$('#charge a').removeClass('actived');
	//	$('#charge a').find('i').remove();
	//	$(this).addClass('actived');
	//	$(this).prepend(i);
	//});

	//range提示
	$('#range').change(function(){
		var w = 0;
		if($('.wrapper').width() == 640){
			w = $('.wrapper').width() - 55;
		}else{
			w = document.body.clientWidth - 55;
		}
	
		var t = $('.tip');
		var r = $(this).val();
		var sMax = $(this).attr('max');
		var sMin = $(this).attr('min');
		
		var step = (r-sMin)*w/(sMax-sMin);
		
		if(r == sMin){
			t.css('left', 5+'px');
		}else if(r == sMax){
			t.css('left', w-10+'px')
		}else{
			t.css('left',step+'px');
		}
	});
	
	//选择城市
    //$.getJSON('/js/cityData.json', function(data){
    //
     //   var arr = [0,1,8,32,33];
    //
     //   var indcity = $('#selcity').val();
     //   var indpro = $('#selpro').val();
    //
     //   $('#selpro').change(function(){
     //       $("#selcity").empty();
     //       $("#selarea").empty();
     //       indpro = $('#selpro').val();
     //       for(var j=0; j<data[indpro].s.length; j++){
     //           $("#selcity").append('<option value="'+ j +'">'+ data[indpro].s[j].n +'</option>');
     //       }
     //       $('#selcity option:eq(0)').prop("selected", "selected");
     //       if($.inArray(parseInt(indpro), arr)<0){
     //           if($('#selarea').length<1){
     //               $('#selcity').parent().after('<li class="arrow"><select id="selarea"></select></li>');
     //           }
     //           indcity = $('#selcity').val();
     //           for(var k=0; k<data[indpro].s[indcity].s.length; k++){
     //               $("#selarea").append('<option value="'+ k +'">'+ data[indpro].s[indcity].s[k].n +'</option>');
     //           }
     //           $('#selarea option:eq(0)').prop("selected", "selected");
     //       }else{
     //           $('#selarea').parent().remove();
     //       }
     //   });
    //
     //   $('#selcity').change(function(){
     //       $("#selarea").empty();
     //       indpro = $('#selpro').val();
     //       indcity = $('#selcity').val();
    //
     //       if($('#selarea').length>0){
     //           for(var k=0; k<data[indpro].s[indcity].s.length; k++){
     //               $("#selarea").append('<option value="'+ k +'">'+ data[indpro].s[indcity].s[k].n +'</option>');
     //           }
     //           $('#selarea option:eq(0)').prop("selected", "selected");
     //       }
     //   });
    //
     //   for(var i=0; i<data.length; i++){  //默认显示省份
     //       $("#selpro").append('<option value="'+ i +'">'+ data[i].n +'</option>');
     //   }
     //   for(var j=0; j<data[18].s.length; j++){  //默认显示广东省的市级
     //       $("#selcity").append('<option value="'+ j +'">'+ data[18].s[j].n +'</option>');
     //   }
     //   for(var k=0; k<data[18].s[0].s.length; k++){  //默认显示广州市的所有区级
     //       $("#selarea").append('<option value="'+ k +'">'+ data[18].s[0].s[k].n +'</option>');
     //   }
    //
     //   $('#selpro option:eq(18)').prop("selected", "selected");
     //   $('#selcity option:eq(0)').prop("selected", "selected");
     //   $('#selarea option:eq(0)').prop("selected", "selected");
    //});

});

//咚币range
function rangeChange(){ 
	var n = document.getElementById("range"); 
	var s = document.getElementById("tip"); 
	s.innerHTML = n.value;
}

//随机颜色
function getColor(){
    return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}

//自动补零
function FormatNum(source,length){
    var strTemp="";
    for(var i=1;i<=length-source.length;i++){
        strTemp+="0";
    }
    return strTemp+source;
}

//所有房号信息
function allRooms(){
    var orr =[];
    $('.clientbox tr:gt(0)').each(function(){
        var r = $(this).find('td:first').html();
        orr.push(r);
    });
    return orr;
}

//启用提交按钮
function submitAble(){
    $('#subAll').css({"cursor":"pointer","background":"#66BC23"}).removeAttr("disabled");
}

//禁用提交按钮
function submitDisable(){
    $('#subAll').css({"cursor":"not-allowed","background":"#eee"}).attr("disabled");
}

//自动隐藏
//function showMsgHide(m){
//    $(m).fadeOut(1000);
//}

//错误提示
function showError(msg){
    var h = "<em>!</em>" + msg;
    $('span.errorMsg').html(h);
}
function clearError(){
    $('span.errorMsg').html("");
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

//密码有效性判断
function pwdCorrect(pwd){
    var pattern = /^[a-zA-Z0-9]{4,8}$/;
    if(!pattern.test(pwd)){
        return true;
    }else{
        return false;
    }
}

function shade(){
    var original = $(document.body);
    var win = $(window);

    var scrollWidth = document.body.scrollWidth;
    var scrollHeight = document.body.scrollHeight;

    var position = {
        top:0,
        left:0
    };
    var op = {
        z: 1001,
        o: 0.7,
        bg: '#000'
    };
    var maskDiv = $('<div id="shade"></div>');
    maskDiv.appendTo(original);

    var maskWidth = original.outerWidth();
    if(scrollWidth){
        maskWidth = scrollWidth;
    }

    var maskHeight = original.outerHeight();
    if(scrollHeight){
        maskHeight = scrollHeight;
    }
    if(maskHeight < win.height()){
        maskHeight = win.height();
    }

    maskDiv.css({
        position: 'absolute',
        top: position.top,
        left: position.left,
        'z-index': op.z,
        width: maskWidth,
        height: maskHeight,
        'background-color': op.bg,
        opacity: op.o
    });
}

function unmask(layer){
    var original=$(document.body);

    original.find(layer).fadeOut('slow',function(){
        $(this).remove();
    });
}