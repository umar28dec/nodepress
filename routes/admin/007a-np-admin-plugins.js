/*
	Plugins -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');
var walk = function(dir) 
{
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) 
    {
        var dir_file = dir + '/' + file

        //console.log(file)
        //file = '/' + file
        var stat = fs.statSync(dir_file)
        if (stat && stat.isDirectory()) 
        {
        	results = results.concat(walk(dir_file))	
        }
        else 
        {
        	results.push(file)
        }
    })
    return results
}

var get_all_plugins = function(dir) 
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
        	var check_package_plugin =  fs.existsSync(filePath) 
        	if(check_package_plugin)
        	{
        		var plugin_folder= 'np-content/plugins/'+file+'/'
        		
        		var file_Path = plugin_folder +'package.json'
        		
        		var obj = fs.readFileSync(dir_file+'/package.json', 'utf8' )
        		
        		var file_dttm = fs.statSync(dir_file).ctime;

        		var content = JSON.parse(obj)

        		var plugin_package = 
        		{
        			plugin_folder:plugin_folder, 
        			plugin_slug: file,	
        			plugin_content: content,
        		}


        		results.push(plugin_package)
        	}        	 	
        }
        
    })
    return results
}




//--->create new data - start
app.put('/np-admin/plugins/single', function(req, res, next) 
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

		var upload_dir = 'np-content/plugins'

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
				var f2 = func.GetPathTo('views/np-content/plugins')
				fs.createReadStream( f1).pipe(unzip.Extract({ path: f2}))
				//--->unzip plugin > end

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
			res.json({ status:"success", upload_file_name:upload_file_name,  });

		});

		// parse the incoming request containing the form data
		form.parse(req);

		  
	})

})
//--->create new data - end


//--->get data - start
app.get('/np-admin/plugins', function(req, res, next) 
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
		var dir = func.GetPathTo('/views/np-content/plugins/')
	 

		var get_plugins = get_all_plugins(dir)
		 
		if(_.size(get_plugins) < 1 )
		{
			res.json( {status:'no_plugins', msg:'no installed plugins found ',   }) 
			return false
		}
 
		 
		func.log('GET-> '+ site_url );

		npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
		{
			if(_.size(data) >0) 
			{		
				var d1 = data.option_name

				var a1 = []
				data.forEach(function (ele) 
				{
					//var obj = JSON.parse(ele.option_value)
					var obj = ele.option_value
					obj.forEach(function(ele2)
					{
						a1.push(ele2)
					})
					
				})

				res.json( {status:'success', msg:'plugin info', plugins: get_plugins, active_plugins: a1,  }) 
				return false  
			}
			else if(_.size(data) <1) 
			{
				res.json( {status:'success', msg:'no active plugins ', plugins: get_plugins, active_plugins:'', }) 
				return false  
			}

		})

		
	})
 

});
//--->get data - end



//--->update data - start

app.post('/np-admin/plugins/single', function(req, res, next) 
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
		func.log('POST-> '+ site_url );
		var datasend 		= req.body.datasend;
		var plugin_status 	= req.body.plugin_status;
		var plugin_folder 	= req.body.plugin_folder;
		var plugin_url 		= req.body.plugin_url;

		var new_plugin_activate =
		{
			option_id : +moment(),
			option_name : "active_plugins",
			//option_value : JSON.stringify( [{plugin_folder:plugin_folder,plugin_url:plugin_url }]),
			option_value :  [{plugin_folder:plugin_folder,plugin_url:plugin_url }],
			autoload : "no",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
		{
			
			//--->activate new plugin > start 
			if(_.size(data) <1) 
			{
				//no plugins in the table
				npdb.collection('np_options').insert(new_plugin_activate) 

				res.json( {status:'success', msg:'activated a new plugin'});
				return false; 
			}	
			//--->activate new plugin > end

			//--->activate/update plugins > start 		
			else if(_.size(data) >0) 
			{
				//append to one already exist

 
				var a1 = []
				data.forEach(function (ele) 
				{
					//var obj = JSON.parse(ele.option_value)
					var obj = ele.option_value
					obj.forEach(function(ele2)
					{
						a1.push(ele2)
					})
					
				})
				//convert to json
				//var obj = JSON.parse(data[0].option_value)
				//var obj = data[0].option_value

 				//plugin check 
 				var plugin_check = alasql('select * from ? where plugin_folder=?', [a1, plugin_folder])

 				//res.json( {status:'test', plugin_check:plugin_check , obj2:a1});

 				//return false
 				if(_.size(plugin_check)  < 1 ) 
 				{
 					//add new plugin to array

					var obj1 = {plugin_folder:plugin_folder,plugin_url:plugin_url }
					var add_new_plugin =   _.concat(a1, obj1)
					 
					 
					npdb.collection('np_options')
					.updateOne( {option_name: "active_plugins"}, { $set: {option_value:add_new_plugin} },function (err, result)
					{
						if (err) throw err;					 
						
						res.json( {status:'success', msg:'added/updated new plugin',  });
						return false; 
					}) 
 				}

 				else if(_.size(plugin_check)  > 0 )
 				{
 					//--->deactivate plugin > start
 					if(plugin_status == "deactivate")
 					{
 						var update_plugin_list = alasql('select * from ? where plugin_folder!=?', [a1, plugin_folder])

 						//var add__plugin =   _.concat(a1, obj1)
					 
					 
						npdb.collection('np_options')
						.updateOne( {option_name: "active_plugins"}, { $set: {option_value:update_plugin_list} },function (err, result)
						{
							if (err) throw err;					 
							
							res.json( {status:'deactivate', msg:'plugin list updated',  });
							return false; 
						}) 

 					} 
 					//--->deactivate plugin > end

 				}
 				

				
			}
			//--->activate/update plugins > end
		})

	})

})


app.post('/np-admin/plugins/multiple', function(req, res, next) 
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
		func.log('POST-> '+ site_url );

		var datasend 		= req.body.datasend;
		var plugin_status 	= req.body.plugin_status;
		var plugin_ids 		= req.body.plugin_ids;

		if(_.size(plugin_ids) < 1)
		{
			res.json( {status:'error', msg:'missing plugin ids',  }) 
			return false 
		}
		 
		var new_plugin_activate =
		{
			option_id : +moment(),
			option_name : "active_plugins",
			//option_value : JSON.stringify( [{plugin_folder:plugin_folder,plugin_url:plugin_url }]),
			option_value :  plugin_ids,
			autoload : "no",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}


		npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
		{
			
			//--->activate new plugin > start 
			if(_.size(data) <1) 
			{
				//no plugins in the table
				npdb.collection('np_options').insert(new_plugin_activate) 

				res.json( {status:'success', msg:'activated a new plugin'});
				return false; 
			}	
			//--->activate new plugin > end


			//--->activate/update plugins > start 		
			else if(_.size(data) >0) 
			{
				//append to one already exist
 
				var a1 = []
				data.forEach(function (ele) 
				{
					//var obj = JSON.parse(ele.option_value)
					var obj = ele.option_value
					obj.forEach(function(ele2)
					{
						a1.push(ele2)
					})					
				})
				 

 				//--->plugin check > start
 			
 				var plugin_arr_check  =  function(check_ids, data_ids)
 				{
	 				var match = []
	 				var diff = []
	 				check_ids.forEach(function (ele) 
					{
						var lookup_plugin = ele.plugin_folder
						
						var d1  = alasql('select * from ? where plugin_folder=?', [data_ids, lookup_plugin])

						//console.log(d1)

						if( _.size(d1) >0 )
						{
							match.push(d1)
						}
						else if( _.size(d1) <1 )
						{
							diff.push(ele)
						}
					})
					return {match:match, diff:diff}
	 			} 

 				//--->plugin check > end
 				 
 				var plugin_check = plugin_arr_check(plugin_ids, a1 )

 				 

 				//--->activate plugin > start
 				if(plugin_status == "activate")
 				{
 					var update_plugin_list = plugin_check.diff

 					if(_.size(update_plugin_list)  > 0 ) 
 					{
						var add_new_plugin =   _.concat(a1, update_plugin_list)
						npdb.collection('np_options')
						.updateOne( {option_name: "active_plugins"}, { $set: {option_value:add_new_plugin} },function (err, result)
						{
							if (err) throw err;					 
							
							res.json( {status:'success', msg:'added/updated new plugin',  });
							return false; 
						})  
					}
					else if(_.size(update_plugin_list)  <1  ) 
					{
						res.json( {status:'error', msg:'plugin is not activated',  });
					}
 				}
 				//--->activate plugin > end


 				//--->deactivate plugin > start

 				if(plugin_status == "deactivate")
 				{
 					var update_plugin_list = [] 

 					a1.forEach(function (ele) 
					{
						var lookup_plugin = ele.plugin_folder
						
						var d1  = alasql('select * from ? where plugin_folder=?', [plugin_ids, lookup_plugin]) 

						if( _.size(d1) <1 )
						{ 
							update_plugin_list.push(ele)
						} 
					}) 
 
					npdb.collection('np_options')
					.updateOne( {option_name: "active_plugins"}, { $set: {option_value:update_plugin_list} },function (err, result)
					{
						if (err) throw err;					 
						
						res.json( {status:'deactivate', msg:'plugin list updated',  });
						return false; 
					})  
 				} 
 				//--->deactivate plugin > end 
			}
			//--->activate/update plugins > end
		})

	})

})


//--->update data - end





//--->delete data - start
app.delete('/np-admin/plugins/single', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
 	

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
		func.log('DELETE-> '+ site_url )

		var datasend 		= req.body.datasend;
		var plugin_status 	= req.body.plugin_status;
		var plugin_folder 	= req.body.plugin_folder;
		var plugin_url 		= req.body.plugin_url;


		if(_.size(plugin_folder)<1)
		{
			res.json( {status:'error', msg:'missing plugin folder name  in api call'})
			return false
		}


		npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
		{	
			var path = '/views/'+plugin_folder

			var plugin_arr = get_plugin_arr(data)			

			var update_plugin_list = alasql('select * from ? where plugin_folder!=?', [plugin_arr, plugin_folder])

			//--->deactivate plugin table/collection > start 
			npdb.collection('np_options')
			.updateOne( {option_name: "active_plugins"}, { $set: {option_value:update_plugin_list} },function (err, result)
			{
				if (err) throw err;					 
				
				res.json( {status:'sucess', msg:'plugin deleted - found plugin',  })
				
				//delete the plugin folder
				delete_single_plugin(path)
			})
			//--->deactivate plugin table/collection > end
		}) 
	}) 
}) 



app.delete('/np-admin/plugins/multiple', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
 	

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
		func.log('DELETE-> '+ site_url )

		var datasend 		= req.body.datasend;
		var plugin_ids 		= req.body.plugin_ids;

		if(_.size(plugin_ids) < 1)
		{
			res.json( {status:'error', msg:'missing plugin ids in api call',  }) 
			return false 
		}
 

		npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
		{	
			

			var plugin_arr = get_plugin_arr(data)		
			
			//--->update plugin list > start
			var update_plugin_list = [] 

			plugin_arr.forEach(function (ele) 
			{ 
				var plugin_save  = alasql('select * from ? where plugin_folder!=?', [plugin_ids, ele.plugin_folder])

				if( _.size(plugin_save) >0 )
				{ 					
					update_plugin_list.push(ele)
				} 				
			}) 
			//--->update plugin list > end


 
			//var update_plugin_list = alasql('select * from ? where plugin_folder!=?', [plugin_arr, plugin_folder])

			//--->deactivate plugin table/collection > start 
			npdb.collection('np_options')
			.updateOne( {option_name: "active_plugins"}, { $set: {option_value:update_plugin_list} },function (err, result)
			{
				if (err) throw err;					 
				
				res.json( {status:'sucess', msg:'plugin deleted - found plugin',})

				//--->delete plugin list > start
				plugin_ids.forEach(function (ele) 
				{
					//delete the plugin folder
					var path = '/views/'+ele.plugin_folder
					delete_single_plugin(path)
				})
				//--->delete plugin list > end
				

			})
			//--->deactivate plugin table/collection > end
		}) 
	}) 
}) 
//--->delete data - end

var get_plugin_arr = function (arr_obj) 
{
	var a1 = []
	arr_obj.forEach(function (ele) 
	{
		var obj = ele.option_value
		obj.forEach(function(ele2)
		{
			a1.push(ele2)
		})
		
	})
	return a1
}
 
var delete_single_plugin = function(folder_path) 
{
	
	var dir = func.GetPathTo(folder_path)

    var list = fs.readdirSync(dir)

    if(_.size(list)>0)
    { 
    	var deleted_files = []
    	//--->delete all the files in the folder > start
    	list.forEach(function(file)
    	{
    		var dir_file = func.GetPathTo(folder_path + '/' + file)

    		deleted_files.push(file)

    		fs.unlinkSync(dir_file)
    		 
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