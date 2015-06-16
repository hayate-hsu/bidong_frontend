/**
 * Created by JaiveChan on 2015/5/12.
 */

;(function($){
    var min = 1, max = 10;

    $.fn.extend({
        add:function(){
            var obj = this.parent().find('input');
            var x = amount(obj, true);
            $(obj).val(x);
            //if (parseInt(x) <= max) {
            //    $(obj).val(x);
            //} else {
            //    $.MsgBox.Alert("超过最大允许网络号！");
            //    setTimeout("unmask('#msgbox')",2000);
            //    $(obj).val(max == 0 ? 1 : max);
            //    $(obj).focus();
            //}
        },
        reduce:function(){
            var obj = this.parent().find('input');
            var x = amount(obj, false);
            if (parseInt(x) >= min) {
                $(obj).val(x);
            } else {
                //$.MsgBox.Alert("网络号最少为" + min + "！");
                //setTimeout("unmask('#msgbox')",2000);
                $(obj).val(min);
                $(obj).focus();
            }
        },
        modify : function(old) {
            var x = this.val();
            if (!reg(parseInt(x))) {
                $.MsgBox.Alert("请输入正确的网络号！");
                setTimeout("unmask('#msgbox')",2000);
                this.val(old);
                this.focus();
            }
            if (x < min) {
                //$.MsgBox.Alert("网络号最少为" + min + "！");
                //setTimeout("unmask('#msgbox')",2000);
                this.val(old);
                this.focus();
            } else if (x > max) {
                //$.MsgBox.Alert("超过最大允许网络号！");
                //setTimeout("unmask('#msgbox')",2000);
                this.val(old);
                this.focus();
            }
        }
    });

    var reg = function(x) {
        return new RegExp("^[1-9]\\d*$").test(x);
    };

    var amount = function(obj, mode) {
        var x = $(obj).val();
        if (reg(parseInt(x))) {
            if (mode) {
                x++;
            } else {
                x--;
            }
        } else {
            x = 2;             //不为数字，改成默认终端数2
            //$.MsgBox.Alert("请输入正确的数量！");
            //$(obj).val(2);
            //$(obj).focus();
        }
        return x;
    };
})(jQuery);