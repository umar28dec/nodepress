/*
	Export -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/




//--->get data - start
app.get('/np-admin/export', function(req, res, next) 
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
			res.json(d1) 			
			return false  
		}

		//all good to go
		func.log('GET-> '+ site_url ) 

		var datasend 	= req.query.datasend


		var np_comments = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_comments')
			.find({}, {_id:false,})			 
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		var np_options = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_options')
			.find({}, {_id:false,})			 
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		var np_posts = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_posts')
			.find({}, {_id:false,})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})


		var np_terms = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_terms')
			.find({}, {_id:false,})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		var np_users = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_users')
			.find({}, {_id:false,})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		Promise.all([np_comments,np_options,np_posts,np_terms,np_users]).then(function(results) 
		{
			var np_comments = results[0]
			var np_options 	= results[1]
			var np_posts 	= results[2]
			var np_terms 	= results[3]
			var np_users 	= results[4]
			res.json( 
			{
				status:'success', msg:'export data',
				np_comments:np_comments,
				np_options:np_options,
				np_posts:np_posts,
				np_terms:np_terms,
				np_users:np_users, 
			}) 
		})

	})
 

});
//--->get data - end

function statPath(path) 
{
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
} 


//--->post data - start
app.post('/np-admin/import', function(req, res, next) 
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
			res.json(d1) 			
			return false  
		}

		//all good to go
		func.log('POST-> '+ site_url )
		

		var import_db = func.GetPathTo('/import_db')
		var import_db_folder = statPath(import_db);	
		if(!import_db_folder)
		{
			fs.mkdirSync(import_db)			 
		}
 
		var PathToUploadDir = '/import_db/';
		var upload_dir = '/import_db'

		// create an incoming form object
		var form = new formidable.IncomingForm();

		// specify that we want to allow the user to upload multiple files in a single request
		form.multiples = true;
 
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

			global.GetFilePathDir = func.GetPathTo(PathToUploadDir+CreateNewFileName)

			var id 	= Math.random().toString(36).substr(2, 5);
  
			fs.rename(file.path, GetFilePathDir,function (err) 
			{ 
	  			if (err) throw err;  			
	  			//console.log('Uploaded file: ' + file.name)
	  			func.log('Uploaded file: ' + file.name)

	  			import_table(GetFilePathDir)
	  			
				
				/*

	  			//--->import data > start
	  			var data = JSON.parse(fs.readFileSync(GetFilePathDir))

	  			var obj = data 
	  			var a1 = []
				for (var prop in obj) 
				{
					npdb.collection(prop).deleteMany({})

					var obj_name = prop
					var obj_data = obj[prop]
					a1.push({obj_name:obj_data})


					

				
					setTimeout(function(obj_name, obj_data)
					{
						npdb.collection(obj_name).insertMany(obj_data)
					}, 30);
					
					
				}	  			
				//--->import data > end

				convert_field_to_number(a1)
				*/
			});
		});

		// log any errors that occur
		form.on('error', function(err) 
		{
			console.log('An error has occured: \n' + err);
		});

		// once all the files have been uploaded, send a response to the client
		form.on('end', function(field, file) 
		{  		
			console.log('uploaded finished.. ')	

			//import_table(upload_file_name[0].file_name);
			var d1 = JSON.parse(fs.readFileSync(GetFilePathDir))
			res.json({ status:"success", msg:"imported site data",upload_file_name:upload_file_name, GetFilePathDir:GetFilePathDir,d1:d1  });
		});

		// parse the incoming request containing the form data
		form.parse(req);

		return false;
	})
		
 

});
//--->post data - end


var import_table = function(GetFilePathDirname)
{
	console.log(' GetFilePathDirname ', GetFilePathDirname);

	
	var data = JSON.parse(fs.readFileSync(GetFilePathDir))

	var obj = data 
	var a1 = []

	//--->delete all old data > start
	for (var prop in obj) 
	{
		npdb.collection(prop).deleteMany({})		 
	}	  			
	//--->delete all old data > start

	//--->import data > start
	for (var prop in obj) 
	{
		//npdb.collection(prop).deleteMany({})

		var obj_name = prop
		var obj_data = obj[prop]
		a1.push({obj_name:obj_data})
		npdb.collection(obj_name).insertMany(obj_data)
		//setTimeout(function(obj_name, obj_data){}, 30);
	}	
	//--->import data > end

	convert_field_to_number(a1)
}

 


var convert_field_to_number = function(obj)
{ 
	var np_users 		= obj.np_users
	var np_options 		= obj.np_options
	var np_posts 		= obj.np_posts
	var np_terms 		= obj.np_terms
	var np_comments 	= obj.np_comments

	//np_users
	if(_.size(np_users) > 0 )
	{	
		npdb.collection('np_users').find().forEach( function (x) 
		{   
			//convert to number
			x.user_id =  parseInt(x.user_id)  			 
			x.rec_dttm_unix =  parseInt(x.rec_dttm_unix) 
			npdb.collection('np_users').save(x)
		})
	}

	//np_options
	if(_.size(np_options) > 0 )
	{	
		npdb.collection('np_options').find().forEach( function (x) 
		{   
			//convert to number
			x.option_id =  parseInt(x.option_id)  
			x.rec_dttm_unix =  parseInt(x.rec_dttm_unix) 
			npdb.collection('np_options').save(x)
		})
	}

	//np_posts
	if(_.size(np_posts) > 0 )
	{	
		npdb.collection('np_posts').find().forEach( function (x) 
		{   
			//convert to number
				x.post_id =  parseInt(x.post_id)  
				x.post_author_id =  parseInt(x.post_author_id) 
				x.post_dttm_unix =  parseInt(x.post_dttm_unix) 

				//set the views to zero 
				x.post_views =  parseInt(0) 
				
				x.comment_counter =  parseInt(x.comment_counter) 

				x.rec_dttm_unix =  parseInt(x.rec_dttm_unix) 
				x.comment_counter =  parseInt(x.comment_counter) 
				
				if(_.size(x.categories) > 0)
				{
					x.categories.forEach(function(y)
					{
						y.post_id =  parseInt(y.post_id) 
						y.term_id =  parseInt(y.term_id)  
					})
				}  
				npdb.collection('np_posts').save(x)
		})
		
	} 
	
	//np_terms
	if(_.size(np_terms) > 0 )
	{	
		npdb.collection('np_terms').find().forEach( function (x) 
		{   
			//convert to number
			x.term_id =  parseInt(x.term_id)  
			x.rec_dttm_unix =  parseInt(x.rec_dttm_unix) 
			npdb.collection('np_terms').save(x)
		})
	}

	//np_comments
	if(_.size(np_comments) > 0 )
	{	
		npdb.collection('np_comments').find().forEach( function (x) 
		{   
			//convert to number
			x.comment_id =  parseInt(x.comment_id)  
			x.post_id =  parseInt(x.post_id)  
			x.rec_dttm_unix =  parseInt(x.rec_dttm_unix) 
			npdb.collection('np_comments').save(x)
		})
	}

}
 