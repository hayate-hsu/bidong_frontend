/**
 * Created by JavieChan on 2015/4/29.
 */

;(function () {
    $.MsgBox = {
        Alert: function (msg) {
            GenerateHtml("alert", msg);
            setTimeout("unmask('#msgbox')",2000);
        },
        Confirm: function (msg, callback) {
            GenerateHtml("confirm", msg);
            shade();
            btnOk(callback);
            btnNo();
        },
        WXbox: function (msg) {
            GenerateHtml("wxbox", msg);
            shade();
            btnNo();
        }
    };

    //生成Html
    var GenerateHtml = function (type, msg) {

        var _html = "";

        //_html += '<span><em>!</em>' + msg + '</span>';

        if( type == "alert"){
            _html += '<div id="msgbox"><span><em>!</em>' + msg + '</span>';
        }
        if (type == "confirm") {
            _html += '<div id="confirmbox"><span><em>!</em>' + msg + '</span>';
            _html += '<input id="mb_btn_ok" type="button" value="确定" />';
            _html += '<input id="mb_btn_no" type="button" value="取消" />';
        }
        if(type == "wxbox") {
            _html += '<div id="confirmbox"><span><em>!</em>' + msg + '</span>';
            _html += '<input id="mb_btn_no" type="button" value="确定" />';
        }
        _html += '</div>';

        //$("#msgbox").html("");
        //$("#msgbox").append(_html).show();
        $("body").append(_html).show();
    };

    //确定按钮事件
    var btnOk = function (callback) {
        $("#mb_btn_ok").click(function () {
            $("#confirmbox").remove();
            $('#shade').remove();
            $("body").eq(0).css("overflow","auto");

            if (typeof (callback) == 'function') {
                callback();
            }
        });
    };

    //取消按钮事件
    var btnNo = function () {
        $("#mb_btn_no, #mb_ico").click(function () {
            unmask("#confirmbox");
            unmask("#shade");
        });
    };
})();