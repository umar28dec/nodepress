
//--->show screen - start
var Screen_AddNewPage = function ()
{
	//console.clear();

	//remove all old instances
	tinymce.remove();

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	//The element where you want to show the message
	$(document).find('.ScreenData').html(d).show();	
	
	PostNew     = 'html/006a-page.html';
  
	$.get(PostNew, function(data) 	
	{
		//console.clear();
		//var GetView = $('.Template_Container_New_Post').html();

		$('.ScreenData').html(data); 		

	 	Editor_Full('.np_editor')
	 	
	 	var GetSiteURL = $('.sit_name').attr('href');

	 	$(document).find('.SiteURL').html(GetSiteURL); 
 		
 		//$(document).find('.PostTags').tagsInput({width:'auto'});
 		$(document).find('.PostTags').tagsInput({width:'auto'} );

        $(document).find('.PostTitle').focus();

       

        //hide feature img container
        $(document).find('.feature_img_div').hide();       

 		//activate the select picker
 		$(document).find('.selectpicker').selectpicker();


 		create_theme_pages_drop_down()
      
	});
	 
}
//--->show screen - end


var create_theme_pages_drop_down = function(current_page)
{
	var get_theme_pages = alasql('select * from theme_pages order by file_name')

	if(_.size(get_theme_pages) < 1 )
	{
		//no custom pages
		$(document).find('.PageTemplate').html('<option value="default" template_desc="This is default page">Default</option>')
	}
	else if(_.size(get_theme_pages) > 0 )
	{
		//found custom pages
		var strDIV = ''
		
		//get current page > start
		get_theme_pages.forEach(function (ele) 
		{
			if(ele.file_name == current_page)
			{
				strDIV +='<option value="'+ele.file_name+'" template_desc="'+ele.description+'">'+ele.name+'</option>'
				 
				$(document).find('.page_template_desc').html(ele.description)
			}
		})
		//get current page > end

		strDIV +='<option value="default" template_desc="This is default page">Default</option>'

		//get custom pages > start
		get_theme_pages.forEach(function (ele) 
		{
			if(ele.file_name != current_page)
			{
				strDIV +='<option value="'+ele.file_name+'" template_desc="'+ele.description+'">'+ele.name+'</option>'
			}
		})
		//get custom pages > end
		strDIV +=''

		$(document).find('.PageTemplate').html(strDIV)
	}
}

//--->show page template desc - start

$(document).on('change', '.PageTemplate', function(event) 
{
	var element = $(this).find('option:selected'); 
    var get_template_desc = element.attr("template_desc"); 

    //show page desc
	$(document).find('.page_template_desc').html(get_template_desc)
})

//--->show page template desc - end



//--->publish new post - start
 
$(document).on('click', '.Btn_PublishPage', function(event) 
{
	event.preventDefault();
	
	bs.ClearError();

	var update_type = $(this).attr('update_type');

	//get variables
	 
	var PostTitle 		= $(document).find('.PostTitle');
	
	var PostURL 		= $(document).find('.PostURL');	
	
	var Content_Teaser 	= tinyMCE.get('Content_Teaser').getContent();

	var Content_Post 	= tinyMCE.get('Content_Post').getContent();
	var PostDttm 		= $(document).find('.PostDttm');
	var AllowComments 	= $(document).find('.AllowComments');

	var PostTags 		= $(document).find('.PostTags');
	var PageTemplate	= $(document).find('.PageTemplate');

	var FeatureIMG 		= $(document).find('.feature_img_thumbnail').attr('src');

	var LinkAccessType 	= $(document).find('.LinkAccessType');

	var post_status =  $(this).attr('post_status');

	var post_id = $(this).attr('post_id');
	
 	$(document).find('.MsgBox').html('')
 	

	if(frm.IsEmpty(PostTitle.val() ))
	{
		//Show alert
		bs.ShowError ("Please Enter Page Title",PostTitle)
	}
	else if(frm.IsEmpty(PostURL.val()))
	{
		//Show alert
		bs.ShowError ("Please Enter Page URL",PostURL)
	}
	else if(frm.IsEmpty(Content_Teaser))
	{
		//Show alert
		var  d = bs.AlertMsg("Please Enter  Teaser Content", "error");
		$('.TeaserAlertMsg') .after(d)
		$(document).find('.MsgBox').html(d).show()

		//AlertMsgBox("Please enter  Teaser Content")
		//bs.ShowError ('Please enter Content Teaser', ) 
	} 
	else if(frm.IsEmpty(Content_Post))
	{
		//Show alert
 		var  d = bs.AlertMsg("Please Enter Page Content", "error");
		$('.PageContentAlertMsg') .after(d)

		$(document).find('.MsgBox').html(d).show()

		//AlertMsgBox("Please enter Post Content")
	}
	else if(frm.IsEmpty(PageTemplate.val()))
	{
		//Show alert
		bs.ShowError ("Please Select A Page Template",PageTemplate);
	}
	else if(frm.IsEmpty(PostDttm.val()))
	{
		//Show alert
		bs.ShowError ("Please Enter Page Date/Time",PostDttm);
	}
	else  
	{
		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....creating your post")
		+'</div>'

		$('.MsgBox').html(d).show();

		//$('.ScreenData').hide();
	

 		var user_id_data =  alasql('Select * FROM np_users')[0];		 
	 
		var DataString = 
		{		 
			datasend: update_type == 'new' ? 'new_post' : 'edit',

			post_status: post_status,
			
			PostTitle:PostTitle.val(),
			PostURL:PostURL.val(),

			Content_Teaser:Content_Teaser,		
			Content_Post:Content_Post,			
			
			PostDttm:PostDttm.val(),
			LinkAccessType: LinkAccessType.val(),
			
			AllowComments:AllowComments.val(),

			PostTags:PostTags.val(),
			PageTemplate:PageTemplate.val(),

			FeatureIMG: FeatureIMG ? FeatureIMG : '',
			post_author_id: user_id_data.user_id,  

			post_id: $(this).attr('post_id'),  

		};

		var CallType, AjaxURL;

		if(!post_id)
 		{
 			CallType = 	'PUT'
 			AjaxURL    = 'pages/new'
 		}
 		else if(post_id)
 		{
 			CallType = 	'POST'
 			AjaxURL    = 'pages/edit'
 		}

 		/*
 		if(update_type == 'new')
 		{
 			CallType = 	'PUT';
 			AjaxURL    = 'pages/new';
 		}
 		else  if(update_type == 'edit')
 		{
 			CallType = 	'POST';
 			AjaxURL    = 'pages/edit';
 		} 
 		*/
 		//console.log(DataString)
 	  
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
			$('.ScreenData').show();

			console.log(thrownError);
			console.log(xhr); 

			return false    
			 
		});

		//success
		ajax.done(function(data) 
		{ 
			//console.log(data);

			var get_status = data.status 

			if(get_status =="error")
			{
				var ErrorMsg = bs.AlertMsg(data.msg,'error');
				$('.MsgBox').html(ErrorMsg).show();

				$('.ScreenData').show();
				return false;
			}

			//var entry_type = update_type == 'new' ? 'Added Your New Entry <br><br> ' : 'Updated Your Info <br><br> ';

			var entry_type = post_status == 'publish' ? 'Added/Updated your page <br><br> ' : 'This page has a status of: '+post_status+' <br><br> ';

		 

			var get_sit_url = $('.sit_name').attr('href');
			//js.GetSiteURL()
			var post_url_link = '<a href="'+get_sit_url+'/'+PostURL.val()+'" target="_blank"> View Page</a>';

			d = bs.AlertMsg(entry_type+post_url_link, "success");


			$(document).find('.Btn_PublishPage')
			.attr(
			{ 
				update_type:'edit',
				post_id:data.post_id,
			})

			//--->change to update post - start
			/*
			$(document).find('.Btn_PublishPage')
			.attr("update_type",'edit')
			.attr("post_id",data.post_id)
			.html('Update');			
			*/
			//--->change to update post - end

			$('.MsgBox').html(d).show();

			$('.ScreenData').show();
		});	 
	}


});
//--->publish new post - end