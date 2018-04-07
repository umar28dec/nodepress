var Screen_Data_Import = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading export screen")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	$.get('html/013a-tools-import.html', function(template_data)     
    {
    	$('.MsgBox').hide() 

    	$('.ScreenData').html(template_data).show()  


    	$('.import_type').hide().val('delete')
    })
}

$(document).on('click', '.btn_import_site_data_file', function(event) 
{
	event.preventDefault()

	bs.ClearError();

	var input

    if (typeof window.FileReader !== 'function') 
    {
      $('.MsgBox').html("The file API isn't supported on this browser yet.").show() 
      return false 
    }

    if( $('.import_type').val() =='' )
    {
    	var d = bs.AlertMsg("Please select import type", "error")
    	$('.MsgBox').html(d).show() 
    	return false 
    }

    var input = $('.import_site_file').get(0).files

	if(_.size(input) < 1)
	{
		//no files were selected.
		//console.log('no files')
		return false;
	} 
    
    var file_ext = fileExt(input[0].name)
     

    if(file_ext == 'json')
    {  
		file = input[0] 
		fr = new FileReader()
		fr.onload = receivedText
		fr.readAsText(file)
    }
 	else  
    {  
		var d = bs.AlertMsg("Oppss... only JSON  file is accepted", "error")
    	$('.MsgBox').html(d).show() 
    	return false 
    }
     
}) 
var validate_import_data = function(obj_arr)
{
	/*
	var obj_arr {
	fields_requried:fields_requried,
	fields_json_file:fields_json_file,        
	}
	*/
	var db_data = obj_arr.fields_json_file

	var fields_requried = obj_arr.fields_requried


	var get_users = []
	$.each(db_data[0], function(i1, v1) 
	{        
		get_users.push(i1)
	}) 

	var equal_check =  _.isEqual(get_users, fields_requried) 

	var result 

	if(!equal_check)
	{
		//find where the difference is

		var diff_user_data = _.difference(fields_requried, get_users) 

		var diff_db_data = _.difference(get_users, fields_requried)  

		//check  if user data has more fields
		if(_.size(diff_user_data)>0)
		{ 
		  result ={status: 'error', msg:'required has extra field/object', extra:diff_user_data,  }
		}
		else if(_.size(diff_db_data) > 0)
		{
		  result ={status: 'error', msg:'import file has extra field/object', extra:diff_db_data}
		}
	}
	else 
	{
		result ={status: 'success', }
	}
	return result
}

function receivedText(e) 
{
  lines = e.target.result

 	//add it to localstorage for later calling
 	ls.AddTempBulkArr('import_data',JSON.parse(lines))
 
  process_import_data() 
}

var process_import_data  = function()
{ 
	 
	var data = ls.GetAllArr('import_data')
 

	//check for data objects
 
 	var check_np_users 		= data.np_users 
 	var check_np_options 	= data.np_options
 	var check_np_posts 		= data.np_posts
 	var check_np_terms 		= data.np_terms
	var check_np_comments 	= data.np_comments

	if(!check_np_users)
	{
		var msg = ''
		+'Your data file is missing the following object:<br><br>'
		+'<i class="fa fa-times" aria-hidden="true"> np_users </i>'
		var d = bs.AlertMsg(msg, "error")
		$('.import_error_msg').html(d)
		return false
	}
	else if(!check_np_options)
	{
		var msg = ''
		+'Your data file is missing the following object:<br><br>'
		+'<i class="fa fa-times" aria-hidden="true"> np_options </i>'
		var d = bs.AlertMsg(msg, "error")
		$('.import_error_msg').html(d)
		return false
	}
	else if(!check_np_posts)
	{
		var msg = ''
		+'Your data file is missing the following object:<br><br>'
		+'<i class="fa fa-times" aria-hidden="true"> np_posts </i>'
		var d = bs.AlertMsg(msg, "error")
		$('.import_error_msg').html(d)
		return false
	}
	else if(!check_np_terms)
	{
		var msg = ''
		+'Your data file is missing the following object:<br><br>'
		+'<i class="fa fa-times" aria-hidden="true"> np_terms </i>'
		var d = bs.AlertMsg(msg, "error")
		$('.import_error_msg').html(d)
		return false
	}
 	
 	/*

	//--->np_users > start
	var validate_np_users  = validate_import_data(
	{
		fields_requried:["user_id","user_login","user_pass","user_email","user_url","user_access_type","display_name","rec_dttm","rec_dttm_unix"],
		fields_json_file: data.np_users 
	})

	if(validate_np_users.status =="error")
	{
		var msg = ''
		+'In your data file for object (np_users) '
		+'.... It is missing the following<br><br>'

		validate_np_users.extra.forEach(function(ele)
		{
			msg +='<i class="fa fa-times" aria-hidden="true"> '+ele+'</i>'
			msg += '<br>'
		})
		msg +=''

		var d = bs.AlertMsg(msg, "error");

		$('.import_error_msg').html(d)

		return false
	}
	//--->np_users > end

	//--->np_options > start
	var validate_check_np_options  = validate_import_data(
	{
		fields_requried:["option_id","option_name","option_value","autoload","rec_dttm","rec_dttm_unix"],
		fields_json_file: data.np_options 
	})

	if(validate_check_np_options.status =="error")
	{
		var msg = ''
		+'In your data file for object (np_options ) '
		+'.... It is missing the following<br><br>'

		validate_check_np_options.extra.forEach(function(ele)
		{
			msg +='<i class="fa fa-times" aria-hidden="true"> '+ele+'</i>'
			msg += '<br>'
		})
		msg +=''

		var d = bs.AlertMsg(msg, "error");

		$('.import_error_msg').html(d)

		return false
	}
	//--->np_options > end

	//--->np_posts > start
	var validate_check_np_posts = validate_import_data(
	{
		fields_requried:["post_id","post_author_id","post_dttm","post_dttm_unix",		
		"post_title","post_url","post_teaser","post_tags",
		"post_excerpt","post_content","post_status","link_access_type",
		"post_feature_img","page_template","post_type","categories",
		"post_views","comments_allow","comment_counter",
		"rec_dttm","rec_dttm_unix"],
		fields_json_file: data.np_posts 
	})

	if(validate_check_np_posts.status =="error")
	{
		var msg = ''
		+'In your data file for object (np_posts) '
		+'.... It is missing the following<br><br>'

		validate_check_np_posts.extra.forEach(function(ele)
		{
			msg +='<i class="fa fa-times" aria-hidden="true"> '+ele+'</i>'
			msg += '<br>'
		})
		msg +=''

		var d = bs.AlertMsg(msg, "error");

		$('.import_error_msg').html(d)

		return false
	}
	
	//--->np_posts > end

	//--->np_terms > start
	var validate_check_np_terms  = validate_import_data(
	{
		fields_requried:["term_id","name","slug","term_type","rec_dttm","rec_dttm_unix"],
		fields_json_file: data.np_terms 
	})

	if(validate_check_np_terms.status =="error")
	{
		var msg = ''
		+'In your data file for object (np_terms ) '
		+'.... It is missing the following<br><br>'

		validate_check_np_terms.extra.forEach(function(ele)
		{
			msg +='<i class="fa fa-times" aria-hidden="true"> '+ele+'</i>'
			msg += '<br>'
		})
		msg +=''

		var d = bs.AlertMsg(msg, "error");

		$('.import_error_msg').html(d)

		return false
	}
	//--->np_terms > end


	if(_.size(check_np_comments) > 0 )
	{
		//--->np_comments > start
		var validate_check_np_comments  = validate_import_data(
		{
			fields_requried:["comment_id","post_id",
			"comment_author","comment_author_email","comment_author_url",
			"comment_author_ip","comment_content","comment_status",
			"rec_dttm","rec_dttm_unix"],
			fields_json_file: data.np_comments 
		})

		if(validate_check_np_comments.status =="error")
		{
			var msg = ''
			+'In your data file for object (np_terms ) '
			+'.... It is missing the following<br><br>'

			validate_check_np_comments.extra.forEach(function(ele)
			{
				msg +='<i class="fa fa-times" aria-hidden="true"> '+ele+'</i>'
				msg += '<br>'
			})
			msg +=''

			var d = bs.AlertMsg(msg, "error");

			$('.import_error_msg').html(d)

			return false
		}
		//--->np_comments > end
	}
	*/

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....processing your import request")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();
 
	var import_type = $('.import_type').val()

	var file = $('.import_site_file').prop('files')[0];

	var file_name 		= moment().format('Y-MM-DD_hh-mm-ss_a_')+fileReName(file.name)
	var file_size 		= file.size;
	//var my_file_type	= file.type;
	var file_ext 		= fileExt(file_name);

  	var formData = new FormData();
	formData.append('file', file,file_name);
	formData.append("import_type", import_type);
 
	$.ajax(
	{	    
	    contentType: false,
	    processData: false,
	    cache: false,
	    type: 'POST',
	    data: formData,
	    dataType: 'json',
	    url: '/np-admin/import',
	    headers: { "token_value": c.GetObjArr('np_login').admin_token },
	    success: function (data) 
	    {
	    	console.log(data);

			var d = bs.AlertMsg(data.msg, "success")
			$('.MsgBox').html(d)

			$('.ScreenData').show() 

			$('.logout').click()
	    	 
	    },
	    error: function (data) 
	    {
	    	console.log(data);

	    	var error_msg = bs.AlertMsg(data.responseText, "error");

	    	$('.MsgBox').html(error_msg).show();

	    	$('.ScreenData').show();	    	 
	    }
    })

 	 
}

