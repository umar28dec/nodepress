/*
	Settings > Discussion -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->get data - start
app.get('/np-admin/settings/discussion', function(req, res, next) 
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

		
			var post_comments_allow = alasql('select * from ? where option_name="post_comments_allow"',[np_options])
		

			res.json( 
			{
				status:'success',
				msg:'found data',  
				post_comments_allow:post_comments_allow,  
			})

				return false 

		})
 

	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/settings/discussion', function(req, res, next) 
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

		var datasend 			= req.body.datasend
		var post_comments_allow = req.body.post_comments_allow


		if(_.size(post_comments_allow) < 1  )
		{
			res.json( {status:'error', field_missing:"post_comments_allow",  msg:'missing post_comments_allow info',  })
			return false
		}

		var np_options =
		[{
			option_id: +moment(),	
			option_name: 'post_comments_allow',	
			option_value: post_comments_allow,
			autoload:'yes',
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment(),
		}]
	 
 		npdb.collection('np_options').find({option_name:'post_comments_allow'  }).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{				
				npdb.collection('np_options').insertMany(np_options);

				res.json( {status:'success', msg:'aded new post comment allow data',  })				

				return false;
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_options').updateOne( {option_name: "post_comments_allow"}, { $set: {option_value:post_comments_allow} }) 
				


				res.json( {status:'success',msg:'updated post_comments_allow data'  }) 

				return false;
			}
		}) 

	})

});
 
//--->update data - end


 