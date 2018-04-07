$(document).ready(function()
{
    $(document).on('click', '.btn_ga_code', function(event) 
    {
    	event.preventDefault()

    	var site_url = js.GetSiteURL()

    	var site_plugin_folder = 'np-content/plugins/'

    	var plugin_folder_name = 'google-analytics/'
    	var template_file = 'temp.html'

    	var url  = site_url+site_plugin_folder+plugin_folder_name+template_file

    	
 
    	$.get(url, function(data) 
    	{
    		msg_box = $(document).find('.code_container_msg')

    		//bs.Modal('CDN URL Plugin',  data)

    		var object_data =
			{
				ModalTitle:'Google Analytics Plugin', 
				ModalBodyContent: data,
			}

			bs.Modal(object_data);

    		
    		var d = bs.WaitingMsg("Please wait....Processing your request");

    		$(document).find('.code_container_msg').html(d).show()


    		var DataString = {option_name: 'ga_code'}

    		var ajax = np_admin_ajax_option('GET',DataString);

    			//error
			ajax.fail(function(xhr, ajaxOptions, thrownError)  
			{ 		 	 
			  //do your error handling here
			  
				bs.ClearError();
				var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
				+ 'Please try agin in a few seconds.<br><br>';     

				var ErrorMsg = bs.AlertMsg(Msg,'error');

				$(document).find('.code_container_msg').html(ErrorMsg).show();
				//$('.ScreenData').show();

				console.log(thrownError);
				console.log(xhr); 

				return false    
				 
			})

			//success
			ajax.done(function(data) 
			{ 
				//console.log(data) 

				var ele = $(document).find('.code_container_form')
				ele.find('.code_option_value').val(data.option_value)
				ele.show() 

				$(document).find('.code_container_msg').hide()
			})

		})
    	

    })
	
	
	//--->submit > start
	$(document).on('click', '.btn_update_code', function(event) 
    {
    	event.preventDefault()
    	
    	bs.ClearError()
    	var ele_this = $(this)
 
		//Get the field value
		var api_key = $(document).find('.code_option_value')
		 
		// Validate field
		if(frm.IsEmpty(api_key.val() ))
		{
			//Show alert
			bs.ShowError ("Please enter code",api_key)
		}
		else
		{
			var d = bs.WaitingMsg("Please wait....Processing your request");

    		$(document).find('.code_container_msg').html(d).show()


    		var DataString = {option_name: 'ga_code', option_value:api_key.val()}

    		var ajax = np_admin_ajax_option('POST',DataString);

    			//error
			ajax.fail(function(xhr, ajaxOptions, thrownError)  
			{ 		 	 
			  //do your error handling here
			  
				bs.ClearError();
				var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
				+ 'Please try agin in a few seconds.<br><br>';     

				var ErrorMsg = bs.AlertMsg(Msg,'error');

				$(document).find('.code_container_msg').html(ErrorMsg).show();
				//$('.ScreenData').show();

				console.log(thrownError);
				console.log(xhr); 

				return false    
				 
			})

			//success
			ajax.done(function(data) 
			{ 
				//console.log(data) 

				var d = bs.AlertMsg("Updated your cdn url", "success");

				ele_this.after(d)
				$(document).find('.code_container_msg').hide()
				 
			})


		}

    })

	//--->submit > start
	 
})