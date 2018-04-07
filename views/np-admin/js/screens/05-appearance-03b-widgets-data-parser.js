$(document).on('click', '.btn_add_widget_sidebar', function(event) 
{
    event.preventDefault() 

    var widget_id = Math.random().toString(36).substr(2)

    var widget_type = $(this).attr('widget_type')

    var widget_class_type = 'widget_class_sidebar'

    var widget_container_data = $(this).closest('div').find('.widget_container').html()

    var widget_obj =
    {
        widget_id:widget_id,
        widget_type:widget_type,
        widget_class_type:widget_class_type,
        widget_container_data:widget_container_data,
    } 

    var d = $(this).closest('div').find('.widget_container').html()

    var  d1 = widget_item_add_to_sidebar_footer(widget_obj)
    
    $(document).find('.sortable_sidebar').append( d1 )


    $('.sortableLists').sortable()
    $(document).find('.sortable_sidebar').find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'})

    //--->create unique editor ids > start
    //need this in case if you want to have multiple different text editors
    if(widget_type =='text')
    {
        var ele = $(document).find('.'+widget_class_type)

        ele.each(function(i1,v1)
        {
            var get_widget_id = $(this).attr('widget_id')
            if(get_widget_id == widget_id)
            {
                var editor_id = 'editor_id_'+widget_id

                $(this).find('.widget_text_content')
                .attr(
                    {
                        id: editor_id,
                        editor_id: editor_id
                    }
                )
                Editor_Widget('#'+editor_id)
            }
        })       
    } 
    //--->create unique editor ids > end

    $('.mce-branding-powered-by').hide()
 	
 	$(document).find('.sortable_sidebar').find('.mce-branding-powered-by').hide()

    setTimeout(function()
 	{ 
 		$('.mce-branding-powered-by').hide()
 		$(document).find('.sortable_sidebar').find('.mce-branding-powered-by').hide()

 		$(document).find('.sortable_sidebar').find('.mce-branding-powered-by').remove()
 		$('.mce-branding-powered-by').remove()

	}, 20)
    
})





$(document).on('click', '.btn_add_widget_footer', function(event) 
{
    event.preventDefault()  

    var widget_id = Math.random().toString(36).substr(2)

    var widget_type = $(this).attr('widget_type')

    var widget_class_type = 'widget_class_footer'

    var widget_container_data = $(this).closest('div').find('.widget_container').html()

    var widget_obj =
    {
        widget_id:widget_id,
        widget_type:widget_type,
        widget_class_type:widget_class_type,
        widget_container_data:widget_container_data,
    } 

    var d = $(this).closest('div').find('.widget_container').html()

    var  d1 = widget_item_add_to_sidebar_footer(widget_obj)
    
    $(document).find('.sortable_footer').append( d1 ) 

    $('.sortableLists').sortable()

    $(document).find('.sortable_footer').find('.mnu_iconpicker').iconpicker({iconset: 'fontawesome'})

    //--->create unique editor ids > start
    //need this in case if you want to have multiple different text editors
    if(widget_type =='text')
    {
        var ele = $(document).find('.'+widget_class_type)

        ele.each(function(i1,v1)
        {
            var get_widget_id = $(this).attr('widget_id')
            if(get_widget_id == widget_id)
            {
                var editor_id = 'editor_id_'+widget_id

                $(this).find('.widget_text_content')
                .attr(
                    {
                        id: editor_id,
                        editor_id: editor_id
                    }
                )
                Editor_Widget('#'+editor_id)
            }
        })
    } 
    //--->create unique editor ids > end

    $('.sortableLists').sortable()
    
})


var widget_item_add_to_sidebar_footer = function(widget_obj)
{
    var strDIV = ''
    +'<li widget_id="'+widget_obj.widget_id+'" widget_type="'+widget_obj.widget_type+'" class="'+widget_obj.widget_class_type+'">'        	 
        +'<a class="list-group-item" > '
            +widget_obj.widget_container_data
        +'</a>'
        +'<a class="delete_widget_item btn btn-danger btn-xs fa fa-times"  data-toggle="tooltip" data-placement="right" title="Click to delete"> </a>'
        +'<br><br>'
    +'</li>'
    return strDIV
}



//--->remove widget > start
$(document).on('click', '.delete_widget_item', function(event) 
{
    event.preventDefault()
    $(this).closest('li').remove()
})
//--->remove widget > start


//--->widget option > start
$(document).on('click', '.btn_widget_options', function(event)  
{
    event.preventDefault()
    $(this).toggleClass('fa-arrow-down  fa-arrow-up') 
    
    var widget_id = $(this).closest('li').attr('widget_id')

    $(this).closest('li').find('.widget_options_container').toggle()
    $(this).closest('li').find('.widget_container_div').toggle()  

    $(this).closest('li').find('.hide_this_container').hide()


})
//--->widget option > end

	

//--->widget > search > start 	
$(document).on('keyup', '.widget_search_title', function(event) 
{
	event.preventDefault();
	
	var v1 = $(this).val()

	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_search_form_title').text(v1)
	}
	else
	{
		$(this).closest('li').find('.widget_search_form_title').text('Search For : ')
	}

})
//--->widget > search > end


//--->widget > iframe > start

$(document).on('keyup', '.widget_iframe_url', function(event) 
{
	event.preventDefault() 
 

	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_iframe_field').attr('src', v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_iframe_field').attr('src','https://www.youtube.com/embed/PTgNuG7sfLY ') 
	}

})


$(document).on('keyup', '.widget_iframe_height', function(event) 
{
	event.preventDefault() 
	
	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_iframe_field').attr('height', v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_iframe_field').attr('height', 450)  
	}

})

//--->widget > iframe > end


//--->widget > category > start
$(document).on('change', '.mnu_iconpicker', function(event) 
{
	event.preventDefault()

	var icon_class = $(this).find("i:first").attr('class')

	$(this).closest('li').find('.widget_container_div').find('.category_item')
	.removeAttr('class') //remove all the old classes
	.attr('class', 'category_item') //add the first class
	.addClass( icon_class) //add the icon class
})
//

$(document).on('keyup', '.widget_category_title', function(event) 
{
	event.preventDefault() 
	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_from_category_title').text(v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_from_category_title').text('Categories') 
	}
})
//--->widget > category > end

 

//--->widget > text > start

$(document).on('keyup', '.widget_text_title', function(event) 
{
	event.preventDefault() 

	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_from_text_title').text(v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_from_text_title').text('') 
	}
})

 


$(document).on('keyup', '.mce-edit-area', function(event) 
{
	//event.preventDefault() 

    console.log('widget_text_content')

    var content = tinyMCE.editors[i].getContent();

    var author_comment =  tinyMCE.get('widget_text_content').getContent() 

    console.debug(tinyMCE.activeEditor.getContent());

    tinymce.activeEditor.on('widget_text_content', function(e) {
     console.log(e.content);
   });
    console.log(author_comment)

	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_from_text_content').text(v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_from_text_content').text('') 
	}
})
//--->widget > text > end



//--->widget > top posts > start

$(document).on('keyup', '.widget_top_posts_title', function(event) 
{
	event.preventDefault() 

	var v1 = $(this).val()
	if(v1.length > 0)
	{
		$(this).closest('li').find('.widget_from_top_posts_title').text(v1)  
	}
	else
	{
		$(this).closest('li').find('.widget_from_top_posts_title').text('Top Posts') 
	}
})

$(document).on('keyup', '.widget_top_posts_counter', function(event) 
{
	event.preventDefault() 

	var v1 = $(this).val()

	if(v1.length > 0 && parseInt(v1) > 0)
	{
		
		var ele =  $(this).closest('li').find('.widget_from_top_posts_counter')
		ele.text('') 

		for (var i = 0; i < v1; i++) 
		{	
			var counter = i+1
			var post_view = Math.floor((Math.random() * 100) + 1)
			var d = ''
			//+'<hr>'
			+'<span class="btn btn-link"> <b>Post Title'+counter+'</b></span>'
			+'<br>'
			+'<span style=" padding:3px;font-size: 15px;" class="fa fa-eye" title="Total Views"> '+post_view+'</span>' 				
			+ '<hr>'
			//+'<br>' 				 
			ele.append(d)
		}
	}
	else
	{
		var d = '<b>Post Title 1</b><hr>'
		+'<br>'
		$(this).closest('li').find('.widget_from_top_posts_counter').html(d) 
	}
})
//--->widget > top posts > end


//--->widget > reference text > start 
$(document).on('keyup', '.widget_reference_title', function(event) 
{
	event.preventDefault() 

	var widget_type = $(this).closest('li').attr('widget_type')
	var v1 = $(this).val()

	if(v1.length > 0)
	{
		var d = '<b>'+v1+'</b>'
		$(this).closest('li').find('.widget_title').html(d)  
	}
	else
	{
		var d = '<b>'+_.startCase(widget_type)+'</b>'
		$(this).closest('li').find('.widget_title').html(d)  
	}
})
//--->widget > reference text > end 


//--->get client selected widgets > start
var get_user_selected_widgets = function (div_selector_class, class_addon) 
{
	//class name of the container (sidebar or footer)
	var ele = div_selector_class

	if(_.size(ele) < 1)
	{
		return false 
	}

	//for footer only: 'col-md-4'
	var footer_class_addon = class_addon ? class_addon : ''

	var strDIV = ''

	//--->loop through all the sidebar widgets > start
	ele.each(function(i1,v1)
	{
		var widget_type = $(this).attr('widget_type')
		var widget_id = $(this).attr('widget_id')
		var widget_reference_title = $(this).find('.widget_reference_title').val()

		//--->create text(editor) container > start
		if(widget_type == 'text')			
		{				
			var editor_id = $(this).find('.widget_text_content').attr('id')
			var content = tinyMCE.get(editor_id).getContent() 

			strDIV += '<div class="np_widget_text '+footer_class_addon+' " id="'+editor_id+'" widget_id="'+widget_id+'" widget_type="'+widget_type+'" widget_reference_title="'+widget_reference_title+'" >'+content+'</div>'
			if(!footer_class_addon)
			{
				strDIV += '<br><br>' 
			}
		}
		//--->create text(editor) container > end

		

		//--->create search container > start
		if(widget_type == 'search')					
		{	
			var content = $(this).find('.widget_container_div').html()  

			strDIV += '<div class="np_widget_search '+footer_class_addon+'" id="'+widget_id+'"  widget_id="'+widget_id+'" widget_type="'+widget_type+'" widget_reference_title="'+widget_reference_title+'" >'+content+'</div>'
			if(!footer_class_addon)
			{
				strDIV += '<br><br>' 
			}
		}
		//--->create search container > end

		//--->create search container > start
		if(widget_type == 'iframe')					
		{	
			var content = $(this).find('.widget_container_div').html() 
			strDIV += '<div class="np_widget_iframe '+footer_class_addon+'" id="'+widget_id+'"  widget_id="'+widget_id+'" widget_type="'+widget_type+'" widget_reference_title="'+widget_reference_title+'">'+content+'</div>'
			if(!footer_class_addon)
			{
				strDIV += '<br><br>' 
			}
		}
		//--->create search container > end


		//--->create search container > start
		if(widget_type == 'categories')					
		{	
			var widget_category_title = $(this).find('.widget_from_category_title').html() 
			var icon_class = $(this).find('.category_item').attr('class')

			var content = $(this).find('.widget_container_div').html() 
			strDIV += '<div class="np_widget_categories '+footer_class_addon+'" id="'+widget_id+'"  widget_id="'+widget_id+'"  widget_type="'+widget_type+'" widget_category_title="'+widget_category_title+'" icon_class="'+icon_class+'" widget_reference_title="'+widget_reference_title+'">'+content+'</div>'
			if(!footer_class_addon)
			{
				strDIV += '<br><br>' 
			}
		}
		//--->create search container > end


		//--->create top posts container > start
		if(widget_type == 'top_posts')					
		{	
			var widget_top_posts_title= $(this).find('.widget_from_top_posts_title').html() 

			var icon_class = $(this).find('.category_item').attr('class')
			var widget_top_posts_counter = $(this).find('.widget_top_posts_counter').val()

			var content = $(this).find('.widget_container_div').html() 
			strDIV += '<div class="np_widget_top_posts '+footer_class_addon+'" id="'+widget_id+'"  widget_id="'+widget_id+'"  widget_type="'+widget_type+'" widget_top_posts_title="'+widget_top_posts_title+'"   widget_top_posts_counter="'+widget_top_posts_counter+'"  widget_reference_title="'+widget_reference_title+'">'+content+'</div>'
			if(!footer_class_addon)
			{
				strDIV += '<br><br>' 
			}
		}
		//--->create top posts container > end
		
	})	
	//--->loop through all the sidebar widgets > end

	return strDIV
}
//--->get client selected widgets > end

 
//--->update editor content > start
var update_editor_box_content = function(div_selector_class)
{
	//this will update the text editor content on screen load
	var ele = div_selector_class
	//--->loop through all the sidebar widgets > start
	ele.each(function(i1,v1)
	{
		var widget_type = $(this).attr('widget_type')
		var widget_id = $(this).attr('widget_id')
		var widget_reference_title = $(this).find('.widget_reference_title').val()

		//--->create text container > start
		if(widget_type == 'text')					
		{	
			var editor = $(this).find('.widget_text_content')

			var editor_id = editor.removeAttr('aria-hidden').attr('id')			

			//remove old instances
			$(this).find('.widget_options_container').find('.mce-tinymce').remove() 
			tinymce.remove('#'+editor_id); 

			
			editor.show()

			Editor_Widget('#'+editor_id) 

		}
		//--->create text container > end
	})
}
//--->update editor content > end