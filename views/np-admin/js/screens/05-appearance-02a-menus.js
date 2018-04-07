var Screen_Menu = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading theme screen")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide() 

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'menu' 

	var DataString = 
	{		 
		datasend:'get_menu',
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
		

		$.get('html/008b-menu.html', function(template_data)     
    	{  
    		$('.MsgBox').hide()

			$('.ScreenData').html(template_data)


			//--->create pages > start

				var arr_data = data.pages
				var div_ele = $('.container_pages') 
				//clear old data
				div_ele.html('<br>')

				if( _.size(arr_data) < 1 )
				{
					var d = bs.AlertMsg("Looks like you don't have any pages", "error");

					div_ele.append(d)
				}

				if( _.size(arr_data) > 0 )
				{
					//has page data
					arr_data.forEach(function(ele)
					{
						var d = '<a href="#" class="btn list-group-item btn_add_menu" '
									+'page_text="'+ele.post_title+'" '
									+'page_slug="'+ele.post_url+'" '
									+'> '
									+ele.post_title
								+'</a>'
								+'<br>'
						div_ele.append(d)

					})
				}
			//--->create pages > end


			//--->create categories > start
			
				var arr_data = data.categories
				var div_ele = $('.container_categories') 
				//clear old data
				div_ele.html('<br>')

				if( _.size(arr_data) < 1 )
				{
					var d = bs.AlertMsg("Looks like you don't have any categories", "error");

					div_ele.append(d)
				}

				if( _.size(arr_data) > 0 )
				{
					//has page data
					arr_data.forEach(function(ele)
					{
						var d = '<a href="#" class="btn list-group-item btn_add_menu" '
									+'page_text="'+ele.name+'" '
									+'page_slug="category/'+ele.slug+'" '
									+'> '
									+ele.name
								+'</a>'
								+'<br>'
						div_ele.append(d)

					})
				}
			//--->create categories > end



			//--->create active menu > start
				
				$('.temp_menu_data').hide()

				var arr_data = data.active_menu
				var div_ele = $('.sortableLists') 
				
				if( _.size(arr_data) > 0 )
				{
					//has page data
					var menu_data = arr_data[0].option_value
					$('.temp_menu_data').html(menu_data)

					var menu_class_obj = $('.temp_menu_data').find('.menu_item_list_group')


					menu_class_obj.each(function(i1,v1)
				    {				    	
				        var menu_slug = $(this).attr('href')
				        var icon_class = $(this).attr('class')
				        var menu_target = $(this).attr('target')
				        var menu_txt = $(this).text()


				        var strDIV = create_menu_item(
				        {
				        	icon_class:icon_class,
				        	menu_slug:menu_slug, 
				        	menu_target:menu_target, 
				        	menu_txt:menu_txt
				        })

				     	$('.sortableLists').append(strDIV)
				       
				    })

				}
			//--->create active menu > end



			$('.sortableLists').sortable()

    		$('#mnu_iconpicker').iconpicker({iconset: 'fontawesome'})

    		//hide update button
			$(document).find('.btn_update_menu_with_icon').hide()


    		$('.ScreenData').show()
 

    	})
	})
}

var remove_left_spaces = function(string)
{
	return string.replace(/^\s+/,"")
}

var menu_slug_full_path = function(menu_slug)
{
	var full_path  
	//js.GetSiteURL()

	if(menu_slug)
	{
		var curr_site_url = location.protocol + '//' + location.host+ '/'

		if(menu_slug === curr_site_url) 
		{			
			full_path = menu_slug
		}
		else
		{ 
			var parse_slug = parseURL(menu_slug) 

			if(parse_slug.host)
			{
				full_path = menu_slug
			}
			else
			{

				if(parse_slug.domain === location.host)
				{
					//already has site url
					full_path = menu_slug
				}
				else
				{
					//add site url
					full_path = curr_site_url + menu_slug
				}
				
			}
		}
	}
	else
	{
		full_path = ''
	}

	return full_path
}

//--->data miniing functions > start
var create_menu_item = function(menu_obj)
{
    //get object values
    var icon_class = menu_obj.icon_class ? menu_obj.icon_class : ''
    
    var memu_target = menu_obj.menu_target ? menu_obj.menu_target : ''
    var menu_txt = menu_obj.menu_txt ? menu_obj.menu_txt : ''
	
	var menu_slug = menu_obj.menu_slug ? menu_obj.menu_slug : ''

	
	
    //to ensure it's competely ramdom
    //does come in handy when updating the old menu info
    var menu_id = Math.random().toString(36).substr(2)

    var get_class = icon_class.replace("menu_item_list_group", "")

    
    var strDIV = ''
    +'<li>'
        +'<a class="menu_item_list_group ' + remove_left_spaces(get_class)+'" '
            //+'href="'+menu_slug_full_path(menu_slug)+'" '
            +'href="'+menu_slug+'" '

            +'target="'+memu_target+'" '
            +'menu_id="'+menu_id+'" '
            +'> '
            +remove_left_spaces(menu_txt)
        +'</a>'
        +'<span class="pull-right step_3_menu_item_delete btn btn-danger btn-xs fa fa-times"  data-toggle="tooltip" data-placement="left" title="Click to delete"> </span>'
        +'<span class="pull-left step_3_menu_item_edit btn btn-default btn-xs fa fa-edit"  data-toggle="tooltip" data-placement="right" title="Click to edit"> </span>'
        +'<br><br>'
    +'</li>'

    return strDIV
}

var get_menu_items = function(menu_class_obj)
{
    var menu_items = ''
    menu_class_obj.each(function(i1,v1)
    {
        var menu_slug = $(this).attr('href')
        var icon_class = $(this).attr('class')
        var menu_target = $(this).attr('target')
        var menu_txt = $(this).text()

        menu_items +=''
        +'\n'
        +'<li>'
            +'<a class="' +icon_class+'" '
                +'href="'+menu_slug+'" '
                +'target="'+menu_target+'" '
                +'> '
                +remove_left_spaces(menu_txt)
            +'</a>'               
        +'</li>'
        
        //+'\t'

    })
    menu_items += ''
    return menu_items
}

//--->data miniing functions > end




//--->data processing > start


//--->add to step 2 > start
$(document).on('click', '.btn_add_menu', function(event) 
{
    event.preventDefault()
    var page_text = $(this).attr('page_text')
    var page_slug = $(this).attr('page_slug')         
  	
  	//delete all old classes
    $('#mnu_iconpicker').find("i:first").removeAttr("class")

    $(document).find('.menu_txt').val(page_text)
    $(document).find('.menu_slug').val(page_slug)

    //hide update button
    $(document).find('.btn_update_menu_with_icon').hide()

    //show add new button
  	$(document).find('.btn_add_menu_with_icon').show()
      
})

//--->add to step 2 > end




//--->add to step 3 > start
$(document).on('click', '.btn_add_menu_to_step_3', function(event) 
{
    event.preventDefault()

    //update type: new/edit
    var get_update_type = $(this).attr('update_type')
    var get_menu_id = $(this).attr('menu_id')

    var menu_txt = $('.menu_txt').val()
    var menu_slug = $('.menu_slug').val()
    var menu_target = $('.menu_target').val()

    //To clear all old alerts
    bs.ClearError();

    //Get the field value
    var d = $('.menu_slug').val()

    // Validate field
    if(frm.IsEmpty(d))
    {
        //Show alert
        bs.ShowError ("Required Field",$('.menu_slug'))
        return false
    }

    var icon_class = $('#mnu_iconpicker').find("i:first").attr('class')



    if(get_update_type == 'new')
    {
    	var strDIV = create_menu_item(
    	{
    		icon_class:icon_class,
    		menu_slug:menu_slug, 
    		menu_target:menu_target, 
    		menu_txt:menu_txt
    	})

    	$('.sortableLists').append(strDIV)
    }
   	else if(get_update_type == 'edit')
   	{
   		var ele = $(document).find('.menu_item_list_group')

   		ele.each(function(i1,v1)
	    {
	    	var menu_id = $(this).attr('menu_id')

	    	if(menu_id == get_menu_id)
	    	{
	    		$(this).removeAttr("class")

	    		$(this).attr('href', menu_slug)
	    		$(this).attr('target', menu_target)
	    		$(this).attr('class', 'menu_item_list_group '+ icon_class)

	    		$(this).text(' '+menu_txt)
	    	}
	    })
   	}
   

    $('.sortableLists').sortable()


    $(document).tooltip({ selector: "[data-toggle]" })

    //reset field
    $(document).find('.menu_txt').val('')
    $(document).find('.menu_slug').val('')

    //delete all old classes
    $('#mnu_iconpicker').find("i:first").removeAttr("class")

    //hide update button
    $(document).find('.btn_update_menu_with_icon').hide()

    //show add new button
  	$(document).find('.btn_add_menu_with_icon').show()

})
//--->add to step 3 > end


//--->edit menu item from step 3 > start
$(document).on('click', '.step_3_menu_item_edit', function(event) 
{
    event.preventDefault()
    var ele = $(this).closest('li').find('.menu_item_list_group') 
    var menu_slug = ele.attr('href')
    var menu_target = ele.attr('target')
  	var txt = ele.text()

  	var menu_id = ele.attr('menu_id')
  	//remove the old menu id data
  	$(document).find('.btn_update_menu_with_icon')

  	//trip spaces from left
  	var menu_txt = remove_left_spaces(txt)

  	//get current class
  	var menu_class = ele.attr('class')

  	//delete all old classes
    $('#mnu_iconpicker').find("i:first").removeAttr("class")
   
  	if (ele.hasClass( "fa" )) 
  	{	 
  		//update font class
  		var icon_class = $('#mnu_iconpicker').find("i:first").addClass(menu_class.replace("menu_item_list_group", ""))
    }


    //add the new menu id data
    $(document).find('.btn_update_menu_with_icon').removeAttr('menu_id').attr('menu_id', menu_id)
   

  	var memu_txt = $('.menu_txt').val(menu_txt)
    var memu_slug = $('.menu_slug').val(menu_slug)
    var memu_target = $('.menu_target').val(menu_target)

 
    //show update button
    $(document).find('.btn_update_menu_with_icon').show()

    //hide add new button
  	$(document).find('.btn_add_menu_with_icon').hide()
  	

      
})
//--->edit menu item from step 3 > end




//--->delete menu item from step 3 > start
$(document).on('click', '.step_3_menu_item_delete', function(event) 
{
    event.preventDefault()
    $(this).closest('li').remove()
})
//--->delete menu item from step 3 > end






//--->prevent going link > start
$(document).on('click', '.menu_item_list_group', function(event) 
{
    event.preventDefault()

    //this will prevent from goint to memu item link(step 3)      
    return false
})
//--->prevent going link > end



//--->data processing > end



//--->save menu to server > start
$(document).on('click', '.btn_save_menu', function(event) 
{
    event.preventDefault()

    bs.ClearError()

    var ele = $(document).find('.sortableLists').find('.menu_item_list_group')

    if(ele.length < 1)
    {
    	var d = bs.AlertMsg("Oppss...No menu items in Step 3", "error");
    	$('.MsgBox').html(d).show()
    	return false
    }

    var active_menu = get_menu_items(ele)

	var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'menu' 

	var DataString = 
	{		 
		datasend:'get_menu',
		active_menu:active_menu
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
		var d = bs.AlertMsg('Updated your menu','success') 

		$('.MsgBox').html(d).show() 
	})
    
     
})

//--->save menu to server > end