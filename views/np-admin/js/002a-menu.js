
//--->dashboard > home > start
setTimeout(function()
{
	var currentUrl =   window.location.hash.slice(1);    
    if(_.size( currentUrl) < 2)
    {
    	Screen_Dashboard_Home()
    }
}, 20)
//--->dashboard > home > end


//--->remove modal container > start
$(document).on('hidden.bs.modal', '.modal', function () 
{	
    $(this).remove()
})
//--->remove modal container > end


$(document).on('click', '.logout', function(event) 
{
    event.preventDefault();
    
    var check = c.GetObjArr('np_login');
    if(!check)
    {
    	/*
    		need to check it this way...otherwise it's too fast to read.
    		due to JS line by line read!
    	*/
        window.location.href = '/np-admin';
        return false; 
    }
    var DataString = 
    { 
      LoginID: c.GetObjArr('np_login').login_id,
       
    };

    $('.LoadingMsg').show();

    var ajax = np_admin_ajax('DELETE','log-out',DataString)
    ajax.done(function(data,textStatus, jqXHR) 
    {     
       
        bs.ClearError();   

        //console.log(data);

        if(data.status == '')

        var Status = data.status;
        
        c.Delete('np_login');
        window.location.href = '/np-admin';
        return false;
    });
});

$(document).ready(function()
{
	$(document).on('click','.ScreenMenu',function (e)
	{
		//prevent the page from reloading 
		e.preventDefault();

		//Clear all old alerts
		bs.ClearError();

		//Clear console log for new entries
		//console.clear();


		//Remove old active menus
		$('.side-nav').find('.active').removeClass('active');
		
		//Make menu active
		$(this).addClass('active') ;

		var screen_name = $(this).attr("href").split("#")[1];
		
		Screen_Loader(screen_name,$(this).text() )

	});

 	setTimeout(function()
 	{
 		Get_On_Page_Load_Hash()

	}, 200); 

 

});


 
function Get_On_Page_Load_Hash()
{
	var currentUrl =   window.location.hash.slice(1);

	var hash = window.location.hash; 

	if(_.size(currentUrl) > 0)
	{ 

		$("a").filter(function()  
    	{
    		var href = $(this).attr('href');

    		if(hash == href)
    		{
    			var get_class = $(this).attr('class');

    			$(this).addClass('active');    			
    			
    			var ru = $(this).closest('.TopMenu').attr('id');
				
				$('#'+ru+'').collapse()

    			Screen_Loader(currentUrl,$(this).text() )
    		}
    		 
    	})
	}
}


function Screen_Loader(screen_name, screen_text)
{
	var check_token = c.GetObjArr('np_login');
	if(!check_token)
	{
		/*
    		need to check it this way...otherwise it's too fast to read.
    		due to JS line by line read!
    	*/
		var btn_login = '<a href="/np-admin" class="btn btn-primary"  > Login</a>'
		+'<br><br>'
		var d = bs.AlertMsg('missing ajax token... please re-login', "error");
		$('.ScreenData').html(d+btn_login).show();
		return false; 
	}

	//Add hash tag to url 
	window.location.hash = screen_name;
	
	
	//screen_text ? ScreenName(_.startCase(screen_text) ) : ScreenName('') ;

	ScreenName(_.startCase(screen_text) )
	
 
	if(screen_name == '/home')
	{	
		Screen_Dashboard_Home()
	}
	else if(screen_name == '/posts/all')
	{	
		Screen_GetPosts()
	}
	else if(screen_name == '/posts/new')
	{			
		Screen_AddNewPost()
	}
	else if(screen_name == '/posts/categories')
	{	
		Screen_Categories()
	}
	else if(screen_name == '/media')
	{	
		Screen_GetMediaLibrary()
	}
	else if(screen_name == '/pages/all')
	{	
		Screen_GetPages()
	}
	else if(screen_name == '/pages/new')
	{			
		Screen_AddNewPage()
	}
	else if(screen_name == '/comments')
	{			
		ScreenName(_.startCase('Comments') )
		Screen_Comments()
	}
	else if(screen_name == '/appearance/themes')
	{			
		Screen_Themes()
	}
	else if(screen_name == '/appearance/menu')
	{			
		Screen_Menu()
	}
	else if(screen_name == '/appearance/widgets')
	{			
		Screen_Widgets()
	}	
	else if(screen_name == '/plugins/installed')
	{			
		Screen_Plugins_Installed()
	}
	else if(screen_name == '/plugins/upload-new')
	{			
		Screen_Plugins_Upload_New()
	}

	else if(screen_name == '/users/your-profile')
	{			
		Screen_Users_All()
	}	
	else if(screen_name == '/seo')
	{			
		Screen_SEO()
	}
	else if(screen_name == '/settings/general')
	{			
		Screen_Settings_General()
	}
	else if(screen_name == '/settings/reading')
	{			
		Screen_Settings_Reading()
	}
	else if(screen_name == '/settings/discussion')
	{			
		Screen_Settings_Discussion()
	}
	else if(screen_name == '/settings/cdn')
	{			
		Screen_Settings_CND()
	}
	else if(screen_name == '/pretty-url')
	{			
		Screen_Pretty_URL()
	}
	
	else if(screen_name == '/tools/export')
	{			
		Screen_Data_Export()
	}
	else if(screen_name == '/tools/import')
	{			
		Screen_Data_Import()
	}


}

 