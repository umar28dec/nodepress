//--->category > under new post - start

$(document).on('click', '.Btn_SaveDraft', function(event) 
{
	//To clear all old alerts
	bs.ClearError();
});

$(document).on('click', '.Load_NewCategory', function(event) 
{
	//To clear all old alerts
	bs.ClearError();
	$(document).find('.Container_New_Categroy').show(); 
	var GetNewCategory = $(document).find('.NewCategory').val('');
});

function ShowCurrentCategoriesSelected (Cat_Arr) 
{
	//console.log('Cat_Arr ', Cat_Arr)
	if(_.size(Cat_Arr) <1) 
	{
		$(document).find('.CurSelectedCategory').html('');
	}
	else
	{
		var strDIV = '<div  class="TempCategoriesContainer" style="padding:5px;"></div>'
		$(document).find('.CurSelectedCategory').html('<br>'+strDIV)
		
		Cat_Arr.forEach(function(element) 
		{ 
	    	var d = '<span class="glyphicon glyphicon-ok check-mark user_current_categories"> '+ element+ '</span> <br>'; 
	    	$(document).find('.TempCategoriesContainer').append(d)
		})
	}
}

$(document).on('blur', '.Categories_Options', function(event) 
{
	event.preventDefault();
	
	var cur_val_arr = $(document).find('.selectpicker').selectpicker('val')

	ShowCurrentCategoriesSelected (cur_val_arr) 
});

$(document).on('click', '.Btn_Close_Container_New_Categroy', function(event) 
{
	event.preventDefault();
	
	$(document).find('.Container_New_Categroy').hide()

});



//--->add new category - start
js.EnterKey ($(".NewCategory"), function (e)
{
  //prevent the page from reloading 
  e.preventDefault();
	
  //Call the submit process
  $(".Btn_AddCategory").click();
	
})

$(document).on('click', '.Btn_AddCategory', function(event) 
{	
	var GetNewCategory = $(document).find('.NewCategory');

	//To clear all old alerts
	bs.ClearError();

	// Validate field
	if(frm.IsEmpty(GetNewCategory.val() ))
	{
		//Show alert
		bs.ShowError ("Please Enter Category",GetNewCategory)
	}
	else
	{		 
		var get_category_entered = GetNewCategory.val();
		var get_category_slug = URL_ID(get_category_entered);

		var check_category = alasql('SELECT * FROM np_terms where slug=?',[get_category_slug]);
 


		if(_.size(check_category) >0)
		{
			var show_alert = bs.AlertMsg("Category name already exist", "error");
			$(document).find('.Container_New_Categroy').find('.PostMst').html(show_alert)
			return false; 
		}

		//get all the selected values
		var cur_val_arr = $(document).find('.selectpicker').selectpicker('val');	
	
		var NewCat = ''
		+'<option value="'+GetNewCategory.val()+'">'+GetNewCategory.val()+'</option>'
		+'<option data-divider="true"></option>';

		$(document).find('.selectpicker ').append(NewCat);


		var show_alert = bs.AlertMsg("Added New Category", "success");
		$(document).find('.Container_New_Categroy').find('.PostMst').html(show_alert)

		GetNewCategory.val('');
		
		$(document).find('.selectpicker').selectpicker('refresh');	

		//send the new category info to server now
		var DataString =
		{
			datasend:'new',		
			term_id:+moment(),
			category_name: get_category_entered,
			category_slug:get_category_slug,
		}
		
 
		var CallType   = 'PUT' //--->Other options: GET/POST/DELETE/PUT
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
			$(document).find('.Container_New_Categroy').find('.PostMst').html(ErrorMsg).show();		 

			this_ele.removeClass('disabled');

			console.log(thrownError);
			console.log(xhr); 

			return false    
			 
		});

		//success
		ajax.done(function(data) 
		{ 
			console.log(data);

			//delete from the temp table
			alasql('DELETE FROM np_terms'); 

			//add to temp temp table
			alasql('SELECT * INTO np_terms FROM ?',[data.cat_data]); 	

		})
	
	}
	
});
//--->add new category - end

 
//--->category > under new post - end