var Screen_GetPages = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'pages';


	//var user_id_data =  alasql('Select * FROM np_users')[0];


	var DataString = 
	{		 
		datasend:'get_page',
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

	//success
	ajax.done(function(data) 
	{ 
 		//console.log(data); 
 		
		var get_status = data.status
		if(get_status =='error' )
		{
			var d = bs.AlertMsg(data.msg, "error");
			$('.MsgBox').html(d).show();
			//$('.ScreenData').html().show();
			return false;
		}

		//console.clear()
		$.get('html/006b-page-all.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data);     	;

			if(get_status =='no_page' )
			{
				
				var d = bs.AlertMsg("No pages were found...please click on the button above to create one...", "warning");

				$('.pages_alert').html(d).show();	

				$(document).find('.page_data_container').hide()
				$('.ScreenData').show();

				return false;
			}

		
			var get_sit_url = $('.sit_name').attr('href');

			var get_post_data =  alasql('Select * FROM ? order by post_id DESC',[data.get_np_join_users_posts]);

			var data_table_arr = []
			get_post_data.forEach(function(ele,index)
			{
				var post_id = ele.post_id

				var post_view = '<a   class="btn btn-link" href="/'+ele.post_url+'" target="_blank">View</a> |';
				var post_edit = '<span class="btn btn-link single_page_edit" update_type="edit" post_id="'+post_id+'">Edit</span> |'
				var post_delete = '<span class="btn btn-link single_page_delete" update_type="delete" post_id="'+post_id+'">Delete</span>'
				var post_view_reset = ''		 
				+' | <span class="btn btn-link single_post_veiw_reset" post_id="'+post_id+'" reset_type="page" data-toggle="tooltip" data-original-title="Reset Views To 0">Reset Views</span>'


				var author_id = ele.post_author_id


				//var get_author_name = alasql('select * From ? Where user_id=?',[get_np_users,author_id] )[0].display_name
				
				var d1 = ele.post_views < 0 ? format_view_count(ele.post_views,2) :ele.post_views;

				data_table_arr.push([
					'<input type="checkbox" class="bulk_page_id no-sort" post_id="'+post_id+'">', 
					ele.post_title,
					ele.author_name,
					ele.post_status,
					ele.link_access_type ? ele.link_access_type : '' ,					
					'<span class="current_post_views">'+ d1 +'</span>',				
					ele.post_dttm,
					post_view+''+post_edit+''+post_delete + '' + post_view_reset

				])


			})			 
			$('.MsgBox').hide();

			var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
			var tbl_data = ''
			+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered "  width="100%"></table>';

	 		$(document).find('.all_pages_data').html(tbl_data ).show();

			$('.ScreenData').show();

			$('#'+Data_Table_AutoID+'').DataTable( 
			{
				data: data_table_arr,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 6, 'desc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
				  { title: 'Select<br> <input type="checkbox" class="select_all_page_ids no-sort">' },
				  { title: "Title" },				 
				  { title: "Author Name" },
				  { title: "Status" },	
				  {title: "Access Type"},			 
				  { title: "Views" },
				  { title: "Publish Date&Time" },      
				  { title: "Options" },
				],                
			});  
	    })

	});	 
}



//--->update/delete - start
$(document).on('click', '.single_page_edit', function(event) 
{
	var post_id = $(this).attr('post_id');
	screen_single_page_edit(post_id);
})

$(document).on('click', '.single_page_delete', function(event) 
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
	  text: "Are you sure you want to delete  page( <b>"+post_name+"</b> )  by author <b>("+author_name+")</b>?",
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

	    Page_Delete(post_id);

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

var Page_Delete = function (post_id)
{  

	var CallType   = 'DELETE' 
	var AjaxURL    = 'pages';
	var DataString = 
	{		 
		datasend:'pages',
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
var screen_single_page_edit = function (post_id)
{
	var CallType   = 'GET' 
	var AjaxURL    = 'pages/single';
	var DataString = 
	{		 
		datasend:'posts',
		post_id:parseInt(post_id),
	};

	ScreenName('Edit Page')
 
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

			PostNew     = 'html/006a-page.html';
  
			$.get(PostNew, function(data) 	
			{
				//console.clear();
				$('.ScreenData').html(data).hide();
				


				var GetView = $('.Template_Container_New_Post').html();


				var PostTitle 		= $(document).find('.PostTitle').val(post_data.post_title);
				var PostURL 		= $(document).find('.PostURL').val(post_data.post_url);

				//var Content_Teaser 	= tinyMCE.get('Content_Teaser').getContent();
				//insert content
				//var Content_Teaser 	= tinymce.get("Content_Teaser").execCommand('mceInsertContent', false, post_data.post_teaser);
				var Content_Teaser 	= $(document).find('.Content_Teaser').html(post_data.post_teaser)
				//tinymce.get('Content_Teaser').setContent('<p>This is my new content!</p>');
				
			
				//var Content_Post 	= tinyMCE.get('Content_Post').getContent();
				//var Content_Teaser 	= tinymce.get("Content_Post").execCommand('mceInsertContent', false, post_data.post_content);
				var Content_Post 	= $(document).find('.Content_Post').html(_.escape(post_data.post_content)) 
				 
				var PostDttm 		= $(document).find('.PostDttm').val( moment(post_data.post_dttm_unix).format("YYYY-MM-DD h:mm:ss a"));

				var get_link_access_type = post_data.link_access_type ? post_data.link_access_type : 'public'
				var LinkAccessType 	= $(document).find('.LinkAccessType').val(post_data.link_access_type);

				var AllowComments 	=  $(document).find('.AllowComments').val(post_data.comments_allow);
				var PageTemplate 	=  $(document).find('.PageTemplate').val(post_data.page_template);

				var PostTags 		= $(document).find('.PostTags').val(post_data.post_tags);
				
				if(post_data.post_feature_img)
				{
					$(document).find('.feature_img_thumbnail').attr('src',post_data.post_feature_img);
					
					/*
					$(document).find('.Feature_IMG_URL').html('<img src="'+post_data.post_feature_img+'" class="img-thumbnail panel panel-default panel-body" 
						style="width:150px;height:150px;padding:5px;">')
					*/
					//var FeatureIMG 		= $(document).find('.Feature_IMG_URL').find('.img-thumbnail').attr('src',post_data.post_feature_img);	
				}
				else if(!post_data.post_feature_img)
				{
					 $(document).find('.feature_img_div').hide();
				}

 

				$(document).find('.Btn_PublishPage')
				.attr(
				{ 
					update_type:'edit',
					post_id:post_data.post_id,

				})


				create_theme_pages_drop_down(post_data.page_template)
 
				
		 		Editor_Full('.np_editor') 

			 	//var GetSiteURL = js.GetSiteURL();

			 	var curr_page_dttm =    moment(post_data.post_dttm_unix).format("YYYY-MM-DD h:mm:ss a")
			 	$('.curr_page_dttm').html(curr_page_dttm)

			 	var GetSiteURL = $('.sit_name').attr('href');

			 	$(document).find('.SiteURL').html(GetSiteURL); 
		 		
		 		//$(document).find('.PostTags').tagsInput({width:'auto'});
		 		$('.PostTags').tagsInput({width:'auto'} );

		 	
		        //var get_categories = alasql('Select * FROM np_terms where term_type="category" ')

		        $('.PostTitle').focus();

		       	
		       	//     
		 		//$('.selectpicker').selectpicker('val', get_categories);

		 		//var cur_val_arr = $(document).find('.selectpicker').selectpicker('val')

		 		//ShowCurrentCategoriesSelected (cur_val_arr) 

		 		//activate the select picker
		 		$('.selectpicker').selectpicker();
		      
		      	$('.ScreenData').show();

			}); 

		}
	});

}



//--->load edit post screen - start
