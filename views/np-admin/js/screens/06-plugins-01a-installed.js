
//--->plugin status box - start
var create_plugin_status = function(current_status, plugin_name, plugin_folder, plugin_url)
{	
	var get_current_status
	if(!current_status)
	{
		get_current_status = ''
	}
	else if(current_status)
	{
		get_current_status = '<option value="'+current_status+'">'+current_status+'</option>'
	}

	var box = ''	
	+'<select class="btn-group btn btn-default dropdown-toggle plugin_status_updater " plugin_name="'+plugin_name+'" plugin_folder="'+plugin_folder+'" plugin_url="'+plugin_url+'" >'
		+get_current_status
		+'<option value="">Select A Status</option>'
		+'<option value="activate">activate</option>'
		+'<option value="deactivate">deactivate</option>'
		+'<option value="delete">delete</option>'
	+'</select>'
	///+'<br><br>'
	+'<div class="plugin_status_alert"></div>'
	
	return box; 
}
//--->plugin status box - end


var Screen_Plugins_Installed = function ()
{
	var d = '<div class="Waiting_Msg animated infinite bounce " style="padding:20px;">'
	+bs.WaitingMsg("Please wait....loading post screen")
	+'</div>'

	$('.MsgBox').html(d).show();

	$('.ScreenData').hide();

	var CallType   = 'GET' //--->Other options: GET/POST/DELETE/PUT
	var AjaxURL    = 'plugins';


	//var user_id_data =  alasql('Select * FROM np_users')[0];


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
		+ 'Please try agin in a few seconds.<br><br>';     

		var ErrorMsg = bs.AlertMsg(Msg,'error');

		$('.MsgBox').html(ErrorMsg).show();
		//$('.ScreenData').show();

		console.log(thrownError);
		console.log(xhr); 

		return false    
		 
	})

	//success
	ajax.done(function(data) 
	{ 		
		var get_status = data.status
		if(get_status =='error')
		{
			var d = bs.AlertMsg(data.msg, "error");
			$('.MsgBox').html(d).show();
			//$('.ScreenData').html().show();
			return false;
		}

		///console.log(data);


		$.get('html/009a-plugins-all.html', function(template_data)     
    	{  
    		$('.MsgBox').hide();

    		$('.ScreenData').html(template_data); 

    		if(get_status =='no_plugins')
			{
				var d = bs.AlertMsg("No plugins were found...", "warning");

				$('.plugins_alert').html(d).show();	

				$(document).find('.plugin_data_container').hide()
				$('.ScreenData').show();

				return false;
			}

			//--->parse plugin data > start
			var get_plugins = []
			 
			data.plugins.forEach(function(ele)
			{
				get_plugins.push({
					plugin_folder:ele.plugin_folder,

					
					author_name:ele.plugin_content.author_name,
					author_url:ele.plugin_content.author_url,
					description:ele.plugin_content.description,
					name:ele.plugin_content.name,
					version:ele.plugin_content.version,
					plugin_url:ele.plugin_folder+ ele.plugin_content.plugin_file_name, 
					settings_file:ele.plugin_content.settings_file,
					settings_button_id:ele.plugin_content.settings_button_id,

				})

				//--->load the settings js file in the header > start
				if( _.size(ele.plugin_content.settings_file) > 0)
				{
					var js_file = js.GetSiteURL()+ele.plugin_folder+ele.plugin_content.settings_file
					include_once('js',js_file)					
				}
				//--->load the settings js file in the header > end
				
			})

			//sort by plugin name by ascending order
			var all_plugins = alasql('select * from ? order by plugin_url ASC ', [get_plugins])
			//--->parse plugin data > start
		
			var active_plugins = data.active_plugins
 			

 			//--->create plugin screen > start
			var data_table_arr = []
			all_plugins.forEach(function(ele)
			{	
				var options =''
				options+= ele.description
				options+='<br><br>'
				options+= 'Version '+ele.version+' | '
				options+='By <a href="'+ele.author_url+'" target="_blank"> '+ele.author_name+'</a> |'

				if(_.size(ele.settings_file) > 0 && _.size(ele.settings_button_id) >0)
				{
					options+='<span class="btn btn-link '+ele.settings_button_id+'">Settings<span>'
				}
				options+=''
		 
				var check_active_plugin = alasql('select * from ? where plugin_folder=?', [active_plugins, ele.plugin_folder])
				//console.log(check_active_plugin)

				var d1 = _.size(check_active_plugin) > 0 ? 'activate' : ''

				data_table_arr.push(
				[
					'<input type="checkbox" class="bulk_plugin_id no-sort" plugin_folder="'+ele.plugin_folder+'" plugin_url="'+ele.plugin_url+'" plugin_name="'+ele.name +'">',
					d1,
					ele.name+'<br><br>' + create_plugin_status(d1,ele.name , ele.plugin_folder,ele.plugin_url),
					options
				])

			})			
 			//--->create plugin screen > end

			$('.MsgBox').hide();

			var Data_Table_AutoID = "data_table_"+js.AutoCode();
  
			var tbl_data = ''
			tbl_data +='</br></br> <table id="'+Data_Table_AutoID+'"  class="table table-hover table-bordered "  width="100%"></table>';
			tbl_data += ''

	 		$(document).find('.all_plugins_data').html(tbl_data ).show();

			$('.ScreenData').show();

			$('#'+Data_Table_AutoID+'').DataTable( 
			{
				data: data_table_arr,
				"lengthMenu": [ [10,25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
				"pageLength": 25,
				order: [[ 0, 'asc' ]],
				"columnDefs": [ {
			      "targets"  : 'no-sort',
			      "orderable": false,
			    }],
				columns: [
					{ title: 'Select<br> <input type="checkbox" class="select_all_plugins no-sort">' },
					{ title: "Status" },	
					{ title: "Plugins" },	
					{ title: "Description" }, 
				],                
			});  

    	})

	});

}
