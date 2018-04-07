/*
	Settings > Reading -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->get data - start
app.get('/np-admin/settings/reading', function(req, res, next) 
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

		Promise.all([np_posts,np_options]).then(function(results) 
		{
			//Make sure all promises done!

			var np_posts = results[0]
			var np_options = results[1]	

			//post_url post_title
			var get_pages = alasql('select post_url,post_title, post_id from ?  order by  post_url ASC',[np_posts]) 
			var page_on_front = alasql('select * from ? where option_name="page_on_front"',[np_options])
			var page_for_posts = alasql('select * from ? where option_name="page_for_posts"',[np_options])
			var posts_per_page = alasql('select * from ? where option_name="posts_per_page"',[np_options])

			res.json( 
			{
				status:'success',
				msg:'found data', 
				pages:get_pages, 
				page_on_front:page_on_front, 
				page_for_posts:page_for_posts, 
				posts_per_page:posts_per_page
			})

				return false 

		})
 

	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/settings/reading/latest-posts', function(req, res, next) 
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
		var posts_per_page 		= req.body.posts_per_page


		if(_.size(posts_per_page) < 1  )
		{
			res.json( {status:'error', field_missing:"posts_per_page",  msg:'missing posts_per_page info',  })
			return false
		}

		var np_options =
		[{
			option_id: +moment(),	
			option_name: 'posts_per_page',	
			option_value: posts_per_page,	
			autoload:'yes',
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment(),
		}]
	 
 		npdb.collection('np_options').find({option_name:'posts_per_page'  }).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{				
				npdb.collection('np_options').insertMany(np_options);

				res.json( {status:'success', msg:'aded new post limit data',  })
				

				npdb.collection('np_options').deleteMany( { option_name: "page_on_front" })
				npdb.collection('np_options').deleteMany( { option_name: "page_for_posts" })

				return false;
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_options').updateOne( {option_name: "posts_per_page"}, { $set: {option_value:posts_per_page} }) 
				

				npdb.collection('np_options').deleteMany( { option_name: "page_on_front" })
				npdb.collection('np_options').deleteMany( { option_name: "page_for_posts" })

				res.json( {status:'success',msg:'updated posts_per_page data'  }) 

				return false;
			}
		}) 

	})

});



app.post('/np-admin/settings/reading/custom-page', function(req, res, next) 
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
		var posts_per_page 	= req.body.posts_per_page
		var page_on_front 	= req.body.page_on_front		
		var page_for_posts 	= req.body.page_for_posts

		if(_.size(page_on_front) < 1  )
		{
			res.json( {status:'error', field_missing:"page_on_front",  msg:'missing page_on_front info',  })
			return false
		}
		
		if(_.size(page_for_posts) < 1  )
		{
			res.json( {status:'error', field_missing:"page_for_posts",  msg:'missing page_for_posts info',  })
			return false
		}

		var np_options =
		[
			{
				option_id: +moment(),	
				option_name: 'page_on_front',	
				option_value: page_on_front,	
				autoload:'yes',
				rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
				rec_dttm_unix: +moment(),
			},
			{
				option_id: +moment(),	
				option_name: 'page_for_posts',	
				option_value: page_for_posts,	
				autoload:'yes',
				rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
				rec_dttm_unix: +moment(),
			}
		]
	 
 		npdb.collection('np_options').find({autoload:'yes'  }).toArray(function (err,  data)
		{
			var data = alasql('select * from ? where option_name="page_for_posts" or option_name="page_on_front" ',[data])

			if(_.size(data) <1)
			{				
				npdb.collection('np_options').insertMany(np_options);

				res.json( {status:'success', msg:'aded new seo data',  });
				return false;
			}			
			else if(_.size(data) > 0)
			{

				npdb.collection('np_options').updateOne( {option_name: "posts_per_page"}, { $set: {option_value:posts_per_page} }) 

				npdb.collection('np_options').updateOne( {option_name: "page_for_posts"}, { $set: {option_value:page_for_posts} }) 
				npdb.collection('np_options').updateOne( {option_name: "page_on_front"}, { $set: {option_value:page_on_front} }) 

				res.json( {status:'success',msg:'updated custom home page options '  });
				return false;
			}
		})


	 


	})

});
//--->update data - end


 