/*
	Dashboard -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');
 


//--->get data - start
app.get('/np-admin/dashboard/home', function(req, res, next) 
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

	 
		var datasend 	= req.query.datasend
 
		var np_posts = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_posts')
			.find( )
			.sort( { rec_dttm_unix: -1 } ).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		Promise.all([np_posts]).then(function(results) 
		{
			//Make sure all promises done!

			func.log('GET-> '+ site_url ) 

			var np_posts = results[0]  

			if(_.size(np_posts) < 1)
			{
				res.json({ status:"error", msg:'no data' }) 
				return false
			}

			var d = alasql('select post_type, post_views from ? ',[np_posts])
			
		 	res.json(
			{ 
				status:"success", msg:'found data', 				
				np_posts: d,
				 
			}) 
		 

		})


	})
 

});
//--->get data - end

 