
//--->show screen - start
var Screen_AddNewPost = function ()
{
	//console.clear();

	//remove all old instances
	tinymce.remove();

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	//The element where you want to show the message
	$(document).find('.ScreenData').html(d).show();	
	
	PostNew     = 'html/003a-post.html';
  
	$.get(PostNew, function(data) 	
	{
		//console.clear();
		var GetView = $('.Template_Container_New_Post').html();

		$('.ScreenData').html(data);


	 	//Editor('.np_editor')
	 	var plugins = [
			{ title: 'Test template 1', content: '<button type="button" class="btn btn-success">Success</button>' },
			{ title: 'Test template 2', content: '<div class="alert alert-success" role="alert">success..</div><br><br>' }
		]

	 	Editor_Full('.np_editor', plugins)

	 	$(document).find('.mce-container-body .mce-branding-powered-by').hide()
	 	

	 	//var GetSiteURL = js.GetSiteURL();

	 	var GetSiteURL = $('.sit_name').attr('href');

	 	$(document).find('.SiteURL').html(GetSiteURL); 
 		
 		//$(document).find('.PostTags').tagsInput({width:'auto'});
 		$('.PostTags').tagsInput({width:'auto'} );

 	
        var get_categories = alasql('Select * FROM np_terms where term_type="category" ')


        $('.PostTitle').focus();

        //clear all the old values
        $(document).find('.Categories_Options').html('');

        //--->get all of the categories - start
        get_categories.forEach(function(element, index)
        {
        	var add_categories= ''
        	+'<option value="'+element.name+'" term_id="'+element.term_id+'">'+element.name+'</option>'
        	+'<option data-divider="true"></option>'
        	$(document).find('.Categories_Options').append(add_categories);

        })        
        //--->get all of the categories - end

        //hide feature img container
        $(document).find('.feature_img_div').hide();


        post_update_comment_allowed()
        


        

 		//activate the select picker
 		$('.selectpicker').selectpicker();
      
	});
	 
}
//--->show screen - end

var post_update_comment_allowed = function(user_comment_option)
{
	//allow = yes/no
	var allow_check =  alasql('Select * FROM np_options where option_name="post_comments_allow"')[0].option_value

    var d =''
   	if(!user_comment_option)
   	{
	    if(allow_check.toLowerCase() == 'yes')
	    {	
	    	d +='<option value="Yes" >Yes</option>'
	    	d +='<option value="No">No</option>'
	    }
	    else if(allow_check.toLowerCase() == 'no')
	    {	
	    	d +='<option value="No">No</option>'
	    	d +='<option value="Yes" >Yes</option>'
	    }
	}
	else if(user_comment_option)
	{
		if(user_comment_option.toLowerCase() == 'yes')
	    {	
	    	d +='<option value="Yes" >Yes</option>'
	    	d +='<option value="No">No</option>'
	    }
	    else if(user_comment_option.toLowerCase() == 'no')
	    {	
	    	d +='<option value="No">No</option>'
	    	d +='<option value="Yes" >Yes</option>'
	    }

	}
	$(document).find('.AllowComments').html(d);
}

//--->publish new post - start
 
$(document).on('click', '.ScreenData .Btn_PublishPost', function(event) 
{
	event.preventDefault();
	
	bs.ClearError();

	var update_type = $(this).attr('update_type');

	//get variables
	 
	var PostTitle 		= $(document).find('.PostTitle');
	var PostURL 		= $(document).find('.PostURL');	
	var Content_Teaser 	= tinyMCE.get('Content_Teaser').getContent();
	var ReadMore 		= $(document).find('.ReadMore');
	var Content_Post 	= tinyMCE.get('Content_Post').getContent();
	var PostDttm 		= $(document).find('.PostDttm');

	var AllowComments 	= $(document).find('.AllowComments');

	var PostTags 		= $(document).find('.PostTags');
	var Categories 		= $(document).find('.selectpicker').selectpicker('val');
	var FeatureIMG 		= $(document).find('.feature_img_thumbnail').attr('src');

	var LinkAccessType =$(document).find('.LinkAccessType');

	var post_status =  $(this).attr('post_status');

	var post_id = $(this).attr('post_id');
	
 	$(document).find('.MsgBox').html('')
 	

	if(frm.IsEmpty(PostTitle.val() ))
	{
		//Show alert
		var  d = bs.AlertMsg("Please Enter Post Title", "error");
		$(document).find('.MsgBox').html(d ).show()
		bs.ShowError ("Please Enter Post Title",PostTitle)
	}
	else if(frm.IsEmpty(PostURL.val()))
	{
		//Show alert
		bs.ShowError ("Please Enter Post URL",PostURL)
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
	else if(frm.IsEmpty(ReadMore.val()))
	{
		//Show alert
		bs.ShowError ("Please Enter Read More",ReadMore)
	}
	else if(frm.IsEmpty(Content_Post))
	{
		//Show alert
 		var  d = bs.AlertMsg("Please Enter Post Content", "error");
		$('.PostContentAlertMsg') .after(d)

		$(document).find('.MsgBox').html(d).show()

		//AlertMsgBox("Please enter Post Content")
	}
	else if(frm.IsEmpty(PostDttm.val()))
	{
		//Show alert
		bs.ShowError ("Please Enter Post Date/Time",PostDttm);

	}
	else  
	{
		var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
		+bs.WaitingMsg("Please wait....creating your post")
		+'</div>'

		$('.MsgBox').html(d).show();

		$('.ScreenData').hide();

		//--->get user selected categories - start
		var arr_categories = [];	
		
		Categories.forEach(function(element, index)  
		{
		    //test
		    //var get_category = $(this).text();
		    var get_category = element;

		    var get_category_slug = URL_ID(get_category);

			var check_category = alasql('SELECT * FROM np_terms where slug=?',[get_category_slug]);

			arr_categories.push({
				term_id:check_category[0].term_id,
				name:check_category[0].name,
				slug:check_category[0].slug,
			})
		});

		//--->get user selected categories - start

 		var user_id_data =  alasql('Select * FROM np_users')[0];		 
	 	



		var DataString = 
		{		 
			datasend: update_type == 'new' ? 'new_post' : 'edit',
			post_status: post_status,
			PostTitle:PostTitle.val(),
			PostURL:PostURL.val(),
			Content_Teaser:Content_Teaser,
			ReadMore:ReadMore.val(),
			Content_Post:Content_Post,			
			
			PostDttm:PostDttm.val(),
			LinkAccessType: LinkAccessType.val(),

			AllowComments:AllowComments.val(),

			PostTags:PostTags.val(),
			Categories:arr_categories,

			FeatureIMG: FeatureIMG ? FeatureIMG : '',
			post_author_id: user_id_data.user_id,  
			post_author_name:user_id_data.display_name, 
			post_author_url:  user_id_data.user_url, 
			post_id: $(this).attr('post_id'),  

		};

		var CallType, AjaxURL;

		/*
 		if(update_type == 'new' || update_type == 'draft')
 		{
 			CallType = 	'PUT';
 			AjaxURL    = 'posts/new';
 		}
 		else  if(update_type == 'edit')
 		{
 			CallType = 	'POST';
 			AjaxURL    = 'posts/edit';
 		} 
 		*/

 		if(!post_id)
 		{
 			CallType = 	'PUT'
 			AjaxURL    = 'posts/new'
 		}
 		else if(post_id)
 		{
 			CallType = 	'POST'
 			AjaxURL    = 'posts/edit'
 		}

		//console.log(DataString) 		

		//return false

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
 

			var entry_type = post_status == 'publish' ? 'Added/Updated your post <br><br> ' : 'This post has a status of: '+post_status+' <br><br> ';


		 

			var get_sit_url = $('.sit_name').attr('href');
			//js.GetSiteURL()
			var post_url_link = '<a href="'+get_sit_url+'/'+PostURL.val()+'" target="_blank"> View Post</a>';

			d = bs.AlertMsg(entry_type+post_url_link, "success");

			$(document).find('.Btn_PublishPost')
			.attr(
			{ 
				update_type:'edit',
				post_id:data.post_id,
			})

			/*
			if(update_type != 'draft ')
			{

				//--->change to update post - start
				$(document).find('.Btn_PublishPost')
				.attr("update_type",'edit')
				.attr("post_id",data.post_id)
				.html('Update');			
				//--->change to update post - end
			}
			*/

			$('.MsgBox').html(d).show();

			$('.ScreenData').show();
		});	 
	}


});
//--->publish new post - end