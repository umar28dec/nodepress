
//--->post preview - start

$(document).on('click', '.ScreenData .Btn_PostPreview', function(event) 
{
	event.preventDefault();

	var Post_Title =  $(document).find('.PostTitle').val()
	
	var Content_Teaser = tinyMCE.get('Content_Teaser').getContent();

	var ReadMore =$(document).find('.ReadMore').val()

	var Btn_ReadMore = '<div class="btn btn-default"> '+ReadMore+'</div>'

	var Content_Post = tinyMCE.get('Content_Post').getContent();


	var arr = 
	[	
		{tab_name:'View - Home Page', tab_content: Content_Teaser + '<br><br>' + Btn_ReadMore},
		{tab_name:'View - Post', tab_content: Content_Post},
	]
	
	BS_Modal (Post_Title,BS_Tabs(arr))

	//insert content
	//tinymce.get("Content_Teaser").execCommand('mceInsertContent', false, 'your content');
 
});
//--->post preview - end