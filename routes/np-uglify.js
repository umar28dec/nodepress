
//--->minify js - start

var minify_plugin_js = function (folder_file_path_obj) 
{
	var start_folder_path = folder_file_path_obj.start_folder
	
	var end_folder_path = folder_file_path_obj.end_folder
	var end_file_name = folder_file_path_obj.end_file_name

	var folder_path = start_folder_path

    var dir = func.GetPathTo(folder_path)	
	
	//check to see if there are any files in the folder
	var file_check = fs.readdirSync(dir)

	if(_.size(file_check) < 1 )
	{		 
		return false;
	}

	console.log("//----> start minifing  folder >>"+ start_folder_path)
	console.log("....")
	//found files
	var arr_files = [];
	file_check.forEach(function(file) 
	{ 
		var file_ext = func.GetFileExt(file);


		if(file_ext =='js')
		{
			var file_Path = func.GetPathTo(folder_path+file)

			var contents = fs.readFileSync(file_Path, 'utf8');

			var result = UglifyJS.minify(contents, 
			{
				mangle: true,
				compress: {
					sequences: true,
					dead_code: true,
					conditionals: true,
					booleans: true,
					unused: true,
					if_return: true,
					join_vars: true,
					drop_console: true
				} 
			}); 
			arr_files.push(result.code)

			
			console.log("minifing >> "+ file)
		}		 
	})

	fs.writeFile(func.GetPathTo(end_folder_path+end_file_name), arr_files.join(' '), function (err,data) 
	{
		if (err) 
		{
			return console.log(err)
		}

		console.log("....")

		console.log("//----> created mini file >>"+ end_file_name)
		
	}) 

}

app.get('/min', function(req, res, next) 
{
	//--->minify > awesome funtions > start	 
	minify_plugin_js(
	{
		start_folder:'views/np-core/libs/awesome-functions/js/',
		end_folder:'views/np-core/libs/awesome-functions/',
		end_file_name:'awesome-functions-min.js',
			
	})	
	//--->minify > awesome funtions > end

	res.json({ status:"success", });
 
})

  


//--->minify np-admin screens folder - start
/*
fs.watch(func.GetPathTo('views/np-admin/js/screens/'), function (event, filename) 
{

    console.log('event is: ' + event);
    //minify_plugin_js();
    if (filename) 
    {
    	//console.log('filename   provided ' +  filename);

    	var folder_file_path_obj = {
    		start_folder:'views/np-admin/js/screens/',
    		end_folder:'views/np-admin/js/',
    		end_file_name:'np-admin-screens.mini.js',
    			
    	}
    	minify_plugin_js(folder_file_path_obj);
	     
    } 
    else 
    {
        console.log('filename not provided');
    }
})
*/
//--->minify np-admin screens folder - end
 




