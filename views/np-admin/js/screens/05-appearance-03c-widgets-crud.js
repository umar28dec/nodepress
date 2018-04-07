
//--->preview > sidebar > start
$(document).on('click', '.btn_preview_widget_sidebar', function(event) 
{
	event.preventDefault()

	bs.ClearError()

	var ele = $(document).find('.widget_class_sidebar')

	if(_.size(ele) < 1)
	{
		var d = bs.AlertMsg("Oppss...there are no widgets found for sidebar", "error");
		$(document).find('.MsgBox').html(d).show()
		return false		
	}

	//var class_addon = 'col-md-4'
	 
	var object_data =
	{
		panel_header:'<h4>Preview - Sidebar</h4>', 
		panel_content: get_user_selected_widgets(ele),
	}	

	var strDIV = '<div class="col-md-3">'+bs.Panel(object_data)+'</div>'


	$(document).find('.temp_memu_data').html(strDIV)
})
//--->preview > sidebar > end


//--->preview > footer > start
$(document).on('click', '.btn_preview_widget_footer', function(event) 
{
	event.preventDefault()

	bs.ClearError() 

	var ele = $(document).find('.widget_class_footer')

	if(_.size(ele) < 1)
	{
		var d = bs.AlertMsg("Oppss...there are no widgets found for footer", "error");
		$(document).find('.MsgBox').html(d).show()
		return false		
	}

	var class_addon = 'col-md-3'
	 
 
	var object_data =
	{
		panel_header:'<h4>Preview - Footer</h4>', 
		panel_content: get_user_selected_widgets(ele,class_addon),
	}	

	var strDIV = bs.Panel(object_data)

	$(document).find('.temp_memu_data').html(strDIV)
})
//--->preview > footer > end


var add_editor_content_to_textarea = function (ele) 
{
	
	ele.each(function(i1,v1)
	{
		var widget_type = $(this).attr('widget_type')
		var widget_id = $(this).attr('widget_id')
		var widget_reference_title = $(this).find('.widget_reference_title').val()

		//--->create text(editor) container > start
		if(widget_type == 'text')			
		{				
			var editor = $(this).find('.widget_text_content')
			var editor_id = editor.attr('id')
			var content = tinyMCE.get(editor_id).getContent() 

			editor.val(content)



		}
	})
}


//--->save > sidebar > start
$(document).on('click', '.btn_save_widget_sidebar', function(event) 
{
	event.preventDefault()

	bs.ClearError()

	var ele = $(document).find('.widget_class_sidebar')

	
	add_editor_content_to_input_fields(ele)

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....saving your widget(s)")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var has_data = get_user_selected_widgets(ele)

	var strDIV
	if(has_data)
	{
		strDIV = '<div class="np_widget_sidebar">'+get_user_selected_widgets(ele)+'</div>'
	}
	else
	{
		strDIV = ''
	}

	//console.log('dd  ', d)
	//var strDIV = '<div class="np_widget_sidebar">'+get_user_selected_widgets(ele)+'</div>'

	var active_sidebar_client = strDIV
	var active_sidebar_server = $(document).find('.sortable_sidebar').html()	

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'widgets/sidebar' 

	var DataString = 
	{		 
		datasend:'widgets_sidebar',
		active_sidebar_client:active_sidebar_client ? active_sidebar_client : '',
		active_sidebar_server:active_sidebar_server
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
		var d = bs.AlertMsg('Updated your sider widget(s)','success') 

		$('.MsgBox').html(d).show() 

		$('.ScreenData').show() 
	})

	 
})
//--->save > sidebar > end


//--->save > footer > start
$(document).on('click', '.btn_save_widget_footer', function(event) 
{
	event.preventDefault()

	bs.ClearError()

	var ele = $(document).find('.widget_class_footer')

	
	add_editor_content_to_input_fields(ele)

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....saving your widget(s)")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var class_addon = 'col-md-3'
	
	var has_data = get_user_selected_widgets(ele)

	var strDIV
	if(has_data)
	{
		strDIV = '<div class="np_widget_footer">'+get_user_selected_widgets(ele)+'</div>'
	}
	else
	{
		strDIV = ''
	}

	
	var active_footer_client = strDIV
	var active_footer_server = $(document).find('.sortable_footer').html()	

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'widgets/footer' 

	var DataString = 
	{		 
		datasend:'widgets_footer',
		active_footer_client:active_footer_client ? active_footer_client : '',
		active_footer_server:active_footer_server
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
		var d = bs.AlertMsg('Updated your footer widget(s)','success') 

		$('.MsgBox').html(d).show() 

		$('.ScreenData').show() 
	})

	 
})
//--->save > footer > end


var add_editor_content_to_input_fields = function(div_selector_class)
{
	var ele = div_selector_class
	//--->loop through all the sidebar widgets > start
	ele.each(function(i1,v1)
	{
		var widget_type = $(this).attr('widget_type')
		var widget_id = $(this).attr('widget_id')
		var widget_reference_title = $(this).find('.widget_reference_title').val()

		//--->create search container > start
		if(widget_type == 'search')					
		{	
			$(this).find('.widget_reference_title').attr('value', widget_reference_title)
			
			$(this).find('.widget_search_title').attr('value', $(this).find('.widget_search_title').val() )
		}
		//--->create search container > end

		//--->create iframe container > start
		if(widget_type == 'iframe')					
		{	
			$(this).find('.widget_reference_title').attr('value', widget_reference_title)
			
			$(this).find('.widget_iframe_height').attr('value', $(this).find('.widget_iframe_height').val() )

			if($(this).find('.widget_iframe_url').length > 0)
			(				
				$(this).find('.widget_iframe_url')			
				.html( $(this).find('.widget_iframe_url').val() )
			)

			
		}
		//--->create iframe container > end

		//--->create categories container > start
		if(widget_type == 'categories')					
		{	
			$(this).find('.widget_reference_title').attr('value', widget_reference_title)
			
			$(this).find('.widget_category_title').attr('value', $(this).find('.widget_category_title').val() ) 
		}
		//--->create categories container > end


		//--->create top_posts container > start
		if(widget_type == 'top_posts')					
		{	
			$(this).find('.widget_reference_title').attr('value', widget_reference_title)
			
			$(this).find('.widget_top_posts_title').attr('value', $(this).find('.widget_top_posts_title').val() ) 

			$(this).find('.widget_top_posts_counter').attr('value', $(this).find('.widget_top_posts_counter').val() ) 

		}
		//--->create top_posts container > end


		//--->create text container > start
		if(widget_type == 'text')					
		{	
			$(this).find('.widget_reference_title').attr('value', widget_reference_title)
			
			$(this).find('.widget_text_title').attr('value', $(this).find('.widget_text_title').val() ) 

			var editor_id = $(this).find('.widget_text_content').attr('id')
			var content = tinyMCE.get(editor_id).getContent() 

			$(this).find('.widget_text_content').html(content)

		}
		//--->create text container > end
	})
}



