var Screen_Users_All = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'users';


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
			return false
		}

		//console.log(data) 

		$.get('html/010a-users-your-profile.html', function(template_data)     
    	{  
    		$('.MsgBox').hide()

    		$('.ScreenData').html(template_data)
 
			var v1 = data.np_users[0]
			var ele = $(document).find('.users_main_container')

			ele.find('.user_login').val(v1.user_login)
			ele.find('.user_email').val(v1.user_email)
			ele.find('.user_url').val(v1.user_url)
			ele.find('.display_name').val(v1.display_name)

			ele.find('.btn_update_your_profile').attr('user_id', v1.user_id)

			ele.find('.btn_update_your_password').attr('user_id', v1.user_id)

			


			$('.ScreenData').show()
			 
    	})

	});

}
