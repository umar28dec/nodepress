function format_view_count (num,decimalpoint) 
{ 
	if(num != '')
	{ 
		var result;
		if(num<=0)
		{
			result = num; 
		}
      	else  if (num >= 0 && num<999) 
		{
			//format to thousand
		    result = num; 
		}
		else  if (num >= 1000 && num<999999) 
		{
			//format to thousand
		    result =  (num / 1000).toFixed(decimalpoint).replace(/\.0$/, '') + 'K';
		}
		else if (num >= 1000000) 
		{
			//format to million
		    result =    (num / 1000000).toFixed(decimalpoint).replace(/\.0$/, '') + 'M';
		}  
		return result;
	}
}

var Screen_Dashboard_Home = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading home dashboard")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'dashboard/home';

	var DataString = 
	{		 
		datasend:'get_export',
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
		//$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	});

	//success
	ajax.done(function(data) 
	{ 

		//console.log(data)

		$('.MsgBox').html('')

		var get_status = data.status

		if(get_status == 'error')
		{
			$('.ScreenData').html().show()	
			return false
		}

		var np_posts = 	alasql('select post_type, count(post_type) as total_count, sum(post_views*1) as total_views from ?  group by post_type', [data.np_posts ])

		var data_table_arr = []
		np_posts.forEach(function(ele,index)
		{
			var options 
			if(ele.post_type == 'post')
			{
				options = '<a href="#/posts/all" class="ScreenMenu btn btn-link"> View</a>'
			}
			else if(ele.post_type == 'page')
			{
				options = '<a href="#/pages/all" class="ScreenMenu btn btn-link"> View</a>'
			} 
			data_table_arr.push(
			[
				_.startCase(ele.post_type),
				ele.total_count,
				ele.total_views > 0 ? format_view_count(ele.total_views,2): ele.total_views,
				//ele.total_views,
				options
			])
		})


		var Data_Table_AutoID = "data_table_"+js.AutoCode();

		var tbl_data = ''
		+ '</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered "  width="100%"></table>';
 
		$('.ScreenData').html(tbl_data).show()

		$('#'+Data_Table_AutoID+'').DataTable( 
		{
			data: data_table_arr,
			"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
			"pageLength": 25,
			order: [[ 0, 'desc' ]],
			"columnDefs": [ {
		      "targets"  : 'no-sort',
		      "orderable": false,
		    }],
			columns: [
			  { title: 'Type' },
			  { title: "Total Count" },				 
			  { title: "Total Views" },	    
			  { title: "Options" },
			],                
		});  
	
		//var d = JSON.stringify(np_posts, null, 2)

		//var tbl = js.CreateTable(np_posts,["Type", "Total Posts/Pages", "Total Views"]); 
	})
}