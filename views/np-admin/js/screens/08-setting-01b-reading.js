var Screen_Settings_Reading = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/reading';


	//var user_id_data =  alasql('Select * FROM np_users')[0];


	var DataString = 
	{		 
		datasend:'get_users',
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

		$('.MsgBox').html(ErrorMsg).show()
		$('.ScreenData').show()

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	})

	//success
	ajax.done(function(data) 
	{ 
		var get_status = data.status
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error")
			$('.MsgBox').html(d).show()
			$('.ScreenData').html().show()
			return false
		}

		///console.log(data) 

		 

		$.get('html/011b-settings-reading.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data)
    		
			var pages = data.pages
			var page_for_posts = data.page_for_posts
			var page_on_front = data.page_on_front
			var posts_per_page = data.posts_per_page

			if(_.size(pages)<1)
			{
				var d = bs.AlertMsg("No pages were found with the status of <b>Publish</b>", "warning")
				$('.MsgBox').html(d).show()
			}

			if(_.size(pages)>0)
			{ 

				if(_.size(page_on_front) >0)
				{
					var d1 = ''
					var id1 = parseInt(page_on_front[0].option_value)

					var get_title = alasql('select * From ? where post_id=?', [pages,id1 ])[0].post_title

					d1 += '<option value="'+id1+'">'+get_title+'</option>'					 
					d1 += '<option value="">— Select —</option>'
					$('.page_on_front').html(d1).removeAttr('disabled')
				}

				if(_.size(page_for_posts) >0)
				{
					var d2 = ''
					var id2 = parseInt(page_for_posts[0].option_value)

					var get_title = alasql('select * From ? where post_id=?', [pages,id2 ])[0].post_title

					d2 += '<option value="'+id2+'">'+get_title+'</option>'
					d2 += '<option value="">— Select —</option>'

					$('.page_for_posts').html(d2).removeAttr('disabled')
				}

				pages.forEach(function(ele)
				{
					$('.custom_page_pick').append('<option value="'+ele.post_id+'">'+ele.post_title+'</option>')
				})
			}			
		
			if(_.size(page_for_posts) < 1 )
			{
				$('.front_page_type_posts').prop('checked', true)	
			}
			
			if(_.size(page_for_posts) >0)
			{
				$('.front_page_type_page').prop('checked', true)
			}

			if(_.size(posts_per_page) > 0)
			{
				$('.posts_per_page').val(posts_per_page[0].option_value)
			}
			


			$('.ScreenData').show()
			 
    	})

	}) 

}



//--->update user front page option type > start

//want to show latest posts for home page
$(document).on('click', '.front_page_type_posts', function(event) 
{
	$(this).prop('checked', true)

	$('.front_page_type_page').prop('checked', false)

	$('.custom_page_pick').attr('disabled', 'disabled')
})

//want to show custom page for home page
$(document).on('click', '.front_page_type_page', function(event) 
{ 

 	$(this).prop('checked', true)

	$('.front_page_type_posts').prop('checked', false) 

	$('.custom_page_pick').removeAttr('disabled' )
})

//--->update user front page option type > end


$(document).on('click', '.btn_update_setting_reading', function(event) 
{
	event.preventDefault() 

	bs.ClearError()

	var is_front_page_type_posts = $('.front_page_type_posts').prop('checked')


	//checked
	//want to show latest posts for home page
	if(is_front_page_type_posts) 
	{  
		var posts_per_page = $('.posts_per_page')

		if(frm.IsEmpty(posts_per_page.val() ))
		{
		  	//Show alert
		  	bs.ShowError ("Required Field",posts_per_page )
		}
		else
		{
			var DataString = 
			{		 
				datasend:'settings_reading_posts_per_page',
				posts_per_page:posts_per_page.val(), 
			}
			update_front_page_to_latest_posts(DataString)
			return false
		}


	} 
	//not checked
	//want to show custom page for home page
	else if(!$('.front_page_type_posts').prop('checked')) 
	{ 
		//console.log('not checked')

		var posts_per_page = $('.posts_per_page')
		var page_on_front = $('.page_on_front')
		var page_for_posts = $('.page_for_posts')
		
		if(frm.IsEmpty(page_on_front.val()))
		{
		  	//Show alert
		  	bs.ShowError ("Required Field",page_on_front )
		  	return false
		}		
		else if(frm.IsEmpty(page_for_posts.val() ))
		{
		  	//Show alert
		  	bs.ShowError ("Required Field",page_for_posts )
		  	return false
		}
		else if(!frm.IsEqualTo(page_for_posts.val(),page_on_front.val()))
 		{
  			//Show alert
  			bs.ShowError ("This has to be different than Posts page",page_on_front)
 		}
 		else 
 		{
 			var DataString = 
			{		 
				datasend:'settings_reading_front_page_type_page',
				posts_per_page:posts_per_page.val(),
				page_on_front:page_on_front.val(),
				page_for_posts:page_for_posts.val(),
			}

			update_front_page_to_custom_page(DataString)
			return false

 		}

		return false
	} 
 

}) 


var update_front_page_to_latest_posts = function (DataString) 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....updating your info")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'settings/reading/latest-posts' 
 
  
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>'      

		var ErrorMsg = bs.AlertMsg(Msg,'error') 

		$('.MsgBox').html(ErrorMsg).show()  

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)

		var d = bs.AlertMsg("Successfully udpated... ", "success");

		$('.MsgBox').html(d).show() 

		$('.ScreenData').show() 


	}) 
} 

var update_front_page_to_custom_page = function (DataString) 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....updating your info")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	//front_page_type_page
	var AjaxURL    = 'settings/reading/custom-page' 
 
  
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>'      

		var ErrorMsg = bs.AlertMsg(Msg,'error') 

		$('.MsgBox').html(ErrorMsg).show()  

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)

		var d = bs.AlertMsg("Successfully udpated... ", "success");

		$('.MsgBox').html(d).show() 

		$('.ScreenData').show() 


	}) 
} 