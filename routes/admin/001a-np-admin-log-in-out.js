//ALASQL tables
alasql('CREATE TABLE np_token');

app.get('/np-admin', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	 
 
	func_db.admin_token_check(req).then(function(d1)
	{
		/*
			in case user refresh's the "np-admin" url without the '/dashboard' part
			meaning....go to this: "np-admin"... instead of "np-admin/dashboard"
			this is for that 1% curious ones
		*/
		var Status = d1.status;
		
		//console.log(Status)
		var site_url = func.DomainURL(req).cur_path;
		var site_root_url = func.DomainURL(req).url + '/';

		

		if(Status=="error")
		{
			//there is no token so load the login screen
			func.log('GET-> '+ site_url); 
 	
			var dir = path.join(process.cwd(), '/views/np-admin/login');
		 
			res.render(dir, 
			{     
				site_root_url:site_root_url,
				admin_url_dir: site_url,
				page_title: 'Login - ' +func.DomainURL(req).url
			}); 
			return false; 
		}

		if(Status=="success")
		{
			//already logged in and has valid token
			//redirect to dashboard
			res.redirect('dashboard');
		}
	})
});


app.post('/np-admin/login', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	
	var LoginID 	= req.body.LoginID;
	var UserPasword = req.body.UserPasword;	 
	var site_url	= func.DomainURL(req).url;

	if(LoginID)
	{
		npdb.collection('np_users').find({user_login: LoginID,user_pass: func.HashPassword(UserPasword) }).toArray(function(err, data) 
		{			 

			if(_.size(data) < 1)
			{
				func.log('Failed-> '+site_url+' (error msg)-> invalid login info')	

				res.json({ status:"error", msg:'invalid login info' });	
				return false;		
			}
			else if(_.size(data) >0)
			{
				func.log('GET-> '+ site_url )
				
				var dttm = +moment();

				var token_value = func.HashPassword(dttm + LoginID); 

			 	res.set('admin_token', token_value);
				
				res.json({ status:"success", token:token_value, url:'dashboard'});

				//set token
				func_db.token_set(req,'admin_token', token_value); 
				
			}
		})
		return false; 
	}
});


app.get('/np-admin/dashboard', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ); 
	
	var site_url = func.DomainURL(req).cur_path;
	
	var site_root_url = func.DomainURL(req).url + '/';

 	var url = func.DomainURL(req).url +"/np-admin/";	

	var dir = path.join(process.cwd(), '/views/np-admin/dashboard');

	res.render(dir, 
	{	
		site_root_url:site_root_url,
		admin_url_dir: url,
		page_title: 'Dashboard'
	}); 
 
   	func.log('GET-> '+ site_url )

})


app.get('/np-admin/dashboard-page-data', function(req, res, next) 
{	
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	

	var LoginID = req.query.LoginID;

	//get options table/collection data
	var np_options = new Promise(function(resolve, reject) 
	{
		var show_fields = 
		{			
			_id:false, // hide this
			option_name:true, //show this
			option_value:true
		}

		npdb.collection('np_options').find({autoload:'yes'},show_fields).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		});
	});

	//get pending comments table/collection data
	var np_comments = new Promise(function(resolve, reject) 
	{
		var show_fields = 
		{			
			_id:false, // hide this
			comment_author_email:true, //show this			
			comment_content:true,
			comment_status:true,
		}

		npdb.collection('np_comments').find({comment_status:'pending'},show_fields).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		});
	});

	//get users table/collection data
	var np_users = new Promise(function(resolve, reject) 
	{
		var show_fields = 
		{			
			_id:false, // hide this
			display_name:true, //show this
			user_email:true,
			user_id:true,
			user_login:true,
			user_url:true,
		}
		npdb.collection('np_users').find({user_login:LoginID},show_fields).toArray(function (err, data)
		{
			if(data) 
			{
				resolve(data);
			}			
		});
	});
	
	//get terms table/collection data
	var np_terms = new Promise(function(resolve, reject) 
	{
		var show_fields = 
		{			
			_id:false, // hide this
			term_id:true, //show this
			name:true,
			slug:true,
			term_type:true, 
		}

		npdb.collection('np_terms').find({}, show_fields).toArray(function (err, data)
		{
			if(data) 
			{
				resolve(data);
			}			
		});
	});

	

	func_db.admin_token_check(req).then(function(d1)
	{	
		var page_url = req.url;
		var site_url = func.DomainURL(req).cur_path;
	

		var Status = d1.status;
		if(Status=="error")
		{ 			
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);			
			res.json(d1);
			
			return false; 
		}

		Promise.all([np_options, np_users,np_terms,np_comments ]).then(function(results) 
		{
			//Make sure all promises done!

			func.log('GET-> '+ site_url ) 

			var np_options 		= results[0] 
			var np_users 		= results[1] 
			var np_terms 		= results[2]
			var np_comments 	=  results[3]
		 

			var get_theme = alasql('select * from ? where option_name="active_theme"', [np_options])

			if(_.size(get_theme) >0)
			{
				var dir_file = func.GetPathTo('/views/np-content/themes/'+get_theme[0].option_value)

				var obj = fs.readFileSync(dir_file+'/package.json', 'utf8' )
				var theme_package = JSON.parse(obj) 
			}

			res.json(
			{ 
				status:"success", msg:'page data', 				
				np_options: np_options,
				np_users:np_users,
				np_terms:np_terms,				
				np_comments:np_comments,
				theme_package:theme_package ? theme_package : ''
			});
 
		});
	

	})
	return false; 
/* 
	
	Promise.all([check_token, option_data]).then(function(results) 
	{
		// Both promises done!
		console.time('alasql'); 
		var get =  alasql('SELECT option_name FROM ? where option_name="siteurl"',[results[1]])[0].option_name;
		console.timeEnd('alasql'); 
		res.json({ status:"success", msg:'dee', check_token:results[0], option_data:results[1], get:get,});
		console.timeEnd('dashboard-page-data');
	});
	
	 
	return false; 
*/
 
})

app.delete('/np-admin/log-out', function(req, res, next) 
{	
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
	
	var site_url = func.DomainURL(req).cur_path

	var token_value = req.headers['token_value'];
	if(token_value)
	{		
		npdb.collection('np_token').find( { token_value:  token_value }).toArray(function (err, token_data)
		{			
			if( _.size(token_data) <1)
			{

				func.log('Failed-> '+site_url+' (error msg)-> invaild token' );	

				res.json({ status:"error", msg:'invaild token', });
			}
			else if( _.size(token_data) >0) 
			{	
				
				func.log('DELETE-> '+ site_url);

				res.json({ status:"success", msg:'you have been logged off', });

				//delete it from mongodb
				npdb.collection('np_token').remove({ token_value: token_value } );

				//delete it from cache
				alasql('DELETE FROM np_token where token_value=?',[token_value]);
			}

		});
	}

})