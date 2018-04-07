var Screen_Settings_Discussion= function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/discussion';


	//var user_id_data =  alasql('Select * FROM np_users')[0];


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

		$.get('html/011c-settings-discussion.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 

    		var is_comment_allowed = data.post_comments_allow[0].option_value

    		if(is_comment_allowed == 'yes' )
    		{
    			var ele = $(document).find('.container_setting_discussion')

    			ele.find('.post_comments_allow').prop('checked', true)
    		} 

    		//post_comments_allow
    		var post_comments_allow =  alasql('Select * FROM np_options where option_name="post_comments_allow"')[0].option_value

    		//console.log(post_comments_allow)

			$('.ScreenData').show()
			 
    	})

	}) 

}




$(document).on('click', '.btn_update_setting_discussion', function(event) 
{
	event.preventDefault() 

	bs.ClearError()

	var is_comment_allowed = $('.post_comments_allow').prop('checked')

	if(is_comment_allowed)
	{
		var update_to = 'yes'
		
		var DataString = 
		{		 
			datasend:'settings_discussion',
			post_comments_allow:update_to, 
		}
		//update the value to > yes
		alasql('UPDATE np_options SET option_value=? WHERE option_name="post_comments_allow"',[update_to])

		update_comment_allowed(DataString)
		return false
	}
	else 
	{
		var update_to = 'no'

		var DataString = 
		{		 
			datasend:'settings_discussion',
			post_comments_allow:update_to, 
		}
		//update the value to > yes
		alasql('UPDATE np_options SET option_value=? WHERE option_name="post_comments_allow"',[update_to])

		update_comment_allowed(DataString)
		return false
	}

	 
})

var update_comment_allowed = function (DataString) 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....updating your info")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/discussion' 
 
  
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