var Screen_Themes= function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading theme screen")
	+'</div>'

	$('.MsgBox').html(d).show() 

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'themes' 

	var DataString = 
	{		 
		datasend:'get_post',
	};
 
 	console.time('get_posts')
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
		//$('.ScreenData').show();

		console.log(thrownError) 
		console.log(xhr)  

		return false    
		 
	})

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)

		var get_status = data.status
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error")
			$('.MsgBox').html(d).show()
			return false
		}

		$.get('html/008a-themes.html', function(template_data)     
    	{  
    		$('.MsgBox').hide()

			$('.ScreenData').html(template_data).show()

			$('.tab_theme').html('<br>')    		

            //create the themes table
            create_theme_table(data.themes, data.active_theme)

            var get_all_themes =   alasql('select * From themes')            

    		if(_.size(get_all_themes) < 1 )
    		{
                var d = bs.AlertMsg("Oppss...looks like you don't have any themes installed...<br><br>upload a theme first", "error");
    			$('.tab_theme').append(d)
    		}
            else if(_.size(get_all_themes) > 0 )
            {
                var active_theme = data.active_theme

                create_theme_view(active_theme)
            }
 

    	})
	})
}

var active_new_theme = function (theme_slug)
{
    var get_current_active_theme = alasql('select * From themes where active_theme!=""')

    //console.log(get_current_active_theme)
    

    if(_.size(get_current_active_theme) < 1)
    {
        //didn't find any active themes

        //update the new active theme
        alasql('UPDATE themes SET active_theme = ?  WHERE theme_slug=?',[theme_slug, theme_slug])

        //clear the old view
        $('.tab_theme').html('<br>') 

        //load the new view with active theme first
        create_theme_view(theme_slug)

    }
    else if(_.size(get_current_active_theme) > 0 )
    {
        //found an active theme

        //null the current active theme
        alasql('UPDATE themes SET active_theme = ?  WHERE active_theme!=""',[''])


        //update the new active theme
        alasql('UPDATE themes SET active_theme = ?  WHERE theme_slug=?',[theme_slug, theme_slug])

        //clear the old view
        $('.tab_theme').html('<br>') 

        //load the new view with active theme first
        create_theme_view(theme_slug)
    }
    update_theme_custom_pages(theme_slug)
}

var update_theme_custom_pages = function(theme_slug)
{
    var d1  = alasql('select * From themes where theme_slug=?',[theme_slug])

    if(_.size(d1) > 0)
    {
        //Clear old data
        alasql('DELETE FROM theme_pages') 

        var theme_pages = JSON.parse(d1[0].custome_pages)
        //add active theme custom pages
        alasql('SELECT * INTO theme_pages FROM ?',[theme_pages])
    }
}


var get_theme_custome_pages = function()
{
    var d1 = alasql('select * From themes where active_theme!=""')

    if(_.size(d1) > 0)
    {
        return JSON.parse(d1[0].custome_pages)
    }

}
var create_theme_view = function(active_theme)
{
    var arr_active_theme = alasql('select * From themes where active_theme!="" ' )

    var arr_inactive_theme = alasql('select * From themes where active_theme="" ' )

    //--->active theme > start
    arr_active_theme.forEach(function(ele)
    {
        var d = theme_container(ele,active_theme)
        $('.tab_theme').append(d)
    })
    //--->active theme > end
    
    //--->inactive theme > start
    arr_inactive_theme.forEach(function(ele)
    {
        var d = theme_container(ele)
        $('.tab_theme').append(d)
    })
    //--->inactive them > end

}


var create_theme_table = function(data_obj, active_theme)
{
    var arr_get_all_themes = []

    //Clear old data
    alasql('DELETE FROM themes') 

    data_obj.forEach( function(ele1, i1) 
    {
        var ele2 = ele1.theme_content 

        var theme_folder = ele1.theme_folder
        var theme_screen_shot = ele2.theme_screen_shot

        var obj = 
        {
            theme_name:ele2.theme_name,
            theme_url:ele2.theme_url,
            author:ele2.author,
            author_url:ele2.author_url,
            description:ele2.description,
            version:ele2.version,
            theme_slug: ele1.theme_slug,
            active_theme: ele1.theme_slug != active_theme ? '' : active_theme, 
            theme_screen_shot:js.GetSiteURL()+  theme_folder + theme_screen_shot, 

            custome_pages:JSON.stringify(ele2.custome_pages)
        }
        arr_get_all_themes.push(obj)
    }) 

    alasql('SELECT * INTO themes FROM ?',[arr_get_all_themes]) 
}

var theme_container = function(data_obj, active_theme)
{
    var panel_class_name =  active_theme ? 'panel-info' : 'panel-default'

    var txt_active =  active_theme ? ' - <mark> Active </mark>' : ' ' 
    
    var footer = ''
    if( _.size(active_theme) < 1)
    {   
         footer +='<div class="panel-footer">'
            footer += '<div  class="btn btn-danger btn-sm1 pull-left btn_activate_delete" data-toggle="tooltip" title="" data-placement="right" data-original-title="Click The Button To Delete" theme_slug="'+data_obj.theme_slug+'">Delete</div>'

            footer +='<div  class="btn btn-primary btn-sm1 pull-right btn_activate_theme" data-toggle="tooltip" title="" data-placement="left" data-original-title="Click The Button To Activate" theme_slug="'+data_obj.theme_slug+'">Activate</div>'

            footer +='<br><br>'
        footer +='</div>'
    }
    else
    {
        footer +=''
    }

	var strDiv = ''

   //  style="max-width:500px;"
   +'<div class="col-md-3 col-sm-6 col-xs-12 div_theme_container" theme_slug="'+data_obj.theme_slug+'"  theme_name="'+data_obj.theme_name+'"    >'
	+'<div class="panel '+panel_class_name+' panel-modest" >'
    	
    	//--->header > start
    	+'<div class="panel-heading"><b>'+data_obj.theme_name+ '</b> '+txt_active+'</div>'
    	//--->header > end
    	
    	//--->body > start
    	+'<div class="panel-body">' 

    		//--->screen shot > start
    		+'<div class="col-xs-3 ">'
                +'<div class="container" >'
    			 +'<img src="'+data_obj.theme_screen_shot+'" class="img-rounded "  width="150" height="150">'
                +'</div>'
    		+'</div>'
    		//--->screen shot > end

            //+'<div class="col-xs-2"></div>'

    		//--->description > start
  			+'<div class="col-xs-12">'
                +'<br>'
  				+data_obj.description
  				+'<br><br>'
  				+'Author: <a href="'+data_obj.author_url+'" target="_blank">'+data_obj.author+'</a>'
				+'<br><br>'
  				+'Version: '+data_obj.version
                +'<br><br>'
                +'<a href="'+data_obj.theme_url+'" target="_blank">Theme URL</a>'
                
  			+'</div>'
  			//--->description > end 

    	+'</div>'
    	//--->body > end

    	//--->footer > start
        + footer
    	//--->footer > end

  	+'</div>'
    +'<div class="clearfix"></div>'

    +'</div>'
  	return strDiv
}

 

//--->activate new theme > start
$(document).on('click', '.btn_activate_theme', function(event) 
{
    event.preventDefault()

    var theme_slug = $(this).attr('theme_slug')
    

    active_new_theme(theme_slug)

    var CallType   = 'POST' //--->Other options: GET/POST/DELETE/PUT
    var AjaxURL    = 'themes'
    var DataString = 
    {        
        datasend:'theme',
        theme_slug: theme_slug
    }

    var ajax = np_admin_ajax(CallType,AjaxURL,DataString)
    //error
    ajax.fail(function(xhr, ajaxOptions, thrownError)  
    {            
        //do your error handling here

        bs.ClearError()
        var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
        + 'Please try agin in a few seconds.<br><br>'

        var ErrorMsg = bs.AlertMsg(Msg,'error')

        $('.MsgBox').html(ErrorMsg).show() 

        console.log(thrownError)
        console.log(xhr)

        return false    
         
    }) 

    ajax.done(function(data) 
    { 
        //console.log(data)
        
        var Status = data.status  
        if(Status == 'error')
        {    
            return false;            
        }
    }) 
})

//--->activate new theme > end

 

//--->install new theme > start

$(document).on('change', '.btn_new_theme_files', function(event) 
{
    //new_media_file_upload_alert
    var msg_alert = $('.new_theme_file_upload_alert')
    var screen_data = $('.container_new_theme_uploader')

    msg_alert.html('')
        
    var file = event.target.files[0];
        
    //--->no file was selected > start
    if(!file)
    {
        //no files were selected.
        //console.log('no files')
        return false;
    }
    //--->no file was selected > end
 

    //--->file is not zip > start
    if(fileExt(file.name) !='zip')
    {
        msg_alert.html('Only zip files are allowed')
        return false
    }   
    //--->file is not zip > end

    var file_name       = fileReName(file.name)
    var file_size       = file.size
    var file_ext        = fileExt(file_name)

    
    //--->upload the zip file > start   

    var d = bs.WaitingMsg("Please wait....Processing your upload theme")

    msg_alert.html(d)

    screen_data.hide()



    var ajax = np_admin_ajax_theme_upload(file,file_name);

    //error
    ajax.fail(function(xhr, ajaxOptions, thrownError)  
    {            
        //do your error handling here
      
        bs.ClearError();
        var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
        + 'Please try agin in a few seconds.<br><br>';     

        var ErrorMsg = bs.AlertMsg(Msg,'error');

        msg_alert.html(ErrorMsg).show();
        screen_data.show();

        console.log(thrownError);
        console.log(xhr); 

        return false    
         
    }) 

    //success
    ajax.done(function(data) 
    { 
        console.log(data);

        var get_status = data.status 
        
        var msg_alert = $('.new_theme_file_upload_alert')
        var screen_data = $('.container_new_theme_uploader')

        if(get_status =="success")
        {
            var d = bs.AlertMsg("Theme uploaded...", "success")
            +'<br><br>'
            //+'<span  class="ScreenMenu btn btn-primary"> View Themes</span>'
            +'<a href="#/appearance/themes" class="ScreenMenu btn btn-primary"> View Themes</a>'

            msg_alert.html(d )

            $('.btn_new_theme_files').val('')
            screen_data.show()

            //create_theme_table(data.themes, data.active_theme)

        }


    }) 
    //--->upload the zip file > end

})

//--->install new theme > end



//--->delete theme > start
//

$(document).on('click', '.btn_activate_delete', function(event) 
{
    //new_media_file_upload_alert
    //var theme_slug = $(this).attr('theme_slug')

    var theme_container = $(this).closest('.div_theme_container')
    var theme_slug = theme_container.attr('theme_slug')

    var theme_name = theme_container.attr('theme_name')

    var ObjArrOptions = 
    {
      title: "Confirmation required",

      text: "Are you sure you want to delete <b>"+theme_name+"</b> ?",
      
      confirm: function(button) 
      {

        //Call your delete function
        var DataString = 
        {        
            datasend:'theme',
            theme_folder: theme_slug,             
        }
        
        delete_single_theme(DataString)

        var tbl_row = theme_container
        
        //or run the delete process like this
        tbl_row.css("background-color","#FF3700");

        tbl_row.fadeOut(400, function()
        {
            tbl_row.remove();
        }) 
        
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
})

var delete_single_theme = function (theme_folder_path_obj) 
{
    var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
    var AjaxURL    = 'themes'

    var DataString = theme_folder_path_obj

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

        //this_ele.removeClass('disabled');

        console.log(thrownError);
        console.log(xhr); 

        return false    
         
    });

    ajax.done(function(data) 
    { 
        //console.log(data)
        
        var Status = data.status ;
        if(Status == 'error')
        {
            return false;            
        }


    }) 
     
}

//--->delete theme > end