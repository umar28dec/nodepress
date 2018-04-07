
//--->post preview - start

$(document).on('click', '.ScreenData .Btn_PagePreview', function(event) 
{
	event.preventDefault();

	var Post_Title =  $(document).find('.PostTitle').val()
	
	var Content_Teaser = tinyMCE.get('Content_Teaser').getContent();

	var Content_Post = tinyMCE.get('Content_Post').getContent();


	var arr = 
	[	
		{tab_name:'Teaser', tab_content: Content_Teaser},
		{tab_name:'Content', tab_content: Content_Post},
	]
	
	BS_Modal (Post_Title,BS_Tabs(arr))

	//insert content
	//tinymce.get("Content_Teaser").execCommand('mceInsertContent', false, 'your content');
 
});
//--->post preview - end