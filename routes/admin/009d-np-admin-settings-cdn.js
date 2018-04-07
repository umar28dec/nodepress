/*
	Settings > CDN -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->get data - start
app.get('/np-admin/settings/cdn', function(req, res, next) 
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
		func.log('GET-> '+ site_url ) 

		var np_options = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
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
			.find({post_status : "publish", post_type:'page',link_access_type:'public', post_dttm_unix :{$lte:+moment()} })
			.sort( { rec_dttm_unix: -1 } ).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		Promise.all([np_options]).then(function(results) 
		{
			//Make sure all promises done!
			
			var np_options = results[0]	

		
			var cdn_libs = alasql('select * from ? where option_name="cdn_libs"',[np_options])
		
			if(_.size(cdn_libs) < 1)
			{
				res.json( 
				{
					status:'success',
					msg:'no data found',  
					cdn_libs:cdn_libs,  
				})

			}
			else 
			{
				res.json( 
				{
					status:'success',
					msg:'found data',  
					cdn_libs:cdn_libs,  
				})
			}
		})
	})

});
//--->get data - end



//--->update data - start
app.post('/np-admin/settings/cdn', function(req, res, next) 
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

		var datasend 	= req.body.datasend
		var cdn_libs 	= req.body.cdn_libs


		if(_.size(cdn_libs) < 1  )
		{
			res.json( {status:'error', field_missing:"cdn_libs",  msg:'missing cdn_libs info',  })
			return false
		}

		var np_options =
		[{
			option_id: +moment(),	
			option_name: 'cdn_libs',	
			option_value: cdn_libs,
			autoload:'yes',
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment(),
		}]
	 
 		npdb.collection('np_options').find({option_name:'cdn_libs'  }).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{				
				npdb.collection('np_options').insertMany(np_options);

				res.json( {status:'success', msg:'aded new post comment allow data',  })				

				return false;
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_options').updateOne( {option_name: "cdn_libs"}, { $set: {option_value:cdn_libs} }) 
				


				res.json( {status:'success',msg:'updated cdn_libs data'  }) 

				return false;
			}
		}) 

	})

});
 
//--->update data - end


 