//--->pretty url > update/add new - start
$(document).on('click', '.btn_pretty_url', function(event) 
{
	event.preventDefault();

	bs.ClearError();

	var pretty_url_title	= $(document).find('.pretty_url_title');
	var pretty_url_note 	= $(document).find('.pretty_url_note');
	var pretty_url_long 	= $(document).find('.pretty_url_long');
	var pretty_url_short 	= $(document).find('.pretty_url_short');	

	if(frm.IsEmpty(pretty_url_long.val()))
	{
		//Show alert
		bs.ShowError ("Required Field",pretty_url_long)
	}
	else if(frm.IsEmpty(pretty_url_short.val()))
	{
		//Show alert
		bs.ShowError ("Required Field",pretty_url_short)
	}
	else if(frm.IsEmpty(pretty_url_title.val() ))
	{
		//Show alert
		bs.ShowError ("Required Field",pretty_url_title)
	}
	else
	{
		bs.CheckingMsg($(this),"Please wait....Processing your request");

		var this_ele = $(this);
		this_ele.addClass('disabled');

		var get_update_type = $(this).attr('update_type');	
		var url_id = $(this).attr('url_id');

		var DataString, CallType,AjaxURL;

		if(get_update_type == 'update')
		{
			DataString =
			{
				datasend:'update',
				url_id:url_id,
				pretty_url_title:pretty_url_title.val(),
				pretty_url_note:pretty_url_note.val(),
				pretty_url_long:pretty_url_long.val(),
				pretty_url_short:pretty_url_short.val()
			}
			CallType = 'POST';
			AjaxURL = 'pretty-url/update'
			 
		}
		else if(get_update_type == 'new')
		{
			DataString =
			{
				datasend:'new',		
				url_id:+moment(),
				pretty_url_title:pretty_url_title.val(),
				pretty_url_note:pretty_url_note.val(),
				pretty_url_long:pretty_url_long.val(),
				pretty_url_short:pretty_url_short.val()
			}
			
			CallType = 'PUT';
			AjaxURL = 'pretty-url'
		}

		//console.log(DataString);

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

			bs.ClearError();

			this_ele.removeClass('disabled');

			var get_status = data.status;
			
			var GetSiteURL = $('.sit_name').attr('href')+'/go/'+pretty_url_short.val();

			if(get_status == 'error')
			{
				var d = bs.AlertMsg( data.msg, "error")
				$('.new_pretty_url_alert').html(d )

			}
			else if(get_status == 'success')
			{	
				var d = '';
				
				if(get_update_type == 'new')
				{				
					
					d = bs.AlertMsg(  "Added new pretty url <br><br> "+ GetSiteURL, "success");
				}
				else if(get_update_type == 'update')
				{
					d = bs.AlertMsg(  "Updated pretty url <br><br> "+ GetSiteURL, "success");
				}

				$('.new_pretty_url_alert').html(d) 

				//reset the fields and but to new
				$(document).find('.container_new_pretty_url').find('.form-control').val('')
				//pretty_url_note.val('')
				//pretty_url_long.val('')
				//pretty_url_short.val('')



				$('.btn_pretty_url').attr('update_type', 'new').removeAttr('url_id');

				$('.btn_pretty_url').html('Add New Pretty URL')

				create_pretty_url_list_screen(data.pretty_url);
			}
		});
	}
}) 
//--->pretty url > add new - end


//--->pretty url > reset views - start
$(document).on('click', '.pretty_url_veiw_reset', function(event) 
{
	event.preventDefault();
 
	var url_id = $(this).attr('url_id');
	
	var tbl_row = $(this).closest("tr").children('td');

	var url_name = tbl_row.eq(1).text();
	 
	var cur_views  = tbl_row.eq(2);
 

	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to reset  views for ( <b>"+url_name+"</b> )  </b>?"
	  +'<br><br>Current view count : <b>'+ cur_views.text()+'</b>',
	  confirm: function(button) 
	  {

	    //reset the views to zero	   
 		cur_views.text(0)
 		 

	    //Call resetfunction
	    Pretty_URL_Reset_Views(url_id);

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

var Pretty_URL_Reset_Views = function (url_id)
{  

	var CallType   = 'POST' 
	var AjaxURL    = 'pretty-url/views/reset';
	var DataString = 
	{		 
		datasend:'pretty-url',
		url_id:url_id,
	};

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

		
		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data); 

		var get_status = data.status;

		if(get_status == 'error')
		{
			var d = bs.AlertMsg( data.msg, "error")
		}
		else if(get_status == 'success')
		{
			//alasql('DELETE FROM np_terms')
			//alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]); 	 

		}
	});
}
//--->pretty url > reset views - end


//--->pretty url > single delete - start

$(document).on('click', '.pretty_url_single_delete', function(event) 
{
	event.preventDefault();

	bs.ClearError();

	var get_update_type = $(this).attr('update_type');
	var url_id = $(this).attr('url_id');
	
	var tbl_row = $(this).closest("tr").children('td');

	var url_name = tbl_row.eq(1).text();

	var ObjArrOptions = 
	{
	  title: "Confirmation required",
	  text: "Are you sure you want to delete ( <b>"+url_name+"</b> )   </b>?",
	  confirm: function(button) 
	  {

	    //or run the delete process like this
	    //var TopDiv = tbl_row.remove();
	    tbl_row.css("background-color","#FF3700");

    	tbl_row.fadeOut(400, function()
    	{
        	tbl_row.remove();
    	});

	    //Call your delete function

	    Pretty_URL_Single_Delete(url_id);

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
	 
});

var Pretty_URL_Single_Delete = function (url_id)
{  

	var CallType   = 'DELETE' 
	var AjaxURL    = 'pretty-url';
	var DataString = 
	{		 
		datasend:'posts',
		url_id:url_id,
	};

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

		
		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data); 

		var get_status = data.status;

		if(get_status == 'error')
		{
			var d = bs.AlertMsg( data.msg, "error")
		}
		else if(get_status == 'success')
		{
			//alasql('DELETE FROM np_terms')
			//alasql('SELECT * INTO np_terms FROM ? order by rec_dttm_unix DESC',[data.cat_data]); 	 

		}
	});
}
//--->pretty url > single delete - end


//--->bulk action > delete - start
$(document).on('click', '.pretty_url_delete_selected', function(event) 
{
	//event.preventDefault();
	bs.ClearError();
	var get_ele_text = $(this).text()

	var ele = $(document).find('.bulk_pretty_url_id') 
	var get_ids = []
	//selected check
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{
			get_ids.push($(this).attr("url_id"))
		} 
	});

	if(_.size(get_ids) < 1)
	{
		var d = bs.AlertMsg("Please select at least one to > " + get_ele_text, "error");

		$(document).find('.pretty_url_bulk_alert').html(d)
	}
	else if(_.size(get_ids) > 0)
	{		
		
 		var ObjArrOptions = 
		{
		  title: "Confirmation required",
		  text: "Are you sure you want to delete "+_.size(get_ids)+" url(s)?",
		  
		  confirm: function(button) 
		  {
		    //Call your delete function
		    pretty_url_delete_test();
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
	}
});
 

var pretty_url_delete_test = function (delete_post_ids_arr)
{

	var ele = $(document).find('.bulk_pretty_url_id')
	
	var get_post_ids = []

	//get only unselected ones to update the view
	ele.each(function(index, v1)
	{   
		if(!$(this).prop('checked')) 
 		{ 
			get_post_ids.push($(this).attr("url_id"))
		} 
	});

	//get selected ones to be deleted
	var get_ids_to_be_deleted = []
	ele.each(function(index, v1)
	{   
		if($(this).prop("checked")) 
 		{ 
 			get_ids_to_be_deleted.push( parseInt($(this).attr("url_id") ) )

			var tbl_row = $(this).closest("tr").children('td');
			tbl_row.css("background-color","#FF3700");

	    	tbl_row.fadeOut(400, function()
	    	{
	        	tbl_row.remove();
	    	}); 
		} 
	});

	if(_.size(get_post_ids) < 1)
	{
		$(document).find('.pretty_url_list').hide();
		$(document).find('.pretty_url_list_container').hide();

		$(document).find('.btn_container_new_pretty_url').show();

		 
		var btn_class = $('.btn_container_new_pretty_url');
		btn_class.find('.fa').toggleClass( 'fa-arrow-down fa-arrow-up' );


		var ele = $(document).find('#Container_Pretty_URL')

		if( ele.css('display') == 'none' )
		{
	    	ele.show();
		}  
		

		var d = bs.AlertMsg("No urls were found...please click on the button above to create one...", "warning")
		$('.pretty_url_bulk_alert').html(d).show()		
	}

	pretty_url_delete_multiple(get_ids_to_be_deleted)

}

var pretty_url_delete_multiple = function(delete_url_ids)
{

	var CallType   = 'DELETE' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'pretty-url/multiple';
	var DataString = 
	{		 
		datasend:'files',
		delete_url_ids: delete_url_ids,
	};
	

	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>';     

		var ErrorMsg = bs.AlertMsg(Msg,'error');

		$('.LoginAlert').html(ErrorMsg).show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//console.log(data)
		
		var Status = data.status ;
		if(Status == 'error')
		{
			 
			return false;			 
		}

		//do the success part below


	}) 
}
//--->bulk action > delete - end 








//--->get url stats - start
$(document).on('click', '.pretty_url_stats', function(event) 
{
	event.preventDefault();
	bs.ClearError();

	var data_container = $(document).find('.div_contain_pretty_url_all') 
	
	//get id
	var url_id = $(this).attr('url_id');
	var url_title  = $(this).attr('url_title'); 

	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....getting url stats")
	+'</div>'

	$('.MsgBox').html(d).show();

	//hide div
	data_container.hide();


	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'pretty-url/stats';
	var DataString = 
	{		 
		datasend:'pretty-url-stats',
		url_id:url_id,
	};
 
	var ajax = np_admin_ajax(CallType,AjaxURL,DataString);

	//error
	ajax.fail(function(xhr, ajaxOptions, thrownError)  
	{ 		 	 
	  //do your error handling here
	  
		bs.ClearError();
		var Msg = 'There was an error message ('+thrownError+') while trying to process your request. <br><br>'
		+ 'Please try agin in a few seconds.<br><br>';     

		var ErrorMsg = bs.AlertMsg(Msg +xhr.responseText ,'error');

		$('.MsgBox').html(ErrorMsg).show();

		//$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 
		//$('.MsgBox').hide();

		//do your success data processing here
		//console.log(data)	

		//url_title
		var status = data.status
		if(status == 'no_data')
		{
			var Msg = 'No stats found for URL Title: <strong>( '+ url_title + ')</strong>';     

			var ErrorMsg = bs.AlertMsg(Msg   ,'error');

			$('.MsgBox').html(ErrorMsg).show();

			data_container.show();
		}
		else if(status =="success")
		{
			$('.MsgBox').hide();

			var pretty_url = data.pretty_url[0];
			
			//clear old data
			$(document).find('.pretty_url_stats_smry').html('');
			$(document).find('.pretty_url_stats_details').html('');
			$(document).find('#graph_data').html('');
			
			

			var url_short = $('.sit_name').attr('href')+'/go/'+pretty_url.url_short;

			var ele_stats = $(document).find('.container_pretty_url_stats')

			ele_stats.find('.url_title').html('Stats Report > <strong>' + url_title + '</strong>')
			ele_stats
			.find('.pretty_url_long')
			.html( '<a class="btn btn-link" target="_blank"  href="'+pretty_url.url_long+'">'+pretty_url.url_long.substring(0,30)+'...</a>' )
			ele_stats
			.find('.pretty_url_short')
			.html( url_short)

			//convert array data
			var arr1 = []
			$.each(data.pretty_url_stats, function(i1, v1) 
			{
				arr1.push(
				{
					url_short:data.pretty_url[0].url_short,
					url_note:data.pretty_url[0].url_note,
					url_id:v1.url_id,
					url_tracker_id:v1.url_tracker_id,
					url_tracker_ip:v1.url_tracker_ip,
					url_tracker_refer:v1.url_tracker_refer,
					rec_dttm:v1.rec_dttm,
					rec_dt: moment(v1.rec_dttm).format("YYYY-MM-DD"),
					rec_dttm_unix: +moment(v1.rec_dttm),
				})
			});

			var arr_smry_tbl = alasql('Select url_tracker_refer,url_tracker_ip,url_note,url_short,url_id,rec_dt, count(url_tracker_id) as total_hits \
			From ? \
			group by url_tracker_refer,url_tracker_ip,url_note,url_short,url_id,rec_dt order by rec_dt desc ',[arr1])
			
			var arr_smry_graph = alasql('Select  rec_dt, count(url_tracker_id) as total_hits \
			From ? \
			group by rec_dt order by rec_dt',[arr1])

			//---> smry stats > start
			
			var data_graph_arr_smry = [];
			$.each(arr_smry_graph, function(i2, v2) 
			{
				data_graph_arr_smry.push(
				{
					rec_dt:v2.rec_dt,					 									
					value:v2.total_hits,	
				})
			});

			var data_table_arr_smry = [];		
			$.each(arr_smry_tbl, function(i2, v2) 
			{
				data_table_arr_smry.push(	
				[			
					v2.rec_dt,					 									
					'<a href="http://www.infosniper.net/index.php?ip_address='+v2.url_tracker_ip+'"  target="_blank">'+v2.url_tracker_ip+'</a>',
					v2.total_hits,									 
				])
			});		

			
			var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
			var tbl_data = ''
			+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered"  width="100%"></table>';

			$(document).find('.pretty_url_stats_smry').html(tbl_data );
			$('#'+Data_Table_AutoID+'').DataTable( 
			{
				//.reverse()
				//data:   _.orderBy(data_table_arr_smry, ['rec_dt'] ),
				data:   data_table_arr_smry ,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,	
				aaSorting: [[1, 'asc']],					
				columns: 
				[				   				 
				  	{ title: "Publish Date" },
				  	{ title: "IP Address" },				  	
				  	{ title: "Total Hits"},
				],                
			});
			
			//show stats container
			ele_stats.show();

			//--->daily graph > start
	        var morris_line_daily =  new Morris.Line(
	        {
	          // ID of the element in which to draw the chart.
	          element: 'graph_data',
	          // Chart data records -- each entry in this array corresponds to a point on
	          // the chart.  data: _.reverse(arr_graph) ,
	          data: data_graph_arr_smry ,
	          // The name of the data record attribute that contains x-values.
	          xkey: 'rec_dt',
	          // A list of names of data record attributes that contain y-values.
	          ykeys: ['value'],
	          // Labels for the ykeys -- will be displayed when you hover over the
	          // chart.
	          labels: ['Total Hits'],
	          axes1:false,
	          parseTime: false,
	          //ymin:'auto [num]',
	          //ymax: 'auto [num]',
	          
	          resize:true ,
	        });
	        //--->daily graph > end

			//---> smry stats > end

			//---> details stats > start
			var data_table_arr_details = [];
			var d1 = alasql('select * from ? order by rec_dttm desc',[arr1])
			$.each(d1 , function(i3, v3) 
			{
				data_table_arr_details.push(	
				[			
					v3.rec_dttm,
					'<a href="http://www.infosniper.net/index.php?ip_address='+v3.url_tracker_ip+'"  target="_blank">'+v3.url_tracker_ip+'</a>',
					v3.url_tracker_refer, 							 
				])
			});			
			
			var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
			var tbl_data = ''
			+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered"  width="100%"></table>';

			$(document).find('.pretty_url_stats_details').html(tbl_data );

			$('#'+Data_Table_AutoID+'').DataTable( 
			{
				data: data_table_arr_details,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				aaSorting: [[1, 'asc']],		

				columns: 
				[				   				 
				  	{ title: "Publish Date" },	
				  	{ title: "IP Address" },				  	
				  	{ title: "Refer" }, 
				],                
			});
			//---> details stats > end

		}

	});
 
});
//--->get url stats - end