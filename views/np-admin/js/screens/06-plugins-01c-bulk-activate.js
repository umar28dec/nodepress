//--->select and deselect all - start
$(document).on('click', '.select_all_plugins', function(event) 
{
	var ele = $(document).find('.bulk_plugin_id');
 	
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



//--->activate > single - start
$(document).on('click', '.bulk_selected_plugins_option', function(event) 
{
	event.preventDefault();
	bs.ClearError();

	var get_ele_text = $(this).text()
	var get_status = $(this).attr('bulk_call_type')

	var ele = $(document).find('.bulk_plugin_id') 
	var get_ids = []
	//selected check
	var plugin_name = ''
	plugin_name +='<ul>'
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
			get_ids.push(
			{ 
				plugin_status: get_status,
				plugin_folder:$(this).attr("plugin_folder"),
				plugin_url:$(this).attr("plugin_url") 
			})
			plugin_name +='<li>' + $(this).attr("plugin_name") +'</li>'
		} 
	})
	plugin_name +='</ul>'

	if(_.size(get_ids) < 1)
	{
		var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");
		$(document).find('.plugins_alert').html(d)
		//console.log('no otpions')
		return false
	}

	

	if(get_status =="activate")
	{
		activate_deactivate_bulk_plugins('activate')
		 
	}
	else if(get_status =="deactivate")
	{
		activate_deactivate_bulk_plugins('deactivate')
		 
	}
	else if(get_status =="delete")
	{
		 
		var ObjArrOptions = 
		{
		  title: "Confirmation required",

		  text: "Are you sure you want to delete the following plugins? <br><br> "+plugin_name,
		  
		  confirm: function(button) 
		  {

		  	//Call your delete function
		  	 
			delete_bulk_plugins()
 
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
		bs.confirm(ObjArrOptions)
	}
}) 
//--->activate > single    - end


var activate_deactivate_bulk_plugins = function (get_status) 
{
	
	var ele = $(document).find('.bulk_plugin_id') 
	var get_ids = []
	//selected check
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
 			var tbl_row = $(this).closest("tr").children('td')
 			tbl_row.eq(1).html(get_status)

			var comment_id = $(this). attr('comment_id');

			var d = bs.AlertMsg("Updated to : <mark>"+get_status +'</mark>', "success");
			var comment_status_alert = $(this).next().filter('.plugin_status_alert').html(d)

			get_ids.push(
			{ 				
				plugin_folder:$(this).attr("plugin_folder"),
				plugin_url:$(this).attr("plugin_url") 
			})
			
		} 
	})

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'plugins/multiple'
	var DataString = 
	{		 
		datasend:'plugins',
		plugin_status: get_status,
		plugin_ids: get_ids
	}

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


var delete_bulk_plugins = function () 
{
	var ele = $(document).find('.bulk_plugin_id') 
	var get_ids = []
	//selected check
	var table = $('#data_table').DataTable()
	ele.each(function(index, v1)
	{   
		var lookup = $(this)

		if($(this).prop("checked")) 
 		{
 			var tbl_row = $(this).closest("tr").children('td')
 			

 			lookup.closest("tr").addClass('selected');
			table.row('.selected').remove().draw( false );

 			tbl_row.css("background-color","#FF3700")

	    	tbl_row.fadeOut(400, function()
	    	{
	        	tbl_row.remove();
	    	})
			get_ids.push(
			{ 				
				plugin_folder:$(this).attr("plugin_folder"),
				plugin_url:$(this).attr("plugin_url") 
			})
			
		} 
	})

	var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'plugins/multiple'
	var DataString = 
	{		 
		datasend:'plugins',
		 
		plugin_ids: get_ids
	}
 

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

	ajax.done(function(data) 
	{ 
		//console.log(data)
		
		var Status = data.status ;
		if(Status == 'error')
		{
			return false;			 
		}


	}) 
}