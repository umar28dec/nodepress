 
$(document).on('click', '.ScreenData .Btn_Feature_IMG', function(event) 
{
	event.preventDefault();

	var loading = ' <i class="fa fa-spinner fa-spin fa-4x pull-center"></i><br>LOADING  ';
	//$('.Loading').html(loading);

	//$('.Btn_Feature_IMG').hide();

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

		$('.LoginAlert').html(ErrorMsg).show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		$('.LoadingMsg').hide();
 
		//do your success data processing here
		//console.log(data)
		
		var Status = data.status ;

		$.get('html/005a-media.html', function(template_data)     
		{  
			//load the template
			//$('.IMGContent').html(template_data).show(); 

			var ObjArrOptions = 
			{
			  title: "Featurn Image",
			  text: template_data ,
			  
			  confirm: function(button) 
			  {
			    //Call your delete function
			    
			  },
			  cancel: function(button) 
			  {
			    // nothing to do
			  },
			  confirmButton: "OK",
			  cancelButton: "Close",                       
			  confirmButtonClass: "btn-default",    //Bootstrap button class
			  cancelButtonClass: "btn-default",    //Bootstrap button class
			  dialogClass: "modal-dialog modal-lg" // Bootstrap classes for large modal
			}

			//Call is like this
			bs.confirm(ObjArrOptions)
  			
			$(document).find('.current_view_type').html('feature_img')
			if(Status == 'error')
			{
				var d = bs.AlertMsg(data.msg, "error");
				
				$(document).find('.tab_media').html(d); 				

			}
			else if(Status == 'success')
			{
				var img_data = data.arr_files
				$('.Btn_Feature_IMG').show();
				
				$(document).find('.tab_media').html(GenerateMediaView(img_data));
			}
 		}); 
		


	});

});

 
//--->add/update - start
$(document).on('click', '.media_file', function(event) 
{
	event.preventDefault();

	var d1 = $(this).find('.copy_file_path').attr('file_path');

	var urlNoProtocol = js.GetSiteURL().replace(/^https?\:\/\//i, "//");

	var get_img_src = d1.replace(urlNoProtocol, '../')
	
	$(document).find('.feature_img_thumbnail').attr('src', get_img_src);
	$(document).find('.feature_img_div').show();	

	$(document).find('.Btn_Feature_IMG').html('Update Image');

	//Close the image screen
	$('.modal').modal('hide');

});
//--->add/update - start

//--->remove - start

$(document).on('click', '.btn_feature_img_thumbnail', function(event) 
{
	event.preventDefault();

	//var get_img_src = $(this).attr('src', '#');

	//console.log(' made it to feature_img_thumbnail')

	$(document).find('.Btn_Feature_IMG').html('Add Image');

	//$(document).find('.feature_img_div').hide();	
	$(document).find('.feature_img_div').hide();
	$(document).find('.feature_img_thumbnail').attr('src', '');

})
//--->remove - end