/*
	Menu -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//--->get data - start
app.get('/np-admin/menu', function(req, res, next) 
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
			.find({option_name: "active_menu"})
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
			.find()
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		Promise.all([np_posts,np_terms,np_options]).then(function(results) 
		{
			//Make sure all promises done!

			var np_posts = results[0]
			var np_terms = results[1]	
			var np_options = results[2]

			if(_.size(np_options) < 1 ) 
			{	
				res.json( {status:'error', msg:'no active menu data found', pages:np_posts,categories:np_terms }) 
				return false 
			}
			else if(_.size(np_options) > 0 ) 
			{
				res.json( {status:'success', msg:'found active menu data',  active_menu:np_options, pages:np_posts,categories:np_terms})
				return false
			}
		})

	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/menu', function(req, res, next) 
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
		
		var datasend 		= req.body.datasend
		var active_menu 	= req.body.active_menu

		if(_.size(active_menu)<1)
		{
			res.json( {status:'error', msg:'missing active menu data ', }) 
			return false
		}


		var new_active_menu =
		{
			option_id : +moment(),
			option_name : "active_menu",
			option_value :  active_menu,
			autoload : "yes",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}

		npdb.collection('np_options').find({option_name: "active_menu"}).toArray(function (err,  data)
		{
			if(_.size(data) < 1 ) 
			{		

				npdb.collection('np_options').insert(new_active_menu) 

				res.json( {status:'success', msg:'added new_active_menu'}) 
				return false 
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_options')
				.updateOne( {option_name: "active_menu"}, { $set: {option_value:active_menu} },function (err, result)
				{
					if (err) throw err
					
					res.json( {status:'success', msg:'updated active_menu data',  })
					return false
				}) 
			}

		})

	})

});
//--->update data - end
