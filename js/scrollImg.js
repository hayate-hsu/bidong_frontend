/**
 * Created by JavieChan on 2015/5/7.
 */

$(document).ready(function(){
    var int = setInterval(hotCat, 3000);

    $('.dots a').click(function(){
        var h = 404;
        var $index = $(this).index();
        $top = $index * h;

        $('.hotimgs').animate({"top": -$top}, 700);

        $('.dots a').removeClass('actived');
        $(this).addClass('actived');
    });

    $('.hots').hover(
        function(){
            clearInterval(int);
        },
        function(){
            int = setInterval(hotCat, 3000);
        }
    );
});

function hotCat(){
    var d = $('.dots a.actived').index();

    var h = 404;

    if(d == 3){
        $('.hotimgs').animate({"top": 0}, 700);

        $('.dots a').removeClass('actived');
        $('.dots a').eq(0).addClass('actived');
    }else{
        $top = (d+1) * h;
        $('.hotimgs').animate({"top": -$top}, 700);

        $('.dots a').removeClass('actived');
        $('.dots a').eq(d+1).addClass('actived');
    }
}