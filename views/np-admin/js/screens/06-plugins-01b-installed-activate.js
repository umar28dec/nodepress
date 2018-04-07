
//--->activate > single - start
$(document).on('change', '.plugin_status_updater', function(event) 
{
	event.preventDefault();
	bs.ClearError();

	var get_status = $(this).val();


	var tbl_row = $(this).closest("tr").children('td');


	//var plugin_url = $(this).closest("tr").find('.bulk_plugin_id').attr('plugin_url');

	var plugin_name = $(this).attr('plugin_name')
	var plugin_folder = $(this).attr('plugin_folder')
	var plugin_url = $(this).attr('plugin_url')
	

	if(frm.IsEmpty(get_status))
	{
		//update plugin status
		tbl_row.eq(1).html(get_status)
	}
	else if(!frm.IsEmpty(get_status) )
	{
		//--->delete plugin - start
		if(get_status =="delete")
		{

			var ObjArrOptions = 
			{
			  title: "Confirmation required",

			  text: "Are you sure you want to delete <b>"+plugin_name+"</b>?",
			  
			  confirm: function(button) 
			  {

			  	//Call your delete function
			  	var DataString = 
				{		 
					datasend:'plugins',
					plugin_status: get_status,
					plugin_folder:plugin_folder,
					plugin_url:plugin_url, 
				}
				
				delete_single_plugin(DataString)

			    
			    //or run the delete process like this
			    tbl_row.css("background-color","#FF3700");

		    	tbl_row.fadeOut(400, function()
		    	{
		        	tbl_row.remove();
		    	}) 
		    	
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



			return false
		}		
		//--->delete plugin - start

		//update plugin status
		tbl_row.eq(1).html(get_status)

		var comment_id = $(this). attr('comment_id');

		var d = bs.AlertMsg("Updated to : <mark>"+get_status +'</mark>', "success");
		var comment_status_alert = $(this).next().filter('.plugin_status_alert').html(d)

		

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'plugins/single'
		var DataString = 
		{		 
			datasend:'plugins',
			plugin_status: get_status,
			plugin_folder:plugin_folder,
			plugin_url:plugin_url, 
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
});
//--->activate > single    - end


var delete_single_plugin = function (plugin_folder_path_obj) 
{
	var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'plugins/single'
	/*
	var DataString = 
	{		 
		datasend:'plugins',
		plugin_status: get_status,
		plugin_folder:plugin_folder,
		plugin_url:plugin_url, 
	}
	*/

	var DataString = plugin_folder_path_obj

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