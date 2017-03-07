/**
 * Created by JavieChan on 2017/2/10.
 */

;(function($){
    var fn = function(ele, option, callback){
        this.element = ele;
        this.callback = callback;
        this.default = {
            min: 1,
            max: 10
        };
        this.settings = $.extend({}, this.default, option);
    };

    fn.prototype.init = function(){
        this.add();
        this.reduce();
        this.changeNum();
    };

    fn.prototype.add = function(){
        var self = this;
        self.element.find('.add').on('click', function(e){
            e.stopPropagation();
            var num = $(this).prev('.number').val();
            //if(parseInt(num)<self.settings.max){
                num++;
                $(this).prev('.number').val(num);
                if(typeof (self.callback) == 'function'){
                    self.callback(this);
                }
            //}
        });
    };

    fn.prototype.reduce = function(){
        var self = this;
        self.element.find('.reduce').on('click', function(e){
            e.stopPropagation();
            var num = $(this).next('.number').val();
            if(num>self.settings.min){
                num--;
                $(this).next('.number').val(num);
                if(typeof (self.callback) == 'function'){
                    self.callback(this);
                }
            }
        });
    };

    fn.prototype.changeNum = function(){
        var self = this;
        self.element.find('.number').on('change', function(e){
            e.stopPropagation();
            var num = $(this).val();
            if(num<1 || !self.regInt(num)){
                num = 1;
            }
            //if(num>10){
            //    num = 10;
            //}
            $(this).val(num);
            if(typeof (self.callback) == 'function'){
                self.callback(this);
            }
        });
    };

    fn.prototype.regInt = function(num){
        if(/^[\d]+$/.test(num)){
            return true;
        }else{
            return false;
        }
    };

    $.fn.Amount = function(option, callback){
        var amount = new fn(this, option, callback);
        return amount.init();
    };
})(jQuery);