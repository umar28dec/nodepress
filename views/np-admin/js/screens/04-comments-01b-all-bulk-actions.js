//--->select and deselect all - start
$(document).on('click', '.select_all_comments', function(event) 
{
	var ele = $(document).find('.bulk_comment_id');
 	
 	if($(this).prop("checked")) 
 	{
        //$(".checkBox").prop("checked", true);
        ele.each(function()
		{   
			$(this).prop('checked', true); 
	    });
    } 
    else 
    {
        //$(".checkBox").prop("checked", false);
        ele.each(function()
		{   
			$(this).prop('checked', false); 
	    });
    } 
})
//--->select and deselect all - end 



//--->bulk action > update - start
$(document).on('click', '.approved_selected_comments', function(event) 
{
	bs.ClearError();
	var get_ele_text = $(this).text()
	var update_to = $(this).attr('update_to')

	var ele = $(document).find('.bulk_comment_id') 
	var get_post_ids = []
	//selected check
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
			get_post_ids.push($(this).attr("comment_id"))
		} 
	});

	if(_.size(get_post_ids) < 1)
	{
		var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");
		$(document).find('.comments_alert').html(d)
	}
	else if(_.size(get_post_ids) > 0)
	{		
		
 		var ObjArrOptions = 
		{
		  title: "Confirmation required",
		  text: "Are you sure you want to "+get_ele_text+" "+_.size(get_post_ids)+" comment(s) ?",
		  
		  confirm: function(button) 
		  {
		    //Call your delete function
		    get_comment_ids_to_update(update_to);
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
	} 
})

var get_comment_ids_to_update = function(update_to)
{
	var ele = $(document).find('.bulk_comment_id')

	//remove class
	ele.removeClass('comment_updated_color');
	
	var get_ids = []

	//get only unselected ones to update the view
	ele.each(function(index, v1)
	{   
		if(!$(this).prop('checked')) 
 		{ 
			get_ids.push($(this).attr("comment_id"))
		} 
	});

	//get selected ones  
	var get_selected_ids = []
	ele.each(function(index, v1)
	{   
		$(this).closest("tr").children('td').removeClass('comment_updated_color');

		if($(this).prop("checked")) 
 		{ 
 			get_selected_ids.push( parseInt($(this).attr("comment_id") ) )

 			$(this).closest("tr").children('td').find('.comment_status_updater').val(update_to)

			var tbl_row = $(this).closest("tr").children('td').addClass('comment_updated_color');
  			
		} 
	});

	update_menu_comment_counter_bulk()
	
	update_multiple_comments(get_selected_ids,update_to)
}
var update_multiple_comments = function(comment_post_ids,update_to)
{
	//deselect the boxcheck

	$(document).find('.select_all_comments').prop('checked', false);

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'comments/multiple';
	var DataString = 
	{		 
		datasend:'files',
		comment_post_ids: comment_post_ids,
		comment_status:update_to,
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
		//console.log(data)
		
		var Status = data.status ;
		if(Status == 'error')
		{	 
			return false;			 
		}

		//do the success part below 

	}) 
}
//--->bulk action > update - end


//--->bulk action > delete - start
$(document).on('click', '.delete_selected_comments', function(event) 
{
	//event.preventDefault();
	bs.ClearError();
	var get_ele_text = $(this).text()

	var ele = $(document).find('.bulk_comment_id') 
	var get_post_ids = []
	//selected check
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
			get_post_ids.push($(this).attr("comment_id"))
		} 
	});

	if(_.size(get_post_ids) < 1)
	{
		var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");
		$(document).find('.comments_alert').html(d)
	}
	else if(_.size(get_post_ids) > 0)
	{		
		
 		var ObjArrOptions = 
		{
		  title: "Confirmation required",
		  text: "Are you sure you want to delete "+_.size(get_post_ids)+" comment(s) ?",
		  
		  confirm: function(button) 
		  {
		    //Call your delete function
		    get_comment_ids_to_delete();
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
	}
});

var get_comment_ids_to_delete = function ()
{

	var ele = $(document).find('.bulk_comment_id')
	
	var get_post_ids = []

	//get only unselected ones to update the view
	ele.each(function(index, v1)
	{   
		if(!$(this).prop('checked')) 
 		{ 
			get_post_ids.push($(this).attr("comment_id"))
		} 
	});

	//get selected ones to be deleted
	var get_ids_to_be_deleted = []
	ele.each(function(index, v1)
	{   
		$(this).closest("tr").children('td').removeClass('comment_updated_color');
		if($(this).prop("checked")) 
 		{ 
 			get_ids_to_be_deleted.push( parseInt($(this).attr("comment_id") ) )

			var tbl_row = $(this).closest("tr").children('td');
			tbl_row.css("background-color","#FF3700");

	    	tbl_row.fadeOut(400, function()
	    	{
	        	tbl_row.remove();
	    	}); 
		} 
	});

	if(_.size(get_post_ids) < 1)
	{
		$(document).find('.comment_data_container').hide()

		var d = bs.AlertMsg("No comments were found... ", "warning")
		$('.comments_alert').html(d).show()		
	}

	

	delete_multiple_comment(get_ids_to_be_deleted)

}

var delete_multiple_comment = function(delete_comment_ids)
{

	var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'comments/multiple';
	var DataString = 
	{		 
		datasend:'files',
		delete_comment_ids: delete_comment_ids,
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
		//console.log(data)
		
		var Status = data.status ;
		if(Status == 'error')
		{
			 
			return false;			 
		}

		//do the success part below
		update_menu_comment_counter(data.np_comments)


	}) 
}
//--->bulk action > delete - end