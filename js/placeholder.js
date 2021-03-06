/**
 * Created by JavieChan on 2015/6/24.
 */

$(document).ready(function(){

    $(document).on('focus', '#user, #password, #atten, #tel, #addrDet, #reRoom, #rePwd, #room, #pwd, .datepicker2, .hidePH, #oldpwd, #newpwd, #repwd', function(){
        if($(this).hasClass('hidePH')){
            $(this).prev().show().focus();
            $(this).remove();
        }
        if($(this).val()==$(this).attr("placeholder")){
            $(this).val("").css("color", "#000");
        }
    });

    $(document).on('blur', '#user, #password, #atten, #tel, #addrDet, #reRoom, #rePwd, #room, #pwd, .datepicker2, #oldpwd, #newpwd, #repwd', function(){
        var p = $(this).attr("placeholder");
        var h = '<input type="text" class="ipu_text hidePH" value="'+p+'" />';
        if($(this).attr("type")=="password" && $(this).val()==""){
            $(this).after(h);
            $(this).hide();
        }
        if($(this).val()==""){
            $(this).val($(this).attr("placeholder")).css("color", "#999");
        }
    });

    $('#user, #password, #atten, #tel, #addrDet, #reRoom, #rePwd, #room, #pwd, .datepicker2, #oldpwd, #newpwd, #repwd').blur();
});