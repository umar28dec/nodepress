var Screen_SEO = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'seo';

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

		$.get('html/012a-seo.html', function(template_data)     
    	{  
    		var get_status = data.status 

    		$('.MsgBox').hide()

    		$('.ScreenData').html(template_data).show() 

    		$(".home_page_title").val(data.home_page_title)
			$(".home_page_description").val(data.home_page_description)

    		js.CharCount($(".home_page_title"), 60);
    		js.CharCount($(".home_page_description"), 160);
    	})
	})


}

$(document).on('click', '.btn_update_home_page_seo_info', function(event) 
{
	event.preventDefault();
	
	bs.ClearError();

	var home_page_title = $('.home_page_title')
	var home_page_description = $('.home_page_description')

	if(frm.IsEmpty(home_page_title.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Please enter home page title",home_page_title )
	}
	else if(frm.IsEmpty(home_page_description.val() ))
	{
	  	//Show alert
	  	bs.ShowError ("Please enter home page description",home_page_description )
	}
	else
	{

		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....updating your info")
		+'</div>'

		$('.MsgBox').html(d).show();

		$('.ScreenData').hide();

		var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
		var AjaxURL    = 'seo';

		var DataString = 
		{		 
			datasend:'get_post',
			home_page_title:home_page_title.val(),
			home_page_description:home_page_description.val()
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
			///console.log(data)

			var d = bs.AlertMsg("Successfully udpated... ", "success");

			$('.MsgBox').html(d).show();

			$('.ScreenData').show();


		});

	}


});