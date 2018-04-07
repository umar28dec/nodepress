$(document).on('click', '.btn_insert_gallery_screen', function(event) 
{
	event.preventDefault();
	
	bs.ClearError();

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

		$.get('html/014a-insert-gallery.html', function(template_data)     
		{ 

			if(Status == 'error')
			{
				
				BS_Modal('Inset Image From Gallery Below',template_data);

				var d = bs.AlertMsg(data.msg, "error");

				$(document).find('.tab_media').html(d); 	
				 
			}
			else if(Status == 'success')
			{

				
				var img_data = data.arr_files

				//BS_Modal('Inset Image From Gallery Below',create_insert_gallery_view(img_data));
				BS_Modal('Inset Image From Gallery Below', template_data);

				$(document).find('.tab_media').html(create_insert_gallery_view(img_data));

				//add the insert button
				$(document).find('.modal-footer').append('<div class="pull-left btn btn-primary btn_insert_image_to_editor">Insert Images</div>  ')
			}

		})


	});
});


//--->upload new gallery images > start
$(document).on('change', '.btn_insert_gallery_new_media_files', function(event) 
{
	//new_media_file_upload_alert
	var msg_alert = $('.new_insert_gallery_file_upload_alert');
	msg_alert.html('')

	//Clear preview container
 
	var uploadConfig = 
	{
	    acceptedMimeTypes : [ "image/jpeg", "image/png", "image/gif", "image/tiff" ],
	    acceptedExtensions : [ "jpg", "jpeg", "png", "gif", "tiff" ],
	    maxFileSize : 2000000
	};
		
	
	//var user_file = $('.files').files;
	//var files = event.target.files;
	var files = $(this).get(0).files;

	if(files.length <0 || !files)
	{
		//no files were selected.
		//console.log('no files')
		return false;
	}
 

	
	var d = bs.WaitingMsg("Please wait....Processing your files");

	msg_alert.html(d)

	var img_arr = []
	
	//$(document).find('.btn_new_media_files').val('')

	for (var i = 0; i < files.length; i++) 
	{
		msg_alert.html(d)

		var file = files[i]

		var file_name 		= fileReName(file.name)
		var file_size 		= file.size;
		//var my_file_type	= file.type;
		var file_ext 		= fileExt(file_name);
		
		//for image files
		image_file_resize(file, function(data)
		{	
			//msg_alert.html('<h3>Finished Uploading... </h3>') 	
			
			var fname = fileReName(data.file_name)

			np_upload_insert_gallery_images(data.data_blob,fname ) 
		}) 
		
	}
})

var np_upload_insert_gallery_images = function(photo,filename) 
{	 

	var formData = new FormData();
	formData.append('photo', photo,filename);

	$.ajax(
	{
	    xhr: function () 
	    {
	        var xhr = $.ajaxSettings.xhr();
	        xhr.upload.onprogress = function (e) 
	        {
	        	var percentage = Math.floor(e.loaded / e.total * 100); 

	        	$(document).find('.FileUploadProgressBar').show();
	        	$(document).find('.progress-bar').html(percentage+'%'+' Complete (success)');
	        	$(document).find('.progress-bar').css('width', percentage + '%');

	            if(percentage >=100)
	            {
	            	$(document).find('.FileUploadProgressBar').hide();	
	            }
	        };
	        return xhr;
	    },
	    contentType: false,
	    processData: false,
	    cache: false,
	    type: 'POST',
	    data: formData,
	    dataType: 'json',
	    url: '/np-admin/media/put',
	    headers: { "token_value": c.GetObjArr('np_login').admin_token },
	    success: function (data) 
	    {
	    	//console.log(data)
	    	$(document).find('.new_insert_gallery_file_upload_alert').html('<h3>Finished Uploading... </h3>');
	    	$(document).find('.btn_insert_gallery_new_media_files').val('');
	    	
	    	get_latest_gallery_images_and_update_view();      
	    }
    })
}

var get_latest_gallery_images_and_update_view = function()
{

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
 
		//do your success data processing here
		//console.log(data)

		var Status = data.status ;

 		if(Status == 'error')
		{						
			var d = bs.AlertMsg(data.msg, "error");
			$(document).find('.tab_media').html(d);
		}
		else if(Status == 'success')
		{			
			var img_data = data.arr_files;		 
			$(document).find('.tab_media').html(create_insert_gallery_view(img_data));
		}
	});


}
//--->upload new gallery images > end
 

var create_insert_gallery_view = function (files) 
{
	var d1 = alasql('select * from ? order by file_dttm_unix desc', [files])
	var img_data = ' ';

	d1.forEach(function(file) 
    {	
    	var GetSiteURL = js.GetSiteURL();
    	
    	var path = file.file_path.replace(js.GetSiteURL(), '../');
    	var file_path =  file.file_path;

    	var img_check = fileIMGCheck(file.file_name);
 

    	if(img_check)
    	{
    		//is an image file
    	 
	    	img_data += ''
	    	+ '  &nbsp;'
			+'<div class="btn btn-default btn-xs1 insert_image_container " file_name="'+file.file_name+'" >'
				
				+'<br>'
				+'<img src="'+file_path+'" class="img-thumbnail put_checkbox_image" height="100" width="100">'
				+'<br>'
				+'<input type="checkbox" value="'+'../np-content/uploads/'+file.file_name+'" file_name="'+file.file_name+'" class="user_selected_image">'
				+'<br>'			    			
				+'<div  class="img_options1" style="display:none;"> '
					+'<span>'+file.file_name+'</span>'	
					+'<br>'		    					    				
							
				+'</div>'

			+'</div>'
			+ '&nbsp;'
		}
    });
    img_data +=' ';



    var d = ''
    + '<div id="" style="overflow-y: scroll; height:400px;">'+img_data+'</div>';



    return d;
}

//

$(document).on('click', '.put_checkbox_image', function(event) 
{
	event.preventDefault();
	
	var ele = $(this).closest('.insert_image_container').find('.user_selected_image');

	if(!ele.prop("checked")) 
	{
		//check this image
		ele.prop("checked", true);
	}
	else
	{
		//uncheck this image
		ele.prop('checked', false);
	}
	 
});


$(document).on('click', '.btn_insert_image_to_editor', function(event) 
{
	event.preventDefault();
	
	var ele = $(document).find('.user_selected_image');
	var ids = []
	//selected check
	var img = '';
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
 			img += '<p><img src="'+$(this).val()+'" alt="'+$(this).attr('file_name')+'"   /></p>';
			ids.push($(this).val())
		} 
	});
	img +='';
	
	//insert images to editor
	tinymce.get("Content_Post").execCommand('mceInsertContent',false,img);

	//remove the modal
	$(document).find('.modal').remove();
	$(document).find('.modal-backdrop').remove();
	$('body').removeClass( "modal-open" );	 
});

