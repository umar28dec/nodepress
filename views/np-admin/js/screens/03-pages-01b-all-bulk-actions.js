//--->select and deselect all - start
$(document).on('click', '.select_all_page_ids', function(event) 
{
	var ele = $(document).find('.bulk_page_id');
 	
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



//--->bulk action > delete - start
$(document).on('click', '.delete_selected_pages', function(event) 
{
	//event.preventDefault();
	bs.ClearError();
	var get_ele_text = $(this).text()

	var ele = $(document).find('.bulk_page_id') 
	var get_post_ids = []
	//selected check
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
			get_post_ids.push($(this).attr("post_id"))
		} 
	});

	if(_.size(get_post_ids) < 1)
	{
		var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");
		$(document).find('.pages_alert').html(d)
	}
	else if(_.size(get_post_ids) > 0)
	{		
		
 		var ObjArrOptions = 
		{
		  title: "Confirmation required",
		  text: "Are you sure you want to delete "+_.size(get_post_ids)+" page(s) ?",
		  
		  confirm: function(button) 
		  {
		    //Call your delete function
		    get_page_ids_to_delete();
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

var get_page_ids_to_delete = function ()
{

	var ele = $(document).find('.bulk_page_id')
	
	var get_post_ids = []

	//get only unselected ones to update the view
	ele.each(function(index, v1)
	{   
		if(!$(this).prop('checked')) 
 		{ 
			get_post_ids.push($(this).attr("post_id"))
		} 
	});

	//get selected ones to be deleted
	var get_post_ids_to_be_deleted = []
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{ 
 			get_post_ids_to_be_deleted.push( parseInt($(this).attr("post_id") ) )

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
		$(document).find('.page_data_container').hide()

		var d = bs.AlertMsg("No posts were found...please click on the button above to create one...", "warning")
		$('.pages_alert').html(d).show()		
	}

	delete_multiple_pages(get_post_ids_to_be_deleted)

}

var delete_multiple_pages = function(delete_post_ids)
{

	var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'pages/multiple';
	var DataString = 
	{		 
		datasend:'files',
		delete_post_ids: delete_post_ids,
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
//--->bulk action > delete - end