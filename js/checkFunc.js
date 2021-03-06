// JavaScript Document

;(function () {
	
	$.getJSON('/js/cityData.json', function(data){

        var arr = [0,1,8,32,33];

        var indcity = $('#selcity').val();
        var indpro = $('#selpro').val();
		
		$('#selpro').change(function(){
            $("#selcity").empty();
            $("#selarea").empty();
			indpro = $('#selpro').val();
			for(var j=0; j<data[indpro].s.length; j++){
				$("#selcity").append('<option value="'+ j +'">'+ data[indpro].s[j].n +'</option>');
			}
            $('#selcity option:eq(0)').prop("selected", "selected");
            if($.inArray(parseInt(indpro), arr)<0){
                if($('#selarea').length<1){
                    $('#selcity').parent().after('<li class="arrow"><select id="selarea"></select></li>');
                }
                indcity = $('#selcity').val();
                for(var k=0; k<data[indpro].s[indcity].s.length; k++){
                    $("#selarea").append('<option value="'+ k +'">'+ data[indpro].s[indcity].s[k].n +'</option>');
                }
                $('#selarea option:eq(0)').prop("selected", "selected");
            }else{
                $('#selarea').parent().remove();
            }
		});
		
		$('#selcity').change(function(){
            $("#selarea").empty();
            indpro = $('#selpro').val();
			indcity = $('#selcity').val();

            if($('#selarea').length>0){
                for(var k=0; k<data[indpro].s[indcity].s.length; k++){
                    $("#selarea").append('<option value="'+ k +'">'+ data[indpro].s[indcity].s[k].n +'</option>');
                }
                $('#selarea option:eq(0)').prop("selected", "selected");
            }
		});

        for(var i=0; i<data.length; i++){  //默认显示省份
            $("#selpro").append('<option value="'+ i +'">'+ data[i].n +'</option>');
        }
        for(var j=0; j<data[18].s.length; j++){  //默认显示广东省的市级
            $("#selcity").append('<option value="'+ j +'">'+ data[18].s[j].n +'</option>');
        }
        for(var k=0; k<data[18].s[0].s.length; k++){  //默认显示广州市的所有区级
            $("#selarea").append('<option value="'+ k +'">'+ data[18].s[0].s[k].n +'</option>');
        }

        $('#selpro option:eq(18)').prop("selected", "selected");
        $('#selcity option:eq(0)').prop("selected", "selected");
        $('#selarea option:eq(0)').prop("selected", "selected");
	})

})();