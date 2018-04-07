$(document).ready(function()
{
	var plugin_name = 'Contact Form';

	//only add the id('#id-name') or class('.class-name')
	var btn_admin_setting = '.btn_contact_form_code';

	var plugin_folder_name = 'contact-form';

	var plugin_option_name = 'contact_form'

	//the modal that will show when someone clicks on "settings" under admin section
	var admin_setting_modal_file = 'temp.html';


	//main div container
	var div_container_class = 'plugin_div_container';
	var div_container_msg = 'container_msg';



    $(document).on('click', btn_admin_setting, function(event) 
    {
    	event.preventDefault();

    	var site_url = js.GetSiteURL();

    	var site_plugin_folder = 'np-content/plugins';
    	
    	var template_file = 'temp.html';

    	var url  = '/'+site_plugin_folder+'/'+plugin_folder_name+'/'+admin_setting_modal_file;

    	
 
    	$.get(url, function(data) 
    	{
    		var strTDIV = '<div class="'+div_container_class+'">'+data+'</div>'

    		//bs.Modal(plugin_name,  strTDIV)

    		var object_data =
			{
				ModalTitle:plugin_name, 
				ModalBodyContent: strTDIV,
			}

			bs.Modal(object_data);

    		//return false;

    		msg_box = $(document).find('.'+div_container_class).find('.'+div_container_msg)
    		var d = bs.WaitingMsg("Please wait....Processing your request");

    		msg_box.html(d).show()


    		var container_data = _.unescape('<button type="button" class="plugin_contact_form_code_with_mark">Contact Form Goes Here</button>');

    		$(document).find('.container_user_data').val(container_data)


    		var DataString = {option_name: plugin_option_name}

    		var ajax = np_admin_ajax_option('GET',DataString);

    		//error
			ajax.fail(function(xhr, ajaxOptions, thrownError)  
			{ 		 	 
			  //do your error handling here
			  
				bs.ClearError();
				var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
				+ 'Please try agin in a few seconds.<br><br>';     

				var ErrorMsg = bs.AlertMsg(Msg,'error');

				msg_box.html(ErrorMsg).show();
				//$('.ScreenData').show();

				console.log(thrownError);
				console.log(xhr); 

				return false    
				 
			})

			//success
			ajax.done(function(data) 
			{ 
				//console.log(data) 

				//clear message box
				msg_box.html('')

				//remove all old instances
				tinymce.remove();

				//editor id
				var editor_id = Math.random().toString(36).substr(2)
				$(document).find('.'+div_container_class).find('.post_contact_msg').attr('id', editor_id);

				//Editor_Basic('.post_contact_msg')
				

				if(data.status == 'success')
				{
					var value_ajax_url = data.option_value.ajax_url;
					var value_post_msg  = data.option_value.post_contact_msg;

					var editor_id = $(document).find('.post_contact_msg').html(value_post_msg);

					//tinymce.get(editor_id).setContent(value_post_msg);

					$(document).find('.ajax_url').val(value_ajax_url);
				}

				Editor_Widget('.post_contact_msg')
			})

		})
    	

    })
	
	
	//--->submit > start
	$(document).on('click', '.btn_update_value', function(event) 
    {
    	event.preventDefault()
    	
    	bs.ClearError()
    	var ele_this = $(this)
 
		//Get the field value
		var post_contact_msg = $(document).find('.post_contact_msg').attr('id');
		var get_post_msg = tinyMCE.get(post_contact_msg).getContent();

		var get_ajax_url =  $(document).find('.ajax_url');

		
		
		var api_key = $(document).find('.pretty_code_option_value')
		 
		// Validate field
		if(frm.IsURL(get_ajax_url.val() ))
		{
			//Show alert
			bs.ShowError ("Invalid URL ",get_ajax_url)
		}
		else
		{
			var d = bs.WaitingMsg("Please wait....Processing your request");

    		$(document).find('.'+div_container_msg).html(d).show();


    		var DataString = 
    		{
    			option_name: plugin_option_name, 
    			option_value: 
    			{
    				ajax_url:get_ajax_url.val(),
    				post_contact_msg:get_post_msg,
    			} 
    		}
    		 

    		var ajax = np_admin_ajax_option('POST',DataString);

    			//error
			ajax.fail(function(xhr, ajaxOptions, thrownError)  
			{ 		 	 
			  //do your error handling here
			  
				bs.ClearError();
				var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
				+ 'Please try agin in a few seconds.<br><br>';     

				var ErrorMsg = bs.AlertMsg(Msg,'error');

				$(document).find('.pretty_code_container_msg').html(ErrorMsg).show();
				//$('.ScreenData').show();

				console.log(thrownError);
				console.log(xhr); 

				return false    
				 
			})

			//success
			ajax.done(function(data) 
			{ 
				//console.log(data) 

				var d = bs.AlertMsg("Updated your api key", "success");

				ele_this.after(d)

				$(document).find('.'+div_container_msg).html('');
			})
		}
    })
	//--->submit > start
})