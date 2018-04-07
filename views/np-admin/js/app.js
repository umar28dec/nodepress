var include_once = function (FileType, FileURL)
{
	var get_file_type = FileType.toLowerCase()

	//--->do js > start
	if(get_file_type == 'js')
    {
    	var get_links    = document.getElementsByTagName('script')

    	//--->loop through all the links > start
	   	var arr = []
	    for (var i = 0; i < get_links.length; i++) 
	    {
	    	var v1 =  get_links[i] 
	    	var link = v1.src

	    	if(link == FileURL)
	    	{   
	    		arr.push(FileURL)
	    	}
		} 
		//--->loop through all the links > end

		//--->add to header > start
		if(arr.length < 1)
  		{
	        var head = document.getElementsByTagName('head')[0]
	        var script = document.createElement('script')
	        script.src = FileURL
	        script.type = 'text/javascript'
	        head.appendChild(script)
	    }
	    //--->add to header > end
    }

    //--->do js > end


	//--->do css > start
	if(get_file_type == 'css')
    {
    	var get_links    = document.getElementsByTagName('link')

    	//--->loop through all the links > start
	   	var arr = []
	    for (var i = 0; i < get_links.length; i++) 
	    {
	    	var v1 =  get_links[i] 
	    	var link = v1.href

	    	if(link == FileURL)
	    	{    	
	    		arr.push(FileURL)
	    	}
		} 
		//--->loop through all the links > end

		//--->add to header > start
		if(arr.length < 1)
  		{
	        var head = document.getElementsByTagName('head')[0];
	        var script = document.createElement('link');
	        script.href = FileURL;
	        script.rel = 'stylesheet';
	        head.appendChild(script)
	    }
	    //--->add to header > end
    }

    //--->do css > end

}

function np_config_ajax(DataString)
{	 
	return $.ajax(
	{
		type: 'POST',
		url: 'np-config/connection-check',
		cache: false,
		data: DataString,
		dataType: "json"
	})
}

function np_admin_ajax_option (CallType,DataString)
{	 	 
	return $.ajax(
	{
		type: CallType,		
		url: '/api/options',
		cache: false,
		headers: { "token_value": c.GetObjArr('np_login').admin_token },
		data: DataString,
		dataType: "json"
	})
}

function np_admin_ajax (CallType,URL,DataString)
{	 	 
	return $.ajax(
	{
		type: CallType,		
		url: URL,
		cache: false,
		headers: { "token_value": c.GetObjArr('np_login').admin_token },
		data: DataString,
		dataType: "json"
	})
}
 
function np_admin_ajax_media_upload (photo,filename) 
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
	    url: '/np-admin/media',
	    headers: { "token_value": c.GetObjArr('np_login').admin_token },
	    success: function (data) 
	    {
	    	GetLatestUploadedMedia();      
	    }
    })
}

function np_admin_ajax_theme_upload (file_obj,filename) 
{	 
	var formData = new FormData();
	formData.append('plugin', file_obj,filename);
	return $.ajax(
	{
	    xhr: function () 
	    {
	        var xhr = $.ajaxSettings.xhr();
	        xhr.upload.onprogress = function (e) 
	        {
	        	var percentage = Math.floor(e.loaded / e.total * 100); 

	        	$(document).find('.ThemeFileUploadProgressBar').show() 
	        	$(document).find('.ThemeFileUploadProgressBar').find('.progress-bar').html(percentage+'%'+' Complete (success)').show()
	        	$(document).find('.ThemeFileUploadProgressBar').find('.progress-bar').css('width', percentage + '%').show()

	            if(percentage >=100)
	            {
	            	$(document).find('.ThemeFileUploadProgressBar').hide()	
	            }
	        };
	        return xhr;
	    },
	    contentType: false,
	    processData: false,
	    cache: false,
	    type: 'PUT',
	    data: formData,
	    dataType: 'json',
	    url: '/np-admin/themes',
	    headers: { "token_value": c.GetObjArr('np_login').admin_token },	    
    })
}


function np_admin_ajax_plugin_upload (file_obj,filename) 
{	 
	var formData = new FormData();
	formData.append('plugin', file_obj,filename);
	return $.ajax(
	{
	    xhr: function () 
	    {
	        var xhr = $.ajaxSettings.xhr();
	        xhr.upload.onprogress = function (e) 
	        {
	        	var percentage = Math.floor(e.loaded / e.total * 100); 

	        	$(document).find('.UpluginUploadProgressBar').show();
	        	$(document).find('.progress-bar').html(percentage+'%'+' Complete (success)');
	        	$(document).find('.progress-bar').css('width', percentage + '%');

	            if(percentage >=100)
	            {
	            	$(document).find('.UpluginUploadProgressBar').hide();	
	            }
	        };
	        return xhr;
	    },
	    contentType: false,
	    processData: false,
	    cache: false,
	    type: 'PUT',
	    data: formData,
	    dataType: 'json',
	    url: '/np-admin/plugins/single',
	    headers: { "token_value": c.GetObjArr('np_login').admin_token },	    
    })
}

var update_menu_comment_counter = function(np_comments_obj)
{
	var np_comments = np_comments_obj
	if(_.size(np_comments)>0)
    {
    	//found pending comments
        var d = '<i class="fa fa-comment-o"></i> Comments <span class="badge">'+_.size(np_comments)+'</span>'                     
        $(document).find('.navbar').find('.fa-comment-o').closest('a').html(d) 
    }
    else if(_.size(np_comments) < 1 )
    {
    	//no pending comments found
        var d = '<i class="fa fa-comment-o"></i> Comments'                     
        $(document).find('.navbar').find('.fa-comment-o').closest('a').html(d) 
    }
}
var update_menu_comment_counter_bulk = function(np_comments_obj)
{
	var ele = $(document).find('.comment_status_updater')
	//this array will get the total pending records from user view
	var np_comments = [] 
	ele.each(function(index, v1)
	{   
		var comment_status = $(this).val()
		if(comment_status =='pending')
		{
			np_comments.push(comment_status)
		} 
	})
	update_menu_comment_counter(np_comments)
}

$(document).on('change', '.btn_new_media_files', function(event) 
{
	//new_media_file_upload_alert
	var msg_alert = $('.new_media_file_upload_alert');
	msg_alert.html('')

	//Clear preview container
	$('.new_media_file_upload_preview').html('')

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
		
		if (uploadConfig.acceptedExtensions.indexOf(file_ext) == -1)
		{  
			//non photo files
			//show_media_file_preview(file_name )

			np_admin_ajax_media_upload(file,file_name ) 

			msg_alert.html('<h3>Finished Uploading... </h3>') 
		}
		else
		{
			//for image files
			image_file_resize(file, function(data)
 			{	
 				msg_alert.html('<h3>Finished Uploading... </h3>') 				 
 				
 				//show_media_file_preview(data.file_name, data.resized_dataURL)
 				
 				var fname = fileReName(data.file_name)

 				np_admin_ajax_media_upload(data.data_blob,fname ) 
 			}) 
		}
	}
})




function GetLatestUploadedMedia()
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

		$('.MsgBox').html(ErrorMsg).show();
		//$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});
	ajax.done(function(data) 
	{ 
		//console.log(data)
		
		var Status = data.status ;
		
		if(Status == 'error')
		{
			 
			var d = bs.AlertMsg(data.msg, "error");
			$('.MsgBox').html(d).show();
			return false;
		}

		else if(Status == 'success')
		{
			var files = data.arr_files;

			var img_data  = GenerateMediaView(files); 
		    $(document).find('.tab_media').html(img_data);
		}
	});  
}
function GenerateMediaView(files)
{	
	var ele = $(document).find('.grid_view_id')

	if(ele.is(":visible") )
	{
		GenerateMediaGridView(files)	
	}
	
	var media_view_check =  $(document).find('.current_view_type').html() 
 

	var media_view_tool_tip;
	if(media_view_check == 'media_view')
	{
		media_view_tool_tip = ''
		+'<small>'
			+'<p class="text-muted">***Click on the media for details.***</p>'
		+'</small>'
	}
	else if(media_view_check != 'media_view')
	{
		media_view_tool_tip = ''
	}

	var img_data = ' ';
	img_data += media_view_tool_tip
	files.forEach(function(file) 
    {	
    	var GetSiteURL = js.GetSiteURL();
    	
    	var path = file.file_path.replace(js.GetSiteURL(), '../');
    	var file_path =  file.file_path;

    	var img_check = fileIMGCheck(file.file_name);

    	var media_file_type; 
    	var get_media_file_name; 


    	if(img_check)
    	{
    		//is an image file
    		media_file_type = '<img src="'+file_path+'" class="img-thumbnail" height="100" width="100">'
    		get_media_file_name = file.file_name; 

    	}
    	else if(!img_check)
    	{
    		media_file_type = '<small>'+file.file_name+'</small>'
    		get_media_file_name = ''; 
    	}
    	
    	img_data += ''
    	+ '  &nbsp;'
		+'<div class="btn btn-default btn-xs1 media_file_id media_file" file_name="'+file.file_name+'" >'
			+'<div class="img_file_alert"></div>'
			+'<br>'
			+media_file_type
			+'<br>'			    			
			+'<div  class="img_options" style="display:none;"> '
				+'<span>'+get_media_file_name+'</span>'	
				+'<br>'		    					    				
				+'<a class="btn btn-default btn-xs open_media_new_win" data-toggle="tooltip" data-placement="bottom" title="Open In New Window" href="'+file_path+'" target="_blank" >Open </a> | '
				+'<div class="btn btn-default btn-xs copy_file_path" file_path="'+file_path+'" data-toggle="tooltip" data-placement="bottom" title="Copy File Path To Clipboard">Copy </div> | '
				+'<div class="btn btn-danger btn-xs delete_media_file" data-toggle="tooltip" data-placement="bottom" title="Delete File" file_name="'+file.file_name+'">Delete </div> | '				
			+'</div>'		    	
		+'</div>'
		+ '  &nbsp;'
    });
    img_data +=' ';

    
    var d = ''
    + '<div id="" style="overflow-y: scroll; height:400px;">'+img_data+'</div>';

    return d;
}

function GenerateMediaGridView(files)
{
	
	var data_table_arr = []
	files.forEach(function(file,index)
	{	

    	var file_path =  file.file_path;

    	var img_check = fileIMGCheck(file.file_name);

    	var media_file_type; 
    	var get_media_file_name; 

    	if(img_check)
    	{
    		//is an image file
    		media_file_type = '<img src="'+file_path+'" class="img-thumbnail" height="75" width="75">'
    		get_media_file_name = file.file_name; 

    	}
    	else if(!img_check)
    	{
    		media_file_type = '<small>'+file.file_name+'</small>'
    		get_media_file_name = ''; 
    	}

		var media_options =  ''
		+'<div  class="grid_view_media_id"  file_name="'+file.file_name+'" > '
				+'<div class="img_file_alert"></div>'	
				+'<br>'		    					    				
				+'<a class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="left" title="Open In New Window" href="'+file_path+'" target="_blank" >Open </a> | '
				+'<div class="btn btn-default btn-xs copy_file_path" file_path="'+file_path+'" data-toggle="tooltip" data-placement="top" title="Copy File Path To Clipboard">Copy </div> | '
				+'<div class="btn btn-danger btn-xs grid_view_delete_media_file" data-toggle="tooltip" data-placement="right" title="Delete File" file_name="'+file.file_name+'">Delete </div> | '				
		+'</div>'	
	 	
		data_table_arr.push(
		[
			'<input type="checkbox" class="bulk_media_file_name no-sort" file_name="'+file.file_name+'">', 
			media_file_type 
			+'<br>'
			+ get_media_file_name
			+'<br>'			
			+media_options

		]) 

	})	
 
 
	var Data_Table_AutoID = "data_table";
  
	var tbl_data = ''
	+ '</br></br> <table id="data_table"  class="table table-hover table-bordered "  width="100%"></table>';

	$(document).find('.tab_grid_view').html(tbl_data ) ;

	bs.ClearError();

	$(document).find('.grid_view_bulk_action_menu').show(); 



	$('#data_table').DataTable( 
	{
		data: data_table_arr,
		"lengthMenu": [ [5,10,25, 50, 100, -1], [5,10, 25, 50, 100, "All"] ],
		"pageLength": 5,
		 
		/*
		fixedHeader: [{
            header: true,
            footer: true
        }],
        */
		order: [[ 0, 'desc' ]],
		"columnDefs": [ {
	      "targets"  : 'no-sort',
	      "orderable": false,
	    }],
		columns: [
		  { title: 'Select<br> <input type="checkbox" class="select_all_media_files no-sort">' },
		  { title: "Media" },				     
		  //{ title: "Options" },
		],                
	}); 
  
}


var show_media_file_preview = function(file_name, img_file_data)
{
	var img_check = fileIMGCheck(file_name);

	var media_file_type; 
	if(img_check)
	{
		//is an image file
		media_file_type = '<img src="'+img_file_data+'" class="img-thumbnail" height="100" width="100">'

	}
	else if(!img_check)
	{
		media_file_type = '<small>'+file_name+'</small>'
	}
	
	var img_data = ''
	+'<button class="btn btn-default ">'	 
		+'<br>'
		+media_file_type
		+'<br>'		    	
	+'</button>'
	+' &nbsp;'

	$('.new_media_file_upload_preview').append(img_data)

}

function ScreenName (GetScreenName) 
{
	if(!GetScreenName)
	{
		$('.CurrentScreenName').html('');		
	}
	else if(GetScreenName)
	{
		$('.CurrentScreenName').html('<i class="fa fa-file-o" aria-hidden="true"> '+ GetScreenName+ '</i>');
	}
}

function RedirectToLoginScreen () 
{
	window.location.href = '/np-admin';
}


function RedirectToAdminScreen () 
{
	window.location.href = '/np-admin/dashboard';
}

function DttmToISOString (fullDate) 
{
	//var fullDateReal = new Date(fullDate);
	//var iso = fullDateReal.toISOString();

	//var iso = moment(fullDateReal);
	return fullDate;
}


//--->Editor - Start

function Editor_Basic(id)
{
	var ele = !id ? 'div.tinymce' : id;
	tinymce.init(
	{
		selector: ele,
		height: 300,
		menubar: false,
		rel_list: 
		[
			{title: 'follow', value: 'follow'},
			{title: 'nofollow', value: 'nofollow'}
		],
		plugins: [
		'advlist autolink lists link image charmap print preview anchor',
		'searchreplace visualblocks code fullscreen',
		'insertdatetime media table contextmenu paste code'
		],
		toolbar: 'undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link |codesample',	
	})
}

function Editor_Widget(id)
{
	var ele = !id ? 'div.tinymce' : id;
	tinymce.init(
	{
		selector: ele,
		height: 300,
		menubar: false,
		rel_list: 
		[
			{title: 'follow', value: 'follow'},
			{title: 'nofollow', value: 'nofollow'}
		],
		plugins: 
		[
			'advlist autolink lists link image charmap hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table directionality',
			'emoticons template paste textcolor colorpicker textpattern codesample toc'
		],
		toolbar1:'undo redo |styleselect  formatselect | fontselect | fontsizeselect ',
		toolbar2: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink | image',
		toolbar3: 'media | forecolor | backcolor | emoticons | code ',

		file_browser_callback : function($input, deepDataAndEvents, dataAndEvents, wind) 
		{
		    /** @type {string} */
		    var requestUrl = "filebrowser.html";
		    requestUrl += requestUrl.indexOf("?") < 0 ? "?type=" + dataAndEvents : "&type=" + dataAndEvents;
		    tinymce.activeEditor.windowManager.open(
		    {
		      title : "File Browser ",
		      width : 800,
		      height : 600,
		      url : requestUrl
		    }, 
		    {
		      window : wind,
		      input : $input
		    });
		    return false;
		},

	})
}
var Editor_Full = function (id, plugins)
{
	var ele = !id ? 'div.tinymce' : id

	tinymce.init(
	{
		selector: ele,

		height: 500,
		theme: 'modern',	

		browser_spellcheck: true,
		force_p_newlines : true,
		valid_elements : '+*[*]',
		format: 'html',
		relative_urls: true,


		plugins: 
		[
			'advlist autolink lists link image charmap hr anchor pagebreak',
			'searchreplace wordcount visualblocks visualchars code fullscreen',
			'insertdatetime media nonbreaking save table directionality',
			'emoticons template paste textcolor colorpicker textpattern codesample toc'
		],
		toolbar1:'undo redo |styleselect  formatselect | fontselect | fontsizeselect ',
		toolbar2: 'bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink | image',
		toolbar3: 'media | forecolor | backcolor | emoticons | codesample | code ',
		toolbar4: 'template',

		//fontsize_formats: '8pt 10pt 12pt 14pt 18pt 20pt 36pt',

		//fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 22px 24px 36px",
		
		image_advtab: true,

		rel_list: 
		[
			{title: 'nofollow', value: 'nofollow'},
			{title: 'follow', value: 'follow'}			
		],

		file_browser_callback : function($input, deepDataAndEvents, dataAndEvents, wind) 
		{
		    /** @type {string} */
		    var requestUrl = "filebrowser.html";
		    requestUrl += requestUrl.indexOf("?") < 0 ? "?type=" + dataAndEvents : "&type=" + dataAndEvents;
		    tinymce.activeEditor.windowManager.open(
		    {
		      title : "File Browser ",
		      width : 800,
		      height : 600,
		      url : requestUrl
		    }, 
		    {
		      window : wind,
		      input : $input
		    });
		    return false;
		},

		//for plugins pre text/container
		templates: plugins,		

	});


}

function Editor(id)
{
	var ele = !id ? 'div.tinymce' : id;
	tinymce.init(
	{
		selector: ele ,
		browser_spellcheck: true,
		block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3',
		//inline: true,
		theme: 'modern',
		height: 500,
		paste_data_images: true,
		valid_elements : '+*[*]',

		format: 'html',
		forced_root_block : false,
		//images_upload_base_path: '../np-content/uploads/',
		relative_urls: true,
  		remove_script_host: false,
  		//apply_source_formatting : true,

		file_browser_callback : function($input, deepDataAndEvents, dataAndEvents, wind) 
		{
		    /** @type {string} */
		    var requestUrl = "filebrowser.html";
		    requestUrl += requestUrl.indexOf("?") < 0 ? "?type=" + dataAndEvents : "&type=" + dataAndEvents;
		    tinymce.activeEditor.windowManager.open(
		    {
		      title : "File Browser ",
		      width : 800,
		      height : 600,
		      url : requestUrl
		    }, 
		    {
		      window : wind,
		      input : $input
		    });
		    return false;
		},

		rel_list: 
		[
			{title: 'follow', value: 'follow'},
			{title: 'nofollow', value: 'nofollow'}
		],
		
		plugins: 
		[
			"autolink autoresize lists link image paste preview",
			"searchreplace fullscreen  ",
			"emoticons template paste textcolor colorpicker textpattern  codesample toc",
			"wordcount  media table insertdatetime advlist charmap nonbreaking  codesample code"
		], 
		//contextmenu: "link image quickimage spellchecker ",
		menubar: 'edit insert format table tools code ',		
		toolbar1: "insertfile undo redo | styleselect  | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		toolbar2: "mybutton | media | forecolor backcolor emoticons | codesample | code ",


		image_prepend_url: "../np-content/uploads/",
	 
  		//force_br_newlines : true,
  		//this will clear all previous formating
        force_p_newlines : true,
/*
		image_list: [
    		{title: 'Dog', value: '../np-content/uploads/nodepress-js.png'},
    		{title: 'Cat', value: 'mycat.gif'}
  		],
		*/
		image_advtab: true,
		templates: [
    		{ title: 'Test template 1', content: 'Test 1' },
    		{ title: 'Test template 2', content: 'Test 2' }
  		]
  
	});

} 
//--->Editor - End


var DetectIE = function () 
{
	/*
		detect IE
		returns version of IE or false, if browser is not Internet Explorer
	*/
    var ua = window.navigator.userAgent; 
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


var image_file_resize = function (f,callback) 
{
  //Retrieve all the files from the FileList object
  //var files = evt.target.files; 
  
  if (f) 
  {
  	var resize = function(dataURL, maxSize, filetype, callback) 
	{
		var _this = this;

		var image = new Image();
		image.onload = function (imageEvent) 
		{

			// Resize image
			var canvas = document.createElement('canvas'),
				width = image.width,
				height = image.height;
			if (width > height) 
			{
				if (width > maxSize) 
				{
					height *= maxSize / width;
					width = maxSize;
				}
			} 
			else 
			{
				if (height > maxSize) 
				{
					width *= maxSize / height;
					height = maxSize;
				}
			}
			canvas.width = width;
			canvas.height = height;
			
			canvas.getContext('2d').drawImage(image, 0, 0, width, height);
			
			//--->0.38 = 38%
			var qualityArgument =  0.38 ; 

			canvas.toBlob(function(blob)
			{
				var return_obj =
				{
					data_url: canvas.toDataURL(filetype, qualityArgument),
					data_blob:blob,							 
				}
				callback(return_obj);
			}, filetype, qualityArgument)

		}
		image.src = dataURL; 
	} 
	var r = new FileReader();
	r.onload = (function(f) 
	{ 
		return function(e) 
		{
		  var contents 		= e.target.result;
		  var dataURL 		= e.target.result;
		  var filename 		= f.name; 
		  var filenameExt 	= fileExt(filename)
		  var filetype 		= f.type;
		  var filesize 		= f.size;
		  var initialSize 	= f.size;
		  var maxSize 		= 1500;

		  	resize (dataURL, maxSize, filetype, function (resizedFile)
		  	{
		  		//console.log(resizedFile);
		  		 
		  		var data_url = resizedFile.data_url;
		  		var data_blob = resizedFile.data_blob;

		      	var resizedSize =   Math.round(data_url.length * 6 / 8);
		      	var reduced_percentage = Math.round((initialSize - resizedSize) / initialSize * 100)
		      	//base64-encoded bytes
				var base64_encoded_bytes = contents.substr(contents.indexOf('base64,')+7);	

				callback(
				{
					file_name:filename,
					file_ext:filenameExt,
					file_type:filetype,
					initial_size: fileSize(initialSize),
					resized_size : fileSize(resizedSize),
					reduced_percentage: reduced_percentage+'%',
					resized_dataURL:data_url,
					base64_encoded_bytes:base64_encoded_bytes,
					data_blob:data_blob, 							
				})						 
			}) 
		}; 

	})(f);
	r.readAsDataURL(f); 
       
  } 
  else 
  {
    console.log("Failed to load files"); 
  }   
}

var fileIMGCheck = function (filename) 
{
	var file_ext = fileExt(filename.toLowerCase())

	var uploadConfig = 
	{
		acceptedMimeTypes : [ "image/jpeg", "image/png", "image/gif", "image/tiff" ],
		acceptedExtensions : [ "jpg", "jpeg", "png", "gif", "tiff" ],
	};

	if (uploadConfig.acceptedExtensions.indexOf(file_ext) == -1)
	{
		//not an image file
		//console.log('file_ext '+file_ext)
		return false;
	}
	else
	{
		//is an image file		
		return true; 
	}
	 		
}
 
var parseURL = function (url) 
{
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length )
    {
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}


var fileReName = function (filename) 
{
	return filename.replace(/\s+/g, '-').toLowerCase(); 
};
var fileExt = function (filename) 
{
	return filename.split('.').pop().toLowerCase();
};

var fileSize = function (size) 
{
	var i = Math.floor(Math.log(size) / Math.log(1024));
	return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};

var GetRandomID = function (len) 
{
	/*
		- will generate random string(numbers and letters only) 
		  between 9 to 12 character long
		- if no len is provided, it will ignore the len parameter
		  and give max length string
	*/ 	 
	return Math.random().toString(36).substr(2,len) ;
};


//--->URL Validator - Start
var URL_ID = function (url_id) 
{
	/*
		Will check to make sure that no special characters are in post url
	*/

	//Set to lower case first
	var val = url_id.toLowerCase();

	//Check for any space or special characters(!@#$%^&*() )
	var Check = val.replace(/[^\w]+/g, '-');

	//Check for ' - ' ...  if found, just leave it.
	///\w+$/
	//Check.replace(/\-+$/, '007');
	Check.replace(/^-+/, '');
	
	return Check
};
//--->URL Validator - End

var BS_Tabs = function (ObjArr)
{	
	/*
		Will create a Bootstrap tab screen

		//example tab data array
		var arr = [	
			{tab_name:'tab 1', tab_content: "this is my tab 1 contain is"},
			{tab_name:'tab 2', tab_content: "this is my tab 2 "},
		]
	*/
	//Get object Arr
	var arr = ObjArr; 

	var id 	= GetRandomID(3);

	//--->get tab name - start
	var strTabName = '';
	strTabName +='<ul class="nav nav-tabs" role="tablist">';
	arr.forEach( function(element, index) 
	{
		var tab_id =  (element.tab_name).replace(/[^\w]+/g, '-') +'-id-'+id
		var tab_name = element.tab_name
		if(index <1)
		{
			strTabName +='<li role="presentation" class="active"><a href="#'+tab_id+'"  role="tab" data-toggle="tab">'+tab_name+'</a></li>'
		}
		else
		{
			strTabName +='<li role="presentation"><a href="#'+tab_id+'"  role="tab" data-toggle="tab">'+tab_name+'</a></li>'
		}
		 
	});
	strTabName +='</ul>';
	//--->get tab name - end

	//--->get tab content - start
	var strTabContent = '';
	strTabContent +='<div class="tab-content" style="padding:10px;">';
	arr.forEach( function(element, index) 
	{
		var tab_id =  (element.tab_name).replace(/[^\w]+/g, '-') +'-id-'+id
		var tab_content = element.tab_content
		if(index <1)
		{
			strTabContent +='<div role="tabpanel" class="tab-pane active '+tab_id+'" id="'+tab_id+'">'+tab_content+'</div>'
		}
		else
		{
			strTabContent +='<div role="tabpanel" class="tab-pane '+tab_id+'" id="'+tab_id+'">'+tab_content+'</div>'
		}
		 
	});
	strTabContent +=' </div>';
	//--->get tab content - end

	var strTabDiv = ''
	+'<div class="panel panel-default"  >'
	+ '<div style="padding:10px;">'
	+ strTabName
	+ strTabContent
	+ '</div>'
	+ '</div>'
	//console.log(strTabDiv)
	return strTabDiv;
	
}

var BS_Modal = function (ModalTitle,ModalBodyContent)
{
	//remove all old modals first
	$(document).find('.np-modal').remove();

	var modalHTML =''+
	'<div class="modal fade np-modal" id="myModal" role="dialog">'+
		
		//--->Modal - Stat
		'<div class="modal-dialog modal-lg">'+

			'<div class="modal-content">'+
				
				//--->Modal Header - Start
				'<div class="modal-header">'+
					//Close button
					'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
					//Title
					'<h4 class="modal-title">'+ModalTitle+'</h4>'+

				'</div>'+
				//--->Modal Header - End

				//--->Modal Body - Start
		        '<div class="modal-body">'+
		          ''+ModalBodyContent+''+
		        '</div>'+
		        //--->Modal Body - End

		        //--->Modal Footer - Start
		        '<div class="modal-footer">'+
		          '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
		        '</div>'+
		        //--->Modal Footer - End


			'</div>'+

		'</div>'+
		//--->Modal - End
	'</div>';
	
	//add new modal to body
	$('body').append(modalHTML);

	$('#myModal').modal('show');
}