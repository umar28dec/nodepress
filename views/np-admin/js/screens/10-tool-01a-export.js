var Screen_Data_Export = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading export screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'export';

	var DataString = 
	{		 
		datasend:'get_export',
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

		//console.log(data)

		var obj =
		{			
			np_comments:data.np_comments,
			np_options:data.np_options,
			np_posts:data.np_posts,
			np_terms:data.np_terms,
			np_users:data.np_users, 

		}
		//Save the file contents as a DataURI
		var export_data = 'data:application/json;charset=utf-8,'+ encodeURIComponent(JSON.stringify(obj))
		
		//var id = Math.random().toString(36).substr(2)

		var id = GetRandomID()
		
		var file_name_json = 'np_js_data_'+id+'.json'
		var file_name_text = 'np_js_data_'+id+'.txt'

		$('.MsgBox').hide()

		var str = ''
		+'<a href="' + export_data + '"  class="btn btn-success" download="'+file_name_json+'"> Export As - JSON File  </a>'
		+'<br><br>'	
		
		$('.ScreenData').html(str).show()
		 
	})


}
 
