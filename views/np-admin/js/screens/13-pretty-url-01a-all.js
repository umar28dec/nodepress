var Screen_Pretty_URL = function () 
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading your category screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'pretty-url';
	var DataString = 
	{		 
		datasend:'pretty-url',
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

		var Screen = 'html/015a-pretty-url.html';
		
		var Status = data.status ;
		
		if(Status == 'error')
		{	 
			var ErrorMsg = bs.AlertMsg(data.msg,'error');
			$('.MsgBox').html(ErrorMsg).show();

			//$('.ScreenData').show();
			return false;
		}
		else if(Status == 'no_data')
		{
			$.get(Screen, function(d2) 	
			{
				$(document).find('.ScreenData').html(d2).show();

				var GetSiteURL = $('.sit_name').attr('href')+'/go/';

			 	$(document).find('.SiteURL').html(GetSiteURL); 

			 	//$(document).find('#Container_Pretty_URL').collapse('hide');
			 	$(document).find('.pretty_url_list_container').hide();

			})
		}		
		else if(Status == 'success')
		{
			$.get(Screen, function(d2) 	
			{				
				$(document).find('.ScreenData').html(d2);
				create_pretty_url_list_screen(data.pretty_url);	
				$(document).find('#Container_Pretty_URL').hide();		 
			})
		}
	})
}  