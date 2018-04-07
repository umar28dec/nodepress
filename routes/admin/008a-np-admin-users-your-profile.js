/*
	Users -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//--->get data - start
app.get('/np-admin/users', function(req, res, next) 
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

		npdb.collection('np_users').find({},{_id: 0}).toArray(function (err,  data)
		{			
			if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'no users found'});
				return false;
			}			
			res.json( {status:'success', msg:'found post data', np_users: data});

		});
	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/users/update/your-profile', function(req, res, next) 
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
		func.log('POST-> '+ site_url )

		var datasend 		= req.body.datasend
		var user_id			= req.body.user_id
		var user_login 		= req.body.user_login
		var user_email 		= req.body.user_email
		var user_url 		= req.body.user_url
		var display_name 	= req.body.display_name

		if(_.size(user_id) <1)
		{
			res.json( {status:'error', field_missing:'user_id', msg:'missing user id',  })
			return false
		}

		if(_.size(user_login) <1)
		{
			res.json( {status:'error', field_missing:'user_login', msg:'missing user login',  })
			return false
		}

		if(_.size(user_email) <1)
		{
			res.json( {status:'error', field_missing:'user_email', msg:'missing user email',  })
			return false
		}

		if(_.size(user_url) <1)
		{
			res.json( {status:'error', field_missing:'user_url', msg:'missing user url',  })
			return false
		}
		
		if(_.size(display_name) <1)
		{
			res.json( {status:'error', field_missing:'display_name', msg:'missing display name',  })
			return false
		}

		var update_user_info = {			
			user_login:user_login,
			user_email:user_email,
			user_url:user_url,
			display_name:display_name
		}

		npdb.collection('np_users').find({user_id: parseInt(user_id)}).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{	
				res.json( {status:'error', msg:'no user found',  })
				return false
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_users').updateOne( {user_id: parseInt(user_id)}, { $set: update_user_info})

				res.json( {status:'success',msg:'updated your profile data'  })
				return false
			}
		})

		

	})

})




//update password
app.post('/np-admin/users/update/password', function(req, res, next) 
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
		func.log('POST-> '+ site_url )

		var datasend 		= req.body.datasend
		var user_id			= req.body.user_id
		var user_pass		= req.body.current_password
		var new_password	= req.body.new_password

		if(_.size(user_pass) <1)
		{
			res.json( {status:'error', field_missing:'user_pass', msg:'missing user pass',  })
			return false
		} 

		var update_user_info = {			
			user_pass: func.HashPassword(new_password) 
		}
		
		npdb.collection('np_users').find({user_id: parseInt(user_id), user_pass:func.HashPassword(user_pass) })
		.toArray(function (err,  data)
		{
			console.log(data, user_pass, new_password)

			if(_.size(data) <1)
			{	
				res.json( {status:'error', msg:'invaild password',  })
				return false
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_users').updateOne( {user_id: parseInt(user_id)}, { $set: update_user_info})

				res.json( {status:'success',msg:'updated your password data'  })
				return false
			}
		})

		

	})

});


//--->update data - end


