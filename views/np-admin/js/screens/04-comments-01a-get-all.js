//--->show screen - start
var Screen_Comments = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'comments';

	var DataString = 
	{		 
		datasend:'get_post',
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
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error");
			$('.MsgBox').html(d).show();
			//$('.ScreenData').html().show();
			return false;
		}

		//console.clear()

		$.get('html/007a-comments-all.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 

			if(get_status =='no_comments')
			{
				var d = bs.AlertMsg("No comments were found...", "warning");

				$('.comments_alert').html(d).show();	

				$(document).find('.comment_data_container').hide()
				$('.ScreenData').show();

				return false;
			}

			var np_comments = alasql('select * from ? where comment_status="pending"', [data.get_np_join_comments_posts])
			update_menu_comment_counter(np_comments)
		
			var get_sit_url = $('.sit_name').attr('href');

			var get_comment =  alasql('Select * FROM ?  order by rec_dttm_unix DESC',[data.get_np_join_comments_posts]);

		 
			var data_table_arr_approved = []
			var data_table_arr_pending = []
			var data_table_arr_all = []

			get_comment.forEach(function(ele,index)
			{
				var post_id = ele.post_id 
				
				var post_url = ele.post_url
				var post_title =  ele.post_title

				var author_info = ''
				+' author_name="'+ele.comment_author+'"'
				+' author_email="'+ele.comment_author_email+'"'
				+' author_url="'+ele.comment_author_url +'"'
				+' author_comment="'+ele.comment_content +'"'

				var post_edit = '<span class="btn btn-link single_comment_edit" comment_id="'+ele.comment_id+'" '+author_info+'>Edit</span> |'
				var post_reply = '<span class="btn btn-link single_comment_reply" comment_id="'+ele.comment_id+'" post_id="'+post_id+'" post_title="'+post_title+'" post_url="'+post_url+'">Reply</span> |'
				var post_delete = '<span class="btn btn-link single_comment_delete" update_type="delete" comment_id="'+ele.comment_id+'">Delete</span>'

				if(ele.comment_status == "approved")
				{ 
					data_table_arr_approved.push([
						'<input type="checkbox" class="bulk_comment_id no-sort" comment_id="'+ele.comment_id+'">',
						ele.rec_dttm, 
						create_comment_status(ele.comment_status, ele.comment_id),
						'<b>Author Name </b>('+ele.comment_author+')<br><br>'
						+ele.comment_author_email+'<br><br>'
						+'<a  href="'+ele.comment_author_url+'" target="_blank">'+ele.comment_author_url+'</a> '
						,
						//will only show 80 characters of the comment
						ele.comment_content.slice(0,80)+'...<br><span class="btn btn-link view_single_post_commment" post_comment="'+ele.comment_content+'"  >View All</span>',
						'<a  href="/'+post_url+'" target="_blank">'+post_title+'</a> ',
						 
						post_edit+post_reply+post_delete

					])
				}
				else if(ele.comment_status == "pending")
				{ 
					data_table_arr_pending.push([
						'<input type="checkbox" class="bulk_comment_id no-sort" comment_id="'+ele.comment_id+'">',
						ele.rec_dttm, 
						create_comment_status(ele.comment_status, ele.comment_id),
						'<b>Author Name </b>('+ele.comment_author+')<br><br>'
						+ele.comment_author_email+'<br><br>'
						+'<a  href="'+ele.comment_author_url+'" target="_blank">'+ele.comment_author_url+'</a> '
						,
						//will only show 80 characters of the comment
						ele.comment_content.slice(0,80)+'...<br><span class="btn btn-link view_single_post_commment" post_comment="'+ele.comment_content+'"  >View All</span>',
						'<a  href="/'+post_url+'" target="_blank">'+post_title+'</a> ',
						 
						post_edit+post_reply+post_delete

					])
				}

				data_table_arr_all.push([
					'<input type="checkbox" class="bulk_comment_id no-sort" comment_id="'+ele.comment_id+'">',
					ele.rec_dttm, 
					create_comment_status(ele.comment_status, ele.comment_id),
					'<b>Author Name </b>('+ele.comment_author+')<br><br>'
					+ele.comment_author_email+'<br><br>'
					+'<a  href="'+ele.comment_author_url+'" target="_blank">'+ele.comment_author_url+'</a> '
					,
					//will only show 80 characters of the comment
					ele.comment_content.slice(0,80)+'...<br><span class="btn btn-link view_single_post_commment" post_comment="'+ele.comment_content+'"  >View All</span>',
					'<a  href="/'+post_url+'" target="_blank">'+post_title+'</a> ',
					 
					post_edit+post_reply+post_delete

				])
				


			})	
			 
			$('.MsgBox').hide();

			 
  
			var tbl_data = ''
			+ '</br></br> <table id="data_table_arr_all"  class="table table-hover table-bordered "  width="100%"></table>';

			//get_comment_pending pending
			var arr = 
			[ 
        		{tab_name:'Pending', tab_content: '</br></br> <table id="data_table_arr_pending"  class="table table-hover table-bordered "  width="100%"></table>'},
	       		{tab_name:'Approved', tab_content: '</br></br> <table id="data_table_arr_approved"  class="table table-hover table-bordered "  width="100%"></table>'},
    	  	]
			var d = bs.Tabs(arr)

	 		$(document).find('.all_comments_data').html(tbl_data  ).show();

			$('.ScreenData').show();

			$('#data_table_arr_all').DataTable( 
			{
				data: data_table_arr_all,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 1, 'desc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
					{ title: 'Select<br> <input type="checkbox" class="select_all_comments no-sort">' },
					{ title: "Submitted On" },	
					{ title: "Status" },
					{ title: "Author Details" },	 
				  
					{ title: "Comment" },
					{ title: "Post Name" },
				   
				   
					{ title: "Options" },
				],                
			}) 

			$('#data_table_arr_approved').DataTable( 
			{
				data: data_table_arr_approved,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 1, 'desc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
					{ title: 'Select<br> <input type="checkbox" class="select_all_comments no-sort">' },
					{ title: "Submitted On" },	
					{ title: "Status" },
					{ title: "Author Details" },	 
				  
					{ title: "Comment" },
					{ title: "Post Name" },
				   
				   
					{ title: "Options" },
				],                
			}) 


			$('#data_table_arr_pending').DataTable( 
			{
				data: data_table_arr_pending,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 1, 'desc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
					{ title: 'Select<br> <input type="checkbox" class="select_all_comments no-sort">' },
					{ title: "Submitted On" },	
					{ title: "Status" },
					{ title: "Author Details" },	 
				  
					{ title: "Comment" },
					{ title: "Post Name" },
				   
				   
					{ title: "Options" },
				],                
			}) 


	    })

	});	 
}
//--->show screen - end


//--->comment status box - start
var create_comment_status = function(current_status, comment_id)
{
	var box = ''
	
	+'<select class="btn-group btn btn-default dropdown-toggle comment_status_updater " comment_id="'+comment_id+'" >'
		+'<option value="'+current_status+'">'+current_status+'</option>'
		+'<option value="">Select A Status</option>'
		+'<option value="pending">pending</option>'
		+'<option value="approved">approved</option>'
	+'</select>'
	///+'<br><br>'
	+'<div class="comment_status_alert"></div>'
	
	return box; 
}
//--->comment status box - end




//--->view single comment - start
$(document).on('click', '.view_single_post_commment', function(event) 
{
	event.preventDefault();

	var post_comment = $(this).attr('post_comment');

	BS_Modal('Post Comment', post_comment)
});
//--->view single comment - end



//--->update single comment - start
$(document).on('change', '.comment_status_updater', function(event) 
{
	event.preventDefault();
	bs.ClearError();

	var comment_status = $(this).val();

	if(frm.IsEmpty(comment_status) )
	{
		bs.ShowError ("Please select a status",$(this))
	}	
	else if(!frm.IsEmpty(comment_status) )
	{
		var comment_id = $(this). attr('comment_id');

		var d = bs.AlertMsg("Updated to : <mark>"+comment_status +'</mark>', "success");
		var comment_status_alert = $(this).next().filter('.comment_status_alert').html(d)

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'comments/single';
		var DataString = 
		{		 
			datasend:'files',
			comment_status:comment_status,
			comment_id:comment_id, 
		};

		var ajax = np_admin_ajax(CallType,AjaxURL,DataString);
		ajax.done(function(data) 
		{ 			
			var Status = data.status ;
			if(Status == 'error')
			{	 
				return false;			 
			}
			
			//do the success part below
			update_menu_comment_counter_bulk()

			//update_menu_comment_counter(data.np_comments)

		}) 
	} 
});
//--->update single comment - start





//--->delete > single comment - start
$(document).on('click', '.single_comment_delete', function(event) 
{
	event.preventDefault();
 
	bs.ClearError();

	var get_update_type = $(this).attr('update_type');
	var comment_id = $(this).attr('comment_id');
	
	var tbl_row = $(this).closest("tr").children('td');
	var post_name = tbl_row.eq(0).text();
	var author_name = tbl_row.eq(4).text();
 
	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to delete  comment  :<br><br> <b>("+author_name+")</b> ?",
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

	    

	    Comment_Delete(comment_id);

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

var Comment_Delete = function (comment_id)
{  

	var CallType   = 'DELETE' 
	var AjaxURL    = 'comments/single';
	var DataString = 
	{		 
		datasend:'comment',
		comment_id:comment_id,
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

		//this_ele.removeClass('disabled');

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
			update_menu_comment_counter(data.np_comments)
 

		}
	});
}
//--->delete > single comment - end

 

//--->edit single comment - start


$(document).on('click', '.single_comment_edit', function(event) 
{
	event.preventDefault();
	
	var comment_id = $(this).attr('comment_id');

	var tbl_row = $(this).closest("tr").children('td');
	//var post_name = tbl_row.eq(0).text();
	//var author_name = tbl_row.eq(4).text();

 
	tinymce.remove();

	var ObjArr =
	{  
	  "{author_name}":$(this).attr('author_name'), 
	  "{author_email}":$(this).attr('author_email'),
	  "{author_url}":$(this).attr('author_url'),
	  "{text_author_comment}":"author_comment",
	  "{author_comment}":$(this).attr('author_comment'),
	  "{comment_id}":comment_id,
	  "{btn_class_name}":'btn_update_single_author_comment_info',
	  "{btn_name_text}":'Update', 
	};

	var strContent = $(document).find('.template_container_comment').html();

	//Create user content
	var NewContent = js.Template (ObjArr,strContent);

	var strDIV = ''
	+'<div class="edit_single_author_comment_info">' 
		+NewContent
	+'</div>'
 

	BS_Modal('Edit Post Comment', strDIV)

	Editor_Basic('.author_comment')
});

$(document).on('click', '.btn_update_single_author_comment_info', function(event) 
{
	event.preventDefault();

	//To clear all old alerts
	bs.ClearError();
	
	var ele_btn = $(this)

	var comment_id = $(this).attr('comment_id')

	var ele = $(this).closest('.edit_single_author_comment_info')

	var author_name = ele.find('.author_name')
	var author_email = ele.find('.author_email')
	var author_url = ele.find('.author_url')
	var author_comment =  tinyMCE.get('author_comment').getContent() 


	// Validate field
	if(frm.IsEmpty(author_name.val()))
	{
		//Show alert
		bs.ShowError ("Required field",author_name)
	}
	else if(frm.IsEmpty(author_email.val()))
	{
		//Show alert
		bs.ShowError ("Required field",author_email)
	}
	else
	{
		 
		$(document).find('.bulk_comment_id').each(function(index, val) 
		{
			var ele = $(this)

			var ele_comment_id = ele.attr('comment_id')

			if(comment_id ==ele_comment_id )
			{
				var tbl_row = $(this).closest("tr").children('td');
				
				//update Author Details
				var d1 = ''
				d1 +='<b>Author Name </b>('+author_name.val()+')<br><br>'
				d1 +=author_email.val()+'<br><br>'
				d1 +='<a  href="'+author_url.val()+'" target="_blank">'+author_url.val()+'</a> '
				tbl_row.eq(3).html(d1)

				var d2 = author_comment.slice(0,80)+'...<br><span class="btn btn-link view_single_post_commment" post_comment="'+author_comment+'"  >View All</span>'
				tbl_row.eq(4).html(d2)

				var d3 = tbl_row.eq(6).find('.single_comment_edit')
				//.attr('comment_id')
				.attr('author_name', author_name.val() )
				.attr('author_email',author_email.val() )
				.attr('author_url', author_url.val() )
				.attr('author_comment', author_comment )

				//var author_name = tbl_row.eq(4).text();
				var comment_obj = {
					comment_id:comment_id,
					comment_author:author_name.val(),
					comment_author_email:author_email.val(),
					comment_author_url:author_url.val(),
					comment_content:author_comment,
				}
				//console.log(author_comment )
				var d = bs.AlertMsg("Comment info updated... ", "success")
				ele_btn.after(d)
				update_author_comment(comment_obj)

			}
		}) 
	}
})

var update_author_comment = function (comment_obj) 
{
	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'comments/update/single';

	var DataString = comment_obj
  
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
		$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data);
	});
	
}
//--->edit single comment - end




//--->reply single comment - start
$(document).on('click', '.single_comment_reply', function(event) 
{
	var comment_id = $(this).attr('comment_id')
	var post_id = $(this).attr('post_id')
	var post_title = $(this).attr('post_title')
	var post_url = $(this).attr('post_url')

	var tbl_row = $(this).closest("tr").children('td');
	//var post_name = tbl_row.eq(0).text();
	//var author_name = tbl_row.eq(4).text();

	var d1 =  alasql('Select * FROM np_users')[0]

	var author_name = d1.display_name
	var author_url = d1.user_url
	var author_email= d1.user_email

 
	tinymce.remove();

	var ObjArr =
	{  
	  "{author_name}":author_name, 
	  "{author_email}":author_email,
	  "{author_url}":author_url,
	  "{text_author_comment}":"author_comment",
	  "{author_comment}":'',
	  "{comment_id}" : comment_id,	  	
	  "{btn_class_name}":'btn_reply_to_author_comment',
	  "{btn_name_text}":'Reply',
	};

	var strContent = $(document).find('.template_container_comment').html();

	//Create user content
	var NewContent = js.Template (ObjArr,strContent);

	var strDIV = ''
	+'<div class="container_reply_to_author_comment">' 
		+NewContent
	+'</div>'
 
	BS_Modal('Reply To Post Comment', strDIV)

	Editor_Basic('.author_comment')

	$(document).find('.btn_reply_to_author_comment')
	.attr('post_id', post_id)
	.attr('post_title', post_title)
	.attr('post_url', post_url)


})



$(document).on('click', '.btn_reply_to_author_comment', function(event) 
{ 
	event.preventDefault();

	//To clear all old alerts
	bs.ClearError();
	
	var ele_btn = $(this)

	var comment_id = $(this).attr('comment_id')
	var post_id = $(this).attr('post_id')
	var post_title = $(this).attr('post_title')
	var post_url = $(this).attr('post_url')

	var ele = $(this).closest('.container_reply_to_author_comment')

	var author_name = ele.find('.author_name')
	var author_email = ele.find('.author_email')
	var author_url = ele.find('.author_url')
	var author_comment =  tinyMCE.get('author_comment').getContent() 


	// Validate field
	if(frm.IsEmpty(author_name.val()))
	{
		//Show alert
		bs.ShowError ("Required field",author_name)
	}
	else if(frm.IsEmpty(author_email.val()))
	{
		//Show alert
		bs.ShowError ("Required field",author_email)
	}
	else if(frm.IsEmpty(author_url.val()))
	{
		//Show alert
		bs.ShowError ("Required field",author_url)
	}
	 
	else
	{
		 
		$(document).find('.bulk_comment_id').each(function(index, val) 
		{
			var ele = $(this)


			var ele_comment_id = ele.attr('comment_id')

			if(comment_id ==ele_comment_id )
			{
				var tbl_row = $(this).closest("tr").children('td');
				/*
				var author_info = ''
				+' author_name="'+ele.comment_author+'"'
				+' author_email="'+ele.comment_author_email+'"'
				+' author_url="'+ele.comment_author_url +'"'
				+' author_comment="'+ele.comment_content +'"'
				*/
				var tbl_row = $(this).closest("tr");

				var create_comment_id = +moment()

				var author_info = ''
				+' author_name="'+author_name.val()+'"'
				+' author_email="'+author_email.val()+'"'
				+' author_url="'+author_url.val() +'"'
				+' author_comment="'+author_comment +'"'

				var post_edit = '<span class="btn btn-link single_comment_edit" comment_id="'+create_comment_id+'" '+author_info+'>Edit</span> |'
				var post_reply = '<span class="btn btn-link single_comment_reply" comment_id="'+create_comment_id+'" post_id="'+post_id+'">Reply</span> |'
				var post_delete = '<span class="btn btn-link single_comment_delete" update_type="delete" comment_id="'+create_comment_id+'">Delete</span>'



				var t1 = ''
				+'<tr>'
					+'<td><input type="checkbox" class="bulk_comment_id no-sort" comment_id="'+create_comment_id+'"></td>'
					
					+'<td>'+ moment(create_comment_id).format('YYYY-MM-DD hh:mm:ss a') +'</td>'
					
					+'<td>'+ create_comment_status('approved', create_comment_id)+'</td>'
					
					+'<td>'
						+'<b>Author Name </b> ('+ author_name.val() +')<br><br>'
						+author_email.val()+'<br><br>'
						+'<a  href="'+author_url.val()+'" target="_blank">'+author_url.val()+'</a> '
					+'</td>'

					+ '<td>'
						+author_comment.slice(0,80)+'...<br><span class="btn btn-link view_single_post_commment" post_comment="'+author_comment+'"  >View All</span>'
					+'</td>'

					+'<td>'+'<a  href="/'+post_url+'" target="_blank">'+post_title+'</a> '+'</td>'


					+'<td>'
						+post_edit+post_reply+post_delete
					+'</td>'

				+'<tr>'
				tbl_row.before(t1)
				var comment_obj = 
				{
					post_id:post_id,
					comment_id:create_comment_id,
					comment_author:author_name.val(),
					comment_author_email:author_email.val(),
					comment_author_url:author_url.val(),
					comment_content:author_comment,
				}
				//console.log(author_comment )
				var d = bs.AlertMsg("Reply added... ", "success")
				ele_btn.after(d)
				reply_author_comment(comment_obj)

			}
		}) 
	}
})

var reply_author_comment = function (comment_obj) 
{
	var CallType   = 'PUT' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'comments';

	var DataString = comment_obj
  
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
		$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data);
	});
	
}


//--->reply single comment - start