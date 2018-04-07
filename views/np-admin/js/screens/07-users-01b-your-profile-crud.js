
//--->udpate your profile > start
$(document).on('click', '.btn_update_your_profile', function(event) 
{
	event.preventDefault()
	bs.ClearError()

	var ele = $(document).find('.users_main_container')

	var user_login 		= ele.find('.user_login')
	var user_email 		= ele.find('.user_email')
	var user_url 		= ele.find('.user_url')
	var display_name 	= ele.find('.display_name')
	var user_id			= $(this).attr('user_id')

	if(frm.IsEmpty(user_login.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",user_login )
	}
	else if(frm.IsEmpty(user_email.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",user_email )
	}
	else if(frm.IsEmpty(display_name.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",display_name )
	}
	else if(frm.IsEmpty(user_url.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",user_url )
	}
	else if(frm.IsEmail(user_email.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Invaild Email",user_email )
	}	 
	else
	{ 
		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....updating your info")
		+'</div>'

		$('.MsgBox').html(d).show() 

		$('.ScreenData').hide() 

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'users/update/your-profile' 
 
		var DataString = 
		{		 
			datasend:'update_your_profile',
			user_id:user_id,
			user_login:user_login.val(),
			user_email:user_email.val(),
			user_url:user_url.val(),
			display_name:display_name.val()
		};
	  
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
			///console.log(data)

			var d = bs.AlertMsg("Successfully udpated your profile info... ", "success");

			$('.MsgBox').html(d).show() 

			$('.ScreenData').show() 
		})
	}
})
//--->udpate your profile > end

 

//--->udpate your password > start
$(document).on('click', '.btn_update_your_password', function(event) 
{
	event.preventDefault()
	bs.ClearError()

	var ele = $(document).find('.users_main_container')

	var current_password 	= ele.find('.current_password')
	var new_password 		= ele.find('.new_password')
	var confim_new_password = ele.find('.confim_new_password')

	var user_id			= $(this).attr('user_id')

	if(frm.IsEmpty(current_password.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",current_password )
	}
	else if(frm.IsEmpty(new_password.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",new_password )
	}
	else if(frm.IsEmpty(confim_new_password.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",confim_new_password )
	}
	else if(frm.IsEqualTo(new_password.val(),confim_new_password.val()  ))
	{
	  	//Show alert
	  	bs.ShowError ("New password doesn't match with confirm password",new_password )
	}
	else if(!frm.IsEqualTo(current_password.val(),confim_new_password.val()  ))
	{
	  	//Show alert
	  	var Msg = 'New password needs to be different than current one'

		var ErrorMsg = bs.AlertMsg(Msg,'error') 

		$('.MsgBox').html(ErrorMsg).show()  
	}
	else
	{ 
		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....updating your info")
		+'</div>'

		$('.MsgBox').html(d).show() 

		$('.ScreenData').hide() 

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'users/update/password' 
 
		var DataString = 
		{		 
			datasend:'update_your_password',
			user_id:user_id,
			current_password:current_password.val(),
			new_password:new_password.val(),
			 
		};
	  
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

			var get_status = data.status
			if(get_status =='error')
			{				
				$('.MsgBox').html('').show()
				bs.ShowError ("Invaild Password", current_password )

				$('.ScreenData').show() 

				return false
			}

			var d = bs.AlertMsg("Successfully udpated your password... ", "success");

			$('.MsgBox').html(d).show() 


			current_password.val('') 	 
	  		new_password.val('') 		 
	  		confim_new_password.val('')

			$('.ScreenData').show() 
		})
	}
})
//--->udpate your profile > end