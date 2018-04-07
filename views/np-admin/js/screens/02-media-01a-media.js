var Screen_GetMediaLibrary = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading media library screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'media';
	var DataString = 
	{		 
		datasend:'files',
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
		 
	});

	ajax.done(function(data) 
	{ 
		$('.MsgBox').hide();
 
		//do your success data processing here
		//console.log(data)
		
		var Status = data.status ;
		$.get('html/005a-media.html', function(template_data)     
		{  
			//load the template
			$('.ScreenData').html(template_data).show();  
			$(document).find('.current_view_type').html('media_view') 			

			if(Status == 'error')
			{
				var d = bs.AlertMsg(data.msg, "error");
				
				$(document).find('.tab_media').html(d); 

				$(document).find('.media_alert').html(d); 

				$(document).find('.grid_view_bulk_action_menu').hide(); 

				
				$(document).find('.grid_view_id').show();

			}
			else if(Status == 'success')
			{
				var img_data = data.arr_files

				$(document).find('.tab_media').html(GenerateMediaView(img_data));

				GenerateMediaGridView(img_data)

				$(document).find('.grid_view_id').show();
			}
 		});
	});
}


//--->media options - start
$(document).on('click', '.media_file', function(event) 
{
	event.preventDefault();
	var feature_img_check = $(document).find('.current_view_type').html()

	$(document).find('.img_options').hide()

	if(feature_img_check !='feature_img')
	{
		$(this).find('.img_options').show()
	}	
});


$(document).on('click', '.open_media_new_win', function(event) 
{
	/*
		in case if the link doesn't open in regular way
	*/
	var get_href = $(this).attr('href');
	window.open(get_href, '_blank');	 	
});

//--->media options - end


function copyToClipboard(copy_value) 
{

  // Create a "hidden" input
  var aux = document.createElement("input");

  aux.setAttribute("value", copy_value);

  // Append it to the body
  document.body.appendChild(aux);
  // Highlight its content
  aux.select();
  // Copy the highlighted text
  document.execCommand("copy");
  // Remove it from the body
  document.body.removeChild(aux);
}

$(document).on('click', '.copy_file_path', function(event) 
{
	event.preventDefault();

	var d =  $(this).attr('file_path');

	copyToClipboard(d) 
	
	$(this).closest('.grid_view_media_id').find('.img_file_alert').html('<p class="text-success">copied</p>')
	
	$(this).closest('.media_file').find('.img_file_alert').html('<p class="text-success">copied</p>')

});


//--->upload new media - start
 
$(document).on('click', '.upload_new_check', function(event) 
{
	/*
		clear the old select files option
	*/
	$(document).find('.btn_new_media_files').val('')
	$(document).find('.new_media_file_upload_preview').html('')
	$(document).find('.new_media_file_upload_alert').html('') 

})
//--->upload new media - end 



//--->delete media file - start
$(document).on('click', '.delete_media_file', function(event) 
{
	event.preventDefault();
	
	var get_media_file_name = $(this).attr('file_name');

	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to delete file <b>("+get_media_file_name+")</b>?",	  
	  confirm: function(button) 
	  {
	    //Call your delete function
	   	update_delete_file_media_views(get_media_file_name);

	    delete_media_file(get_media_file_name) 

	  },
	  cancel: function(button) 
	  {
	    // nothing to do
	  },
	  confirmButton: "Yes I am",
	  cancelButton: "No",                       
	  confirmButtonClass: "btn-danger",    //Bootstrap button class
	  cancelButtonClass: "btn-default",    //Bootstrap button class
	  dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
	}

	//Call is like this
	bs.confirm(ObjArrOptions);
	return false; 
});

//
$(document).on('click', '.grid_view_delete_media_file', function(event) 
{
	event.preventDefault();
	
	var top_element = $(this).closest('.media_file');

	var tbl_row = $(this).closest("tr").children('td');

	var get_media_file_name = $(this).attr('file_name');

	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to delete file <b>("+get_media_file_name+")</b>?",	  
	  confirm: function(button) 
	  {
 
	   	//Call your delete function
	    update_delete_file_media_views(get_media_file_name);

	    delete_media_file(get_media_file_name) 

	  },
	  cancel: function(button) 
	  {
	    // nothing to do
	  },
	  confirmButton: "Yes I am",
	  cancelButton: "No",                       
	  confirmButtonClass: "btn-danger",    //Bootstrap button class
	  cancelButtonClass: "btn-default",    //Bootstrap button class
	  dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
	}

	//Call is like this
	bs.confirm(ObjArrOptions);
});

function update_delete_file_media_views(media_file_name)
{
	/*
		this will update both views (media and grid)
		will remove the file from user's view
	*/

	var tab_media = $(document).find('.media_file');
	var tab_grid_view = $(document).find('.bulk_media_file_name') 

	var table = $('#data_table').DataTable()

	//--->delete from grid vew - start
	$.each(tab_grid_view, function(index, val) 
	{
		var lookup = $(this) 
		if(lookup.attr('file_name') == media_file_name)
		{
			
			var tbl_row = lookup.closest("tr").children('td');
			
			tbl_row.css("background-color","#FF3700");

			//this will update row counter
			lookup.closest("tr").addClass('selected');
			table.row('.selected').remove().draw( false );

	    	tbl_row.fadeOut(400, function()
	    	{	        	
	        	tbl_row.remove();
	    	}); 
	    	
		}
	});

	//--->delete from grid vew - end

 
	//--->delete from media vew - start
	$.each(tab_media, function(index, val) 
	{
		var lookup = $(this);
		if(lookup.attr('file_name') == media_file_name)
		{ 
			var tbl_row = $(this)
			 
			tbl_row.css("background-color","#FF3700");
			 
	    	tbl_row.fadeOut(400, function()
	    	{
	        	tbl_row.remove();
	    	});
	    	 
		}
	});

	//--->delete from media vew - end 
 
	if(tab_grid_view.length < 2 )
	{
		var d = bs.AlertMsg('no files', "error");

		$(document).find('.tab_media').html(d); 

		$(document).find('.media_alert').html(d); 

		$(document).find('.grid_view_bulk_action_menu').hide(); 

		$(document).find('.tab_grid_view').html('')
		$(document).find('.grid_view_id').show();
	}
}

function delete_media_file(media_file_name) 
{
	
	var CallType   = 'DELETE' 
	var AjaxURL    = 'media';
	var DataString = 
	{		 
		datasend:'media_file_name',
		media_file_name: media_file_name,
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

		this_ele.removeClass('disabled');

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data); 

		var get_status = data.status;

		if(get_status == 'error')
		{
			var d = bs.AlertMsg( data.msg, "error")
		}
		else if(get_status == 'success')
		{
			 

		}
	});
}


//--->delete media file - end