app.get('/np-admin/media', function(req, res, next) 
{
	var site_url = func.DomainURL(req).cur_path;

	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}
		
		func.log('GET-> '+ site_url );
		GetUserFiles (req, res) 
	 	
	})
})

function GetUserFiles (req, res) 
{
	var url = func.DomainURL(req).url +"/np-content/uploads/";

	var dir = func.GetPathTo('/views/np-content/uploads/')

	var arr_files = [];
	
	//check to see if there are any files in the folder
	var file_check = fs.readdirSync(dir)
	

	if(_.size(file_check) < 1 )
	{		 
		res.json({ status:"error", msg:'no files', code:'no_files'});
		return false;
	}

	//found files
	file_check.forEach(function(file) 
	{
		var file_dttm = fs.statSync(dir +file).ctime;

		arr_files.push(
		{
    		file_name: file, 
    		file_path: url+file,
    		file_dttm: moment(file_dttm).format('YYYY-MM-DD h:m:s a'),
    		file_dttm_unix: +moment(file_dttm) 
    	})	
	})
	 
	var files_by_dttm = alasql('select * from ? order by file_dttm_unix DESC ', [arr_files])

	res.json({ status:"success", arr_files: files_by_dttm});
 
 
}


//--->post data - start
app.post('/np-admin/media', function(req, res)
{
	var site_url = func.DomainURL(req).cur_path;


	//res.json({ status:"success", site_url:site_url,  });

	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}
		
		func.log('GET-> made to media '+ site_url );
 

		var upload_dir = 'np-content/uploads'

		// create an incoming form object
		var form = new formidable.IncomingForm();

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;

		//var curr_dir = func.RootDir()

		//form.uploadDir = path.join(__dirname, 'views/'+upload_dir+'/');
		//form.uploadDir = path.join(process.cwd(), 'views/'+upload_dir+'/');
		//form.uploadDir = path.join(func.RootDir(), 'views/'+upload_dir+'/');
		var PathToUploadDir = 'views/'+upload_dir+'/';
		
		form.uploadDir = func.GetPathTo(PathToUploadDir)

		// every time a file has been uploaded successfully,
		// rename it to it's orignal name
		
		global.upload_file_name = []

		form.on('file', function(field, file) 
		{
			upload_file_name.push({file_name: upload_dir+'/'+file.name}); 
			
			//need this for multiple upload files
			var d =  path.join(form.uploadDir, file.name); 
			
			var GetFileName  = func.GetFileName(file.name);
			var GetFileExt = func.GetFileExt(file.name);

			/*
				var AutoID = func.AutoID(5)

				need this in case if the same file name is uploaded again...
				this will prevent from crashing the system!
			*/
			var AutoID = func.GetRandomID(3)

			var CreateNewFileName = GetFileName+'-'+AutoID+'.'+GetFileExt

			var GetFilePathDir = func.GetPathTo(PathToUploadDir+CreateNewFileName)

			var id 	= Math.random().toString(36).substr(2, 5);
  
			//fs.rename(file.path, path.join(form.uploadDir, file.name),function (err) 
			fs.rename(file.path, GetFilePathDir,function (err) 
			{ 
	  			if (err) throw err;  			
	  			//console.log('Uploaded file: ' + file.name)
	  			func.log('Uploaded file: ' + file.name)
			});
			
			//fs.renameSync(file.path, path.join(form.uploadDir, file.name));

		});

		// log any errors that occur
		form.on('error', function(err) 
		{
			console.log('An error has occured: \n' + err);
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', function() 
		{  			
			res.json({ status:"success", upload_file_name:upload_file_name,  });
			//res.end('success' + form);

		});

		// parse the incoming request containing the form data
		form.parse(req);
	});

});
//--->post data - end


//--->delete > single - start
app.delete('/np-admin/media', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	
	var site_url = func.DomainURL(req).cur_path;

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('DELETE-> '+ site_url );

		var datasend 			= req.body.datasend; 
		var media_file_name 	= req.body.media_file_name;
		
		if(!media_file_name)
		{
			res.json( {status:'error', msg:'no media file name' });
		}

		var file_path = path.join(func.RootDir(), '/views/np-content/uploads/'+media_file_name);

		res.json( {status:'success', msg:'deleted row', media_file_name: media_file_name});

		fs.stat(file_path, function (err, stats) 
		{
		   //console.log(stats);//here we got all information of file in stats variable

		   if (err) {
		       return console.error(err);
		   }

		   fs.unlink(file_path,function(err)
		   {
		        if(err) return console.log(err);
		        console.log('Deleted: ' + media_file_name);
		   });  
		});
	})
});
//--->delete > single - end


//--->delete > multiple - start
app.delete('/np-admin/media/multiple', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	
	var site_url = func.DomainURL(req).cur_path;

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('DELETE-> '+ site_url );

		var datasend 			= req.body.datasend; 
		var delete_media_ids 	= req.body.delete_media_ids;
		
		if(!delete_media_ids || _.size(delete_media_ids) < 1)
		{
			res.json( {status:'error', msg:'no media file name' });
		}

		//var file_path = path.join(func.RootDir(), '/views/np-content/uploads/'+media_file_name);

		res.json( {status:'success', msg:'deleted row', delete_media_ids: delete_media_ids});

		delete_media_ids.forEach( function(media_file_name, index) 
		{
			var file_path = func.GetPathTo('/views/np-content/uploads/'+media_file_name)

			fs.stat(file_path, function (err, stats) 
			{
			   //console.log(stats);//here we got all information of file in stats variable

			   if (err) {
			       return console.error(err);
			   }

			   fs.unlink(file_path,function(err)
			   {
			        if(err) return console.log(err);
			        console.log('Deleted: ' + media_file_name);
			   });  
			});
		});
	})
});
//--->delete > multiple - end