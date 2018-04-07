var Screen_Settings_CND = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/cdn';


	var DataString = 
	{		 
		datasend:'get_users',
	};
 
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>';     

		var ErrorMsg = bs.AlertMsg(Msg,'error');

		$('.MsgBox').html(ErrorMsg).show();
		//$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	})

	//success
	ajax.done(function(data) 
	{ 
		var get_status = data.status
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error")
			$('.MsgBox').html(d).show()
			//$('.ScreenData').html().show();
			return false
		}

		//console.log(data) 

		$.get('html/011d-settings-cdn.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 


    		if(_.size(data.cdn_libs) > 0)
    		{
	    		var is_comment_allowed = data.cdn_libs[0].option_value

	    		if(is_comment_allowed == 'yes' )
	    		{
	    			var ele = $(document).find('.container_setting_cdn')

	    			ele.find('.cdn_libs').prop('checked', true)
	    		} 
	    	}  		

			$('.ScreenData').show()
			 
    	})

	}) 

}




$(document).on('click', '.btn_cdn_lib', function(event) 
{
	event.preventDefault() 

	bs.ClearError()

	var cdn_libs = $('.cdn_libs').prop('checked')

	if(cdn_libs)
	{
		var update_to = 'yes'
		
		var DataString = 
		{		 
			datasend:'settings_cdn',
			cdn_libs:update_to, 
		}
		//update the value to > yes
		alasql('UPDATE np_options SET option_value=? WHERE option_name="cdn_libs"',[update_to])

		update_cdn_libs(DataString)
	}
	else 
	{
		var update_to = 'no'

		var DataString = 
		{		 
			datasend:'settings_cdn',
			cdn_libs:update_to, 
		}
		//update the value to > yes
		alasql('UPDATE np_options SET option_value=? WHERE option_name="cdn_libs"',[update_to])

		update_cdn_libs(DataString)
	}

	 
})

var update_cdn_libs = function (DataString) 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....updating your info")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/cdn' 
 
 
  
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>'      

		var ErrorMsg = bs.AlertMsg(Msg,'error') 

		$('.MsgBox').html(ErrorMsg).show()  

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)

		var d = bs.AlertMsg("Successfully udpated... ", "success");

		$('.MsgBox').html(d).show() 

		$('.ScreenData').show() 

		
	}) 
} 