/*
	Widgets -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/

//--->create new data - start
app.put('/np-admin/widgets', function(req, res, next) 
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
		func.log('PUT-> '+ site_url );

		var datasend 		= req.body.datasend;
	})

})
//--->create new data - end


//--->get data - start
app.get('/np-admin/widgets', function(req, res, next) 
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

		var np_options = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_options')
			.find({autoload: "yes"})
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
			.find({post_status : "publish", link_access_type:'public', post_type :'page' })
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
			.find({term_type:"category"}, {_id:false,name:true})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		Promise.all([np_options,np_terms]).then(function(results) 
		{
			//Make sure all promises done!
			 
			var np_options = results[0]
			var np_terms = results[1]

			var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])
			var active_sidebar_server = alasql('select * from ? where option_name="active_sidebar_server"',[np_options])


			var active_footer_client = alasql('select * from ? where option_name="active_footer_client"',[np_options])
			var active_footer_server = alasql('select * from ? where option_name="active_footer_server"',[np_options])

			res.json( 
			{
				status:'success', msg:'widgets data', 
				active_sidebar_client:active_sidebar_client,
				active_sidebar_server:active_sidebar_server,
				active_footer_client:active_footer_client,
				active_footer_server:active_footer_server,
				categories:np_terms  
			}) 
		})
	})
 

})
//--->get data - end



//--->update data - start
app.post('/np-admin/widgets/sidebar', function(req, res, next) 
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
		
		var datasend 				= req.body.datasend
		var active_sidebar_client 	= req.body.active_sidebar_client
		var active_sidebar_server 	= req.body.active_sidebar_server

	

		var new_active_sidebar_client =
		{
			option_id : +moment(),
			option_name : "active_sidebar_client",
			option_value :  active_sidebar_client,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		var new_active_sidebar_server =
		{
			option_id : +moment(),
			option_name : "active_sidebar_server",
			option_value :  active_sidebar_server,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		npdb.collection('np_options').find({option_name: "active_sidebar_server"}).toArray(function (err,  data)
		{
			if(_.size(data) < 1 ) 
			{		

				npdb.collection('np_options').insert(new_active_sidebar_client) 
				npdb.collection('np_options').insert(new_active_sidebar_server) 

				res.json( {status:'success', msg:'added new_active_sidebar'}) 
				return false 
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_options')
				.updateOne( {option_name: "active_sidebar_server"}, { $set: {option_value:active_sidebar_server} },function (err, result)
				{
					if (err) throw err
					
					res.json( {status:'success', msg:'updated active_menu data',  })

					npdb.collection('np_options')
					.updateOne( {option_name: "active_sidebar_client"}, { $set: {option_value:active_sidebar_client} })

					return false
				}) 
			}

		})

	})

})



app.post('/np-admin/widgets/footer', function(req, res, next) 
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
		
		var datasend 				= req.body.datasend
		var active_footer_client 	= req.body.active_footer_client
		var active_footer_server 	= req.body.active_footer_server

	

		var new_active_footer_client =
		{
			option_id : +moment(),
			option_name : "active_footer_client",
			option_value :  active_footer_client,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		var new_active_footer_server =
		{
			option_id : +moment(),
			option_name : "active_footer_server",
			option_value :  active_footer_server,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		npdb.collection('np_options').find({option_name: "active_footer_server"}).toArray(function (err,  data)
		{
			if(_.size(data) < 1 ) 
			{		

				npdb.collection('np_options').insert(new_active_footer_client) 
				npdb.collection('np_options').insert(new_active_footer_server) 

				res.json( {status:'success', msg:'added new_active_footer'}) 
				return false 
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_options')
				.updateOne( {option_name: "active_footer_server"}, { $set: {option_value:active_footer_server} },function (err, result)
				{
					if (err) throw err
					
					res.json( {status:'success', msg:'updated active_menu data',  })

					npdb.collection('np_options')
					.updateOne( {option_name: "active_footer_client"}, { $set: {option_value:active_footer_client} })

					return false
				}) 
			}

		})

	})

})

//--->update data - end



//--->delete data - start
app.delete('/np-admin/widgets', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ) 
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path

		var Status = d1.status
		if(Status=="error")
		{
			//error with admin token
			res.json(d1)			
			return false
		}

		//all good to go
		func.log('DELETE-> '+ site_url )

		var datasend 		= req.body.datasend;
	})

})
//--->delete data - end