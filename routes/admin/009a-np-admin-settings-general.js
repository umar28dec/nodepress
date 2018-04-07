/*
	Settings > General -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->get data - start
app.get('/np-admin/settings/general', function(req, res, next) 
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
		func.log('GET-> '+ site_url );

		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{
				res.json( {status:'error',code:'no_data', msg:'no data found',  });
				return false;
			}			
			else if(_.size(data) > 0)
			{	
				var blog_name = alasql('select * from ? where option_name="blogname"',[data])[0].option_value
				var site_url = alasql('select * from ? where option_name="siteurl"',[data])[0].option_value
				var admin_email = alasql('select * from ? where option_name="admin_email"',[data])[0].option_value

				res.json( 
				{
					status:'success',
					msg:'found data', 
					blog_name:blog_name, 
					site_url:site_url, 
					admin_email:admin_email  
				})

				return false;
			}
		})

	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/settings/general', function(req, res, next) 
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

		var datasend 		= req.body.datasend
		var blogname 		= req.body.blog_name
		var siteurl 		= req.body.site_url
		var admin_email 	= req.body.admin_email


		if(_.size(blogname) < 1  )
		{
			res.json( {status:'error', field_missing:"blog_name",  msg:'missing site title info',  })
			return false
		}

		if(_.size(siteurl) < 1  )
		{
			res.json( {status:'error', field_missing:"site_url",  msg:'missing site url info',  })
			return false
		}

		if(_.size(admin_email) < 1  )
		{
			res.json( {status:'error', field_missing:"admin_email",  msg:'missing admin email info',  })
			return false
		}

		
		npdb.collection('np_options').updateOne( {option_name: "blogname"}, { $set: {option_value:blogname} })
		npdb.collection('np_options').updateOne( {option_name: "siteurl"}, { $set: {option_value:siteurl} })
		npdb.collection('np_options').updateOne( {option_name: "admin_email"}, { $set: {option_value:admin_email} })

		res.json( {status:'success',msg:'updated setting > general data'  });


	})

});
//--->update data - end


 