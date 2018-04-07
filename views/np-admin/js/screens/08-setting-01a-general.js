var Screen_Settings_General = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/general';


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

		var ErrorMsg = bs.AlertMsg(Msg,'error')

		$('.MsgBox').html(ErrorMsg).show()
		$('.ScreenData').show()

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
			$('.ScreenData').html().show();
			return false
		}

		//console.log(data) 

		$.get('html/011a-settings-general.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 

    		if(get_status =='no_plugins')
			{
				var d = bs.AlertMsg("No plugins were found...", "warning");

				$('.plugins_alert').html(d).show();	

				$(document).find('.plugin_data_container').hide()
				$('.ScreenData').show();

				return false;
			}
			var v1 = data
			var ele = $(document).find('.container_setting_general')

			ele.find('.blog_name').val(v1.blog_name)
			ele.find('.site_url').val(v1.site_url)
			ele.find('.admin_email').val(v1.admin_email) 

			$('.ScreenData').show()
			 
    	})
	})
}



$(document).on('click', '.btn_update_setting_general', function(event) 
{
	event.preventDefault();
	
	bs.ClearError();

	var blog_name = $('.blog_name')
	var site_url = $('.site_url')
	var admin_email = $('.admin_email')


	if(frm.IsEmpty(blog_name.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",blog_name )
	}
	else if(frm.IsEmpty(site_url.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",site_url )
	}
	else if(frm.IsEmpty(admin_email.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Required Field",admin_email )
	}
	else if(frm.IsEmail(admin_email.val()))
	{
		//Show alert
		bs.ShowError ("Invaid Email ",admin_email)
	}
	else
	{

		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....updating your info")
		+'</div>'

		$('.MsgBox').html(d).show() 

		$('.ScreenData').hide() 

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'settings/general' 

		var DataString = 
		{		 
			datasend:'settings_general',
			blog_name:blog_name.val(),
			site_url:site_url.val(),
			admin_email:admin_email.val()
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

			var d = bs.AlertMsg("Successfully udpated... ", "success");

			$('.MsgBox').html(d).show() 

			$('.ScreenData').show() 


		}) 

	}


}) 