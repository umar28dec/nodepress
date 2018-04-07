var Screen_Plugins_Upload_New = function ()
{
	$.get('html/009b-plugins-upload-new.html', function(template_data)     
	{  
		//load the template
		$('.ScreenData').html(template_data).show()
	})
}



//--->upload new plugin zip file > start
$(document).on('change', '.btn_new_upload_plugin', function(event) 
{
	//new_media_file_upload_alert
	var msg_alert = $('.new_plugin_file_upload_alert')
	var screen_data = $('.container_new_plugin_uploader')

	msg_alert.html('')
		
	var file = event.target.files[0];
		
	//--->no file was selected > start
	if(!file)
	{
		//no files were selected.
		//console.log('no files')
		return false;
	}
	//--->no file was selected > end
 

	//--->file is not zip > start
	if(fileExt(file.name) !='zip')
	{
		msg_alert.html('Only zip files are allowed')
		return false
	}	
	//--->file is not zip > end

	var file_name 		= fileReName(file.name)
	var file_size 		= file.size
	var file_ext 		= fileExt(file_name)

	
	//--->upload the zip file > start	

	var d = bs.WaitingMsg("Please wait....Processing your upload plugin")

	msg_alert.html(d)

	screen_data.hide()



	var ajax = np_admin_ajax_plugin_upload(file,file_name);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
		//do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>';     

		var ErrorMsg = bs.AlertMsg(Msg,'error');

		msg_alert.html(ErrorMsg).show();
		screen_data.show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	}) 

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data);

		var get_status = data.status 

		if(get_status =="success")
		{
			var d = bs.AlertMsg("Plugin uploaded...", "success")
			+'<br><br>'
			+'<a href="#/plugins/installed" class="ScreenMenu btn btn-primary"> View Plugins</a>'
			msg_alert.html(d )

			$('.btn_new_upload_plugin').val('')
			screen_data.show()

		}


	}) 
	//--->upload the zip file > end

})

//--->upload new plugin zip file > end