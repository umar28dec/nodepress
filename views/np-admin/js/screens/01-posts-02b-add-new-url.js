
//---> Post URL - Start
$(document).on('blur', '.ScreenData  .PostTitle', function(event) 
{
	/*
		Create a post url from post title if there is not post url
	*/	
	event.preventDefault();
	
	var Post_Title =  $(document).find('.PostTitle').val();
	var Post_URL = $(document).find('.PostURL')

	if(frm.IsEmpty(Post_URL.val()))
	{ 
		$(document).find('.PostURL').val( URL_ID( Post_Title ) );		
	}
});

$(document).on('keyup', '.ScreenData .PostURL', function(event) 
{
	event.preventDefault();	
	js.PrettyURL( $(".PostURL") );
});

//---> Post URL - End