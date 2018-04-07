var Screen_Widgets = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading theme screen")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'widgets' 

	var DataString = 
	{		 
		datasend:'get_widgets',
	} 
  
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError() 
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>'      

		var ErrorMsg = bs.AlertMsg(Msg,'error') 

		$('.MsgBox').html(ErrorMsg).show() 
		$('.ScreenData').show()

		console.log(thrownError) 
		console.log(xhr)  

		return false    
		 
	})

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)

		var get_status = data.status
		

		$.get('html/008c-widgets.html', function(template_data)     
    	{  
    		$('.MsgBox').hide()

			$('.ScreenData').html(template_data).show()

			
			$('.sortableLists').sortable()
			$(document).find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'}) 


    		

    		$(document).find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'})

    		var categories = data.categories

    		var active_sidebar_client = data.active_sidebar_client
    		var active_sidebar_server = data.active_sidebar_server

    		var active_footer_server = data.active_footer_server

    		if(_.size(categories) > 0)
    		{
    			var d1 = '<h4 class="widget_from_category_title">Categories</h4>'
    			categories.forEach(function(ele) 
    			{
    				d1 += ''
    				+'<i class="category_item fa fa-arrow-right">'
						+ '<span>  '+ele.name+'  </span>'
                    +'</i>'
                    +'<br>'
    			})
    			d1+''
    			$(document).find('.container_categories').find('.widget_container_div').html(d1)    				
    		}

    		if(_.size(active_sidebar_server) > 0)
    		{
    			var d = active_sidebar_server[0].option_value
    			$(document).find('.sortable_sidebar').html(d)  

    			$(document).find('.sortable_sidebar').find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'}) 

    			var ele = $(document).find('.widget_class_sidebar')
    			update_editor_box_content(ele)		
    		}

    		if(_.size(active_footer_server) >0)
    		{
    			var d = active_footer_server[0].option_value
    			$(document).find('.sortable_footer').html(d)  

    			$(document).find('.sortable_footer').find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'}) 	


    			var ele = $(document).find('.widget_class_footer')
    			update_editor_box_content(ele)		
    		}
    		$('.sortableLists').sortable()


    		//Editor_Widget('.widget_text_content')

    	})
	})
}



