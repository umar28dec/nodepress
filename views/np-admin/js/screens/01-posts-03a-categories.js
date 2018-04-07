var Screen_Categories = function () 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading your category screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'categories';
	var DataString = 
	{		 
		datasend:'categories',
	};
	//var ajax = np_config_ajax(CallType,AjaxURL,DataString);
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
		//console.clear();
		$('.MsgBox').hide();

		//do your success data processing here
		//console.log(data)
		
		var Status = data.status ;
		
		if(Status == 'error')
		{	 
			var ErrorMsg = bs.AlertMsg(data.msg,'error');
			$('.MsgBox').html(ErrorMsg).show();

			//$('.ScreenData').show();
			return false;
		}
		else if(Status == 'success')
		{
			var Screen = 'html/004a-categories.html';
  
			$.get(Screen, function(d2) 	
			{
				//console.clear();

				//console.log(data)

				$(document).find('.ScreenData').html(d2);	

				var sort_cat_data = alasql('Select * From ? order by rec_dttm_unix DESC',[data.category_data]);

				var arr1  = []
				sort_cat_data.forEach(function(ele,index)
				{
					var cat_view = '<a   class="btn btn-link" href="/category/'+ele.slug+'" target="_blank">View</a> |';
					var cat_edit = '<span class="btn btn-link category_update" update_type="edit" cat_id="'+ele.term_id+'">Edit</span> |'
					var cat_delete = '<span class="btn btn-link category_update" update_type="delete" cat_id="'+ele.term_id+'">Delete</span>'
					arr1.push(
					{
						name:ele.name,
						slug:ele.slug,						 
						options: ele.slug !='uncategorized' ?cat_view+''+cat_edit+''+cat_delete : cat_view ,
					})
				})

				$('.category_list').html(js.CreateTable(arr1))

				$('.ScreenData').show();
				$('.table').DataTable();

			})
		}
	})
}




//--->category > update/delete - start
$(document).on('click', '.category_update', function(event) 
{
	event.preventDefault();

	bs.ClearError();

	var get_update_type = $(this).attr('update_type');
	var cat_id = $(this).attr('cat_id');
	
	var tbl_row = $(this).closest("tr").children('td');
	var cat_name = tbl_row.eq(0).text();
	var cat_slug = tbl_row.eq(1).text();

	if(get_update_type == 'edit')
	{
		var d = bs.AlertMsg('<br><br><i class="fa fa-arrow-left fa-5x" aria-hidden="true"></i> <br><br>Update Category Info<br><br>', "info");

		$('.category_msg_pointer').html(d)

		$('.category_name').val(cat_name)
		$('.category_slug').val(cat_slug)
		$('.btn_category').html('Update Category')
		$('.btn_category').attr('update_type', 'update');
		$('.btn_category').attr('cat_id', cat_id);
	}
	else if(get_update_type == 'delete')
	{
		var ObjArrOptions = 
		{
		  title: "Confirmation required",
		  text: "Are you sure you want to delete  category( <b>"+cat_name+"</b> ) ?",
		  confirm: function(button) 
		  {

		    //or run the delete process like this
		    var TopDiv = tbl_row.remove();
		    tbl_row.css("background-color","#FF3700");

	    	tbl_row.fadeOut(400, function()
	    	{
	        	tbl_row.remove();
	    	});

		    //Call your delete function
		    Category_Delete(cat_id);

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

var Category_Delete = function (cat_id)
{
	var CallType   = 'DELETE' 
	var AjaxURL    = 'categories';
	var DataString = 
	{		 
		datasend:'categories',
		term_id:cat_id,
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
			alasql('DELETE FROM np_terms')
			alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]); 	 

		}
	});
}
//--->category > update/delete - end


//--->category > slug - start

$(document).on('keyup', '.category_slug', function(event) 
{
	event.preventDefault();	
	js.PrettyURL( $(".category_slug") );
});

$(document).on('blur', '.category_name', function(event) 
{ 
	event.preventDefault();
	
	var category_name =  $(document).find('.category_name').val();
	var category_slug = $(document).find('.category_slug')

	if(frm.IsEmpty(category_slug.val()))
	{ 
		$(document).find('.category_slug').val( URL_ID( category_name ) );		
	}
});

//--->category > slug - start
 

//--->category > update/add new - start
$(document).on('click', '.btn_category', function(event) 
{
	event.preventDefault();
	bs.ClearError();

	var category_name 	= $(document).find('.category_name');
	var category_slug 	= $(document).find('.category_slug');	

	if(frm.IsEmpty(category_name.val() ))
	{
		//Show alert
		bs.ShowError ("Please enter category name ",category_name)
	}
	else if(frm.IsEmpty(category_slug.val()))
	{
		//Show alert
		bs.ShowError ("Please enter category slug",category_slug)
	}
	else
	{
		bs.CheckingMsg($(this),"Please wait....Processing your request");
		var this_ele = $(this);
		this_ele.addClass('disabled');

		var get_update_type = $(this).attr('update_type');	
		var cat_id = $(this).attr('cat_id');

		var DataString, CallType ;
		if(get_update_type == 'update')
		{
			DataString =
			{
				datasend:'update',
				cat_id:cat_id,
				category_name:category_name.val(),
				category_slug:category_slug.val()
			}
			CallType = 'POST';
			 
		}
		else if(get_update_type == 'new')
		{
			DataString =
			{
				datasend:'new',		
				term_id:+moment(),
				category_name:category_name.val(),
				category_slug:category_slug.val()
			}
			CallType = 'PUT';
		}

		//var CallType   = 'PUT' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'categories';


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

			this_ele.removeClass('disabled');

			console.log(thrownError);
			console.log(xhr); 

			return false    
			 
		});

		//success
		ajax.done(function(data) 
		{ 
			//console.log(data);

			bs.ClearError();

			this_ele.removeClass('disabled');

			var get_status = data.status;

			if(get_status == 'error')
			{
				var d = bs.AlertMsg( data.msg, "error")
				$('.new_category_alert').html(d )

			}
			else if(get_status == 'success')
			{	
				var d = bs.AlertMsg( get_update_type+ " category <br><br> ", "success");
				$('.new_category_alert').html(d)

				//delete from the temp table
				alasql('DELETE FROM np_terms'); 

				//add to temp temp table
				alasql('SELECT * INTO np_terms FROM ?',[data.cat_data]); 	

				var sort_cat_data = alasql('Select * From np_terms order by rec_dttm_unix DESC')

				var arr1  = []
				sort_cat_data.forEach(function(ele,index)
				{
					var cat_view = '<a   class="btn btn-link" href="/category/'+ele.slug+'" target="_blank">View</a> |';
					var cat_edit = '<span class="btn btn-link category_update" update_type="edit" cat_id="'+ele.term_id+'">Edit</span> |'
					var cat_delete = '<span class="btn btn-link category_update" update_type="delete" cat_id="'+ele.term_id+'">Delete</span>'
					arr1.push(
					{
						name:ele.name,
						slug:ele.slug,						 
						options: ele.slug !='uncategorized' ?cat_view+''+cat_edit+''+cat_delete : cat_view ,
					})
				})

				$('.category_list').html(js.CreateTable(arr1))

				//reset the fields and but to new
				category_name.val('')
				category_slug.val('')
				$('.btn_category').attr('update_type', 'new');
				$('.btn_category').html('Add Category')

			}
		});
	}
})
 
//--->category > add new - start




