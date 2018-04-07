/*
	Themes -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

var get_all_themes = function(dir) 
{
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) 
    {
        var dir_file = dir + '/' + file

        var stat = fs.statSync(dir_file)
        if (stat && stat.isDirectory()) 
        {
        	//var check_package_plugin = fs.statSync()
        	var filePath = dir_file+'/package.json'
        	var check_package =  fs.existsSync(filePath) 

        	if(check_package)
        	{
        		var theme_slug = file
        		var theme_folder= 'np-content/themes/'+file+'/'
        		
        		var file_Path = theme_folder +'package.json'
        		
        		var obj = fs.readFileSync(dir_file+'/package.json', 'utf8' )
        		
        		var file_dttm = fs.statSync(dir_file).ctime;

        		//var content = JSON.parse(obj)
        		var content = JSON.parse(obj)
        		 
    			var d =
        		{

        			folder_dttm:file_dttm,
	       			file_dttm_unix: +moment(file_dttm),

	       			theme_slug:theme_slug, 
					
					theme_folder: theme_folder,

					theme_name: content.theme_name,
					
					theme_url:content.theme_url,
					
					theme_screen_shot :theme_folder+ content.theme_screen_shot,
					
					author: content.author,
					
					author_url: content.author_url,
					
					description: content.description,
					
					version: content.version,
					
					custome_pages:content.custome_pages,

					theme_package:content
        		}

        		var theme_package = 
        		{
        			theme_folder:theme_folder, 
        			theme_slug: file,	
        			theme_content: content,
        		}

        		results.push(theme_package)
        	}        	 	
        }
    })
	return results
}

//--->create new data - start

//upload new 
app.put('/np-admin/themes', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path

		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//all good to go

		var upload_dir = 'np-content/themes'

		// create an incoming form object
		var form = new formidable.IncomingForm();

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;

		var PathToUploadDir = 'views/'+upload_dir+'/';
		form.uploadDir = func.GetPathTo(PathToUploadDir)

		// every time a file has been uploaded successfully,
		// rename it to it's orignal name
		
		global.upload_file_name = []
		var AutoID = func.GetRandomID(3)

		form.on('file', function(field, file) 
		{
			
			
			//need this for multiple upload files
			var d =  path.join(form.uploadDir, file.name); 
			
			var GetFileName  = func.GetFileName(file.name);
			var GetFileExt = func.GetFileExt(file.name);

			/*
				var AutoID = func.AutoID(5)

				need this in case if the same file name is uploaded again...
				this will prevent from crashing the system!
			*/ 

			  
			var NewFileName =  AutoID+'-'+ GetFileName
			var CreateNewFileName = NewFileName+'.'+GetFileExt

			var GetFilePathDir = func.GetPathTo(PathToUploadDir+CreateNewFileName)

			upload_file_name.push(
			{
				get_file_path: PathToUploadDir+CreateNewFileName,
				file_name:  GetFileName+'-'+AutoID
			}) 
  
			//fs.rename(file.path, path.join(form.uploadDir, file.name),function (err) 
			fs.rename(file.path, GetFilePathDir,function (err) 
			{ 
	  			if (err) throw err;  			
	  			console.log('Uploaded file: ' + file.name)
	  			func.log('Uploaded file: ' + file.name)	  			 

				//--->unzip plugin > start
				var f1 = GetFilePathDir
				var f2 = func.GetPathTo('views/np-content/themes')
				fs.createReadStream( f1).pipe(unzip.Extract({ path: f2}))
				//--->unzip plugin > end

				
				//get_new_uploaded_themes(res, req)

				//delete the uploaded zip file
				//fs.unlinkSync(f1)

			})

		});
 
		// log any errors that occur
		form.on('error', function(err) 
		{
			console.log('An error has occured: \n' + err);
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', function() 
		{  			
			//get_new_uploaded_themes(res, req)
			res.json({ status:"success", upload_file_name:upload_file_name,  });
			//remove_all_zip_files()

			

		});

		// parse the incoming request containing the form data
		form.parse(req);
	})
})

var remove_all_zip_files = function ()
{
	var dir = func.GetPathTo('/views/np-content/themes/')
	var list = fs.readdirSync(dir)
 	
 	if(_.size(list) > 0)
 	{
		list.forEach(function(file) 
		{ 
			var file_ext = func.GetFileExt(file)

			if(file_ext =='zip')
			{
				var dir_file = func.GetPathTo(dir+file)

				//if(fs.statSync(file_Path).isFile())
				//if(fs.statSync(file_Path) && fs.statSync(file_Path).isFile() && _.size(file_Path) > 0)
				if(_.size(dir_file) > 0)
				{
					//fs.unlinkSync(file_Path)	
					fs.unlinkSync(dir_file)
				}

				console.log(file_Path)
			}		 
		})
	}

	
}

var get_new_uploaded_themes = function(res, req)
{
	var site_url = func.DomainURL(req).cur_path
	var dir = func.GetPathTo('/views/np-content/themes/')
	var get_themes = get_all_themes(dir)

	if(_.size(get_themes) < 1 )
	{
		res.json( {status:'no_themes', msg:'no installed themes found '}) 
		return false
	}

	var files_by_dttm = alasql('select * from ? order by theme_slug ASC ', [get_themes])


	func.log('GET-> '+ site_url )
	npdb.collection('np_options').find({option_name: "active_theme"}).toArray(function (err,  data)
	{
		if(_.size(data) >0) 
		{		
			var theme_slug = data[0].option_value 

			res.json( {status:'success', msg:'theme info', themes: files_by_dttm, active_theme: theme_slug,  }) 
			return false  
		}
		else if(_.size(data) <1) 
		{
			res.json( {status:'success', msg:'no active themes ', themes: files_by_dttm, active_theme:'', }) 
			return false  
		}

	})

}
//--->create new data - end


//--->get data - start
app.get('/np-admin/themes', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path;

		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//all good to go

		get_new_uploaded_themes(res, req)

	})
 

});
//--->get data - end




//--->update data - start
app.post('/np-admin/themes', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ) 
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path;

		var Status = d1.status
		if(Status=="error")
		{
			//error with admin token
			res.json(d1)			
			return false
		}

		//all good to go
		func.log('POST-> '+ site_url )

		var plugin_status 	= req.body.plugin_status
		var theme_slug 		= req.body.theme_slug

		if(_.size(theme_slug)<1)
		{
			res.json( {status:'error', code:'missing_theme_id', msg:'missing theme id ', }) 
			return false
		}
		
		var new_theme_activate =
		{
			option_id : +moment(),
			option_name : "active_theme",
			option_value :  theme_slug,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		npdb.collection('np_options').find({option_name: "active_theme"}).toArray(function (err,  data)
		{
			if(_.size(data) < 1 ) 
			{		

				npdb.collection('np_options').insert(new_theme_activate) 

				res.json( {status:'success', msg:'activated a new theme'}) 
				return false 
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_options')
				.updateOne( {option_name: "active_theme"}, { $set: {option_value:theme_slug} },function (err, result)
				{
					if (err) throw err;					 
					
					res.json( {status:'success', msg:'updated new theme',  });
					return false; 
				}) 

				//res.json( {status:'success', msg:'no active themes ', themes: get_themes, active_theme:'', }) 
				//return false  
			}

		})






	})

});
//--->update data - end



//--->delete data - start
app.delete('/np-admin/themes', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path;

		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('DELETE-> '+ site_url );

		var datasend 		= req.body.datasend;
		var theme_folder 	= req.body.theme_folder; 


		if(_.size(theme_folder)<1)
		{
			res.json( {status:'error', msg:'missing theme folder name  in api call'})
			return false
		}

		var path = '/views/np-content/themes/'+theme_folder +'/'

		res.json( {status:'sucess', msg:'theme deleted', theme_folder:path})

		var dir = func.GetPathTo(path)

		remove_dir(dir)
	})

})
 
 

function remove_dir(folder_path,cb ) 
{	
	//var dir_path = func.GetPathTo(folder_path)
	var dir_path = folder_path
    if (fs.existsSync(dir_path)) 
    {
    	var list = fs.readdirSync(dir_path)
    	if(_.size(list)>0)
    	{ }
	        fs.readdirSync(dir_path).forEach(function(entry) 
	        {
	            var entry_path = path.join(dir_path, entry);
	            if (fs.lstatSync(entry_path).isDirectory()) 
	            {
	                remove_dir(entry_path)
	            } 
	            else 
	            {
	                fs.unlinkSync(entry_path)
	            }
	        })              
	        fs.rmdirSync(dir_path)
    }
    //if (fs.existsSync(dir_path)) 
     
}

 
var delete_single_theme = function(folder_path) 
{
	
	//var dir = func.GetPathTo(folder_path)
	var dir = folder_path

    var list = fs.readdirSync(dir)
    //console.log(list)

    if(_.size(list)>0)
    { 
    	var deleted_files = []
    	//--->delete all the files in the folder > start
    	list.forEach(function(file)
    	{
    		var dir_file = func.GetPathTo(folder_path + '/' + file)   		

    		deleted_files.push(file)

    		//fs.unlinkSync(dir_file)

    		var entry_path =dir_file
            if (fs.lstatSync(entry_path).isDirectory()) 
            {
                delete_single_theme(entry_path);
            } 
            else 
            {
                fs.unlinkSync(entry_path);
            }
    		 
		})		
    	//--->delete all the files in the folder > end

    	if(_.size(deleted_files) > 0)
    	{
    		//deleted x numbers of files

    		//delete the folder
    		fs.rmdirSync(dir)
    	}
		
    }

    
}

//--->delete data - end