var Screen_GetPosts = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'posts';


	//var user_id_data =  alasql('Select * FROM np_users')[0];


	var DataString = 
	{		 
		datasend:'get_post',
	};
 
 	console.time('get_posts')
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

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data);

		//console.timeEnd('get_posts')
		var get_status = data.status
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error");
			$('.MsgBox').html(d).show();
			//$('.ScreenData').html().show();
			return false;
		}

		//console.clear()
		$.get('html/003b-post-all.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 

			if(get_status =='no_post')
			{
				var d = bs.AlertMsg("No posts were found...please click on the button above to create one...", "warning");

				$('.posts_alert').html(d).show();	

				$(document).find('.post_data_container').hide()
				$('.ScreenData').show();

				return false;
			}

		
			var get_sit_url = $('.sit_name').attr('href');

			var get_post_data =  alasql('Select * FROM ? order by post_dttm_unix DESC',[data.get_np_join_users_posts]);
 
			var data_table_arr = []
			get_post_data.forEach(function(ele,index)
			{
				var post_id = ele.post_id

				var post_view = '<a   class="btn btn-link" href="/'+ele.post_url+'" target="_blank">View</a> |';
				var post_edit = '<span class="btn btn-link single_post_edit" update_type="edit" post_id="'+post_id+'">Edit</span> |'
				var post_delete = '<span class="btn btn-link single_post_delete" update_type="delete" post_id="'+post_id+'">Delete</span>'

				var post_view_reset = ''		 
				+' | <span class="btn btn-link single_post_veiw_reset" post_id="'+post_id+'" reset_type="post" data-toggle="tooltip" data-original-title="Reset Views To 0">Reset Views</span>'


				var author_id = ele.post_author_id

				var arr_cats = ''
			 	ele.categories.forEach(function(ele2,index)
			 	{
			 		arr_cats += '<a   class="btn btn-link" href="/category/'+ele2.slug+'" target="_blank">'+ele2.name+'</a> |';

			 	})
			 	arr_cats += ''
		 		//format_view_count(ele.post_views,2)
		 		var d1 = ele.post_views < 0 ? format_view_count(ele.post_views,2) :ele.post_views;

				data_table_arr.push([
					'<input type="checkbox" class="bulk_post_id no-sort" post_id="'+post_id+'">', 
					ele.post_title,
					ele.author_name,
					ele.post_status,
					ele.link_access_type ? ele.link_access_type : '' ,	
					arr_cats,
					'<span class="current_post_views">'+    d1 +'</span>',					 				
					ele.post_dttm,
					post_view+''+post_edit+''+post_delete + '' + post_view_reset

				])

			})			 
			$('.MsgBox').hide();

			var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
			var tbl_data = ''
			+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered "  width="100%"></table>';

	 		$(document).find('.all_posts_data').html(tbl_data ).show();

			$('.ScreenData').show();

			$('#'+Data_Table_AutoID+'').DataTable( 
			{
				data: data_table_arr,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 7, 'desc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
				  { title: 'Select<br> <input type="checkbox" class="select_all no-sort">' },
				  { title: "Title" },				 
				  { title: "Author Name" },
				  { title: "Status" },
				  { title: "Access Type"},	
				  { title: "Categories" }, 
				  { title: "Views" },				 
				  { title: "Publish Date&Time" },      
				  { title: "Options" },
				],                
			});  
	    })

	});	 
}


//--->reset view counter - start
$(document).on('click', '.single_post_veiw_reset', function(event) 
{
	var reset_type = $(this).attr('reset_type');
	var post_id = $(this).attr('post_id');
	
	var tbl_row = $(this).closest("tr").children('td');
	var post_name = tbl_row.eq(1).text();
	var author_name = tbl_row.eq(2).text();

	var cur_views  = reset_type == 'post' ? tbl_row.eq(6).find('.current_post_views') : tbl_row.eq(5).find('.current_post_views');
 

	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to reset  views for ( <b>"+post_name+"</b> )  by author <b>("+author_name+")</b>?"
	  +'<br><br>Current views are <b>'+ cur_views.html()+'</b>',
	  confirm: function(button) 
	  {

	    //reset the views to zero	   
 		cur_views.text(0)
 		 

	    //Call resetfunction
	    Post_Reset_Views(post_id);

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
	
})


var Post_Reset_Views = function (post_id)
{  

	var CallType   = 'POST' 
	var AjaxURL    = 'posts/views/reset';
	var DataString = 
	{		 
		datasend:'posts',
		post_id:post_id,
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
			//alasql('DELETE FROM np_terms')
			//alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]); 	 

		}
	});
}
//--->reset view counter - end


//--->update/delete - start
$(document).on('click', '.single_post_edit', function(event) 
{
	var post_id = $(this).attr('post_id');
	screen_single_post_edit(post_id);
})

$(document).on('click', '.single_post_delete', function(event) 
{
	event.preventDefault();

	bs.ClearError();

	var get_update_type = $(this).attr('update_type');
	var post_id = $(this).attr('post_id');
	
	var tbl_row = $(this).closest("tr").children('td');
	var post_name = tbl_row.eq(1).text();
	var author_name = tbl_row.eq(2).text();
 
	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to delete  post( <b>"+post_name+"</b> )  by author <b>("+author_name+")</b>?",
	  confirm: function(button) 
	  {

	    //or run the delete process like this
	    //var TopDiv = tbl_row.remove();
	    tbl_row.css("background-color","#FF3700");

    	tbl_row.fadeOut(400, function()
    	{
        	tbl_row.remove();
    	});

	    //Call your delete function
	    //console.log(post_id)

	    Post_Delete(post_id);

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

var Post_Delete = function (post_id)
{  

	var CallType   = 'DELETE' 
	var AjaxURL    = 'posts';
	var DataString = 
	{		 
		datasend:'posts',
		post_id:post_id,
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
			//alasql('DELETE FROM np_terms')
			//alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]); 	 

		}
	});
}
//--->update/delete - end


//--->load edit post screen - start
var screen_single_post_edit = function (post_id)
{
	var CallType   = 'GET' 
	var AjaxURL    = 'posts/single';
	var DataString = 
	{		 
		datasend:'posts',
		post_id:parseInt(post_id),
	};

	$(document).find('.mce-branding-powered-by').remove()

	ScreenName('Edit Post')
 
 	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.ScreenData').html(d).show(); 

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
			var ErrorMsg = bs.AlertMsg( data.msg, "error")
			$('.MsgBox').html(ErrorMsg).show();	
			return false; 
		}
		else if(get_status == 'success')
		{
			
			//alasql('DELETE FROM np_terms')
			//alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]);

			var post_data = data.post_data[0];
			
			//remove all old instances
			tinymce.remove();

			PostNew     = 'html/003a-post.html';
  
			$.get(PostNew, function(data) 	
			{
				//console.clear();
				$('.ScreenData').html(data).hide();
				


				var GetView = $('.Template_Container_New_Post').html();


				var PostTitle 		= $(document).find('.PostTitle').val(post_data.post_title);
				var PostURL 		= $(document).find('.PostURL').val(post_data.post_url);

				var Content_Teaser 	= $(document).find('.Content_Teaser').html(_.escape(post_data.post_teaser) )
				
				var ReadMore 		= $(document).find('.ReadMore').val(post_data.post_excerpt);
				
				var Content_Post 	= $(document).find('.Content_Post').html(_.escape(post_data.post_content))
				 
				var PostDttm 		= $(document).find('.PostDttm').val( moment(post_data.post_dttm_unix).format("YYYY-MM-DD h:mm:ss a"));				


				var get_link_access_type = post_data.link_access_type ? post_data.link_access_type : 'public'
				var LinkAccessType 	= $(document).find('.LinkAccessType').val(get_link_access_type);

				var PostTags 		= $(document).find('.PostTags').val(post_data.post_tags);

				post_update_comment_allowed(post_data.comments_allow)

				
				if(post_data.post_feature_img)
				{
					$(document).find('.feature_img_thumbnail').attr('src',post_data.post_feature_img);
				}
				else if(!post_data.post_feature_img)
				{
					 $(document).find('.feature_img_div').hide();
				}

				var post_status =  post_data.post_status 

 				$(document).find('.Btn_PublishPost')
				.attr(
				{ 
					update_type:'edit',
					post_id:post_data.post_id,

				})

				$(document).find('.Btn_SaveDraft')
				.attr(
				{ 
					update_type:'draft',
					post_id:post_data.post_id,

				})

				
				
				Editor_Full('.np_editor') 

		 	 
		 		
			 	//var GetSiteURL = js.GetSiteURL();
			 	var cur_post_dttm =   moment(post_data.post_dttm_unix).format("YYYY-MM-DD h:mm:ss a")
			 	$('.curr_post_dttm').html(cur_post_dttm)

			 	var GetSiteURL = $('.sit_name').attr('href');

			 	$(document).find('.SiteURL').html(GetSiteURL); 
		 		
		 		//$(document).find('.PostTags').tagsInput({width:'auto'});
		 		$('.PostTags').tagsInput({width:'auto'} );

		 	
		        var get_categories = alasql('Select * FROM np_terms where term_type="category" ')


		        $('.PostTitle').focus();

		        //clear all the old values
		        $(document).find('.Categories_Options').html('');

		        //--->get all of the categories - start
		        get_categories.forEach(function(element, index)
		        {
		        	var add_categories= ''
		        	+'<option value="'+element.name+'" term_id="'+element.term_id+'">'+element.name+'</option>'
		        	+'<option data-divider="true"></option>'
		        	$(document).find('.Categories_Options').append(add_categories);

		        })       
		        //add user selected categories
		        var user_selected_categories =[]
		        post_data.categories.forEach(function(ele2, index)
		        {
		        	user_selected_categories.push(ele2.name);
		        }) 	
		        var Categories 		= $(document).find('.selectpicker').selectpicker('val', user_selected_categories);
		        //--->get all of the categories - end 

		 		//activate the select picker
		 		$('.selectpicker').selectpicker();
		      
		      	$('.ScreenData').show(); 
			}); 

		}
	});

}



//--->load edit post screen - start
