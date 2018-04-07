/*
	Your Custom Route -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) to speed up things
//alasql('CREATE TABLE table_name');



//--->get data - start
app.get('/np-admin/', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ) 
 	
	//your parameters from ajax call
	var datasend 	= _.escape(req.query.datasend)
	var user_name 	= _.escape(req.query.user_name)
	
	if(_.size(user_name) < 1) 
	{
		res.json( {status:'error', msg:'missing user_name in api call'})
		return false
	}

	var site_url = func.DomainURL(req).cur_path 

	//log api call	
	func.log('GET-> '+ site_url ) 
 	
 	//do you get request stuff below 

});
//--->get data - end


//--->create new data - start
app.put('/np-admin/my-site-route', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ) 		

	//check for a valid api token
	func_db.admin_token_check(req).then(function(d1)
	{		 
		var Status = d1.status;
		if(Status=="error")
		{
			//invalid/missing api token
			res.json( {status:'error', msg:'missing/invalid api call token'}) 			
			return false  
		}		 

		//your parameters from ajax call
		var datasend 	= _.escape(req.body.datasend)
		var user_name 	= _.escape(req.body.user_name)

		if(_.size(user_name) < 1) 
		{
			res.json( {status:'error', msg:'missing user_name in api call'})
			return false
		}

		var site_url = func.DomainURL(req).cur_path 

		//log api call	
		func.log('PUT-> '+ site_url ) 

		//do you put request stuff below
 
	})

});
//--->create new data - end






//--->update data - start
app.post('/np-admin/', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//invalid/missing api token
			res.json( {status:'error', msg:'missing/invalid api call token'}) 			
			return false  
		}		 

		//your parameters from ajax call
		var datasend 	= _.escape(req.body.datasend)
		var user_name 	= _.escape(req.body.user_name)

		if(_.size(user_name) < 1) 
		{
			res.json( {status:'error', msg:'missing user_name in api call'})
			return false
		}

		var site_url = func.DomainURL(req).cur_path 

		//log api call	
		func.log('POST-> '+ site_url ) 

		//do you post request stuff below
 
	})

});
//--->update data - end



//--->delete data - start
app.delete('/np-admin/', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' ) 
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//invalid/missing api token
			res.json( {status:'error', msg:'missing/invalid api call token'}) 			
			return false  
		}		 

		//your parameters from ajax call
		var datasend 	= _.escape(req.body.datasend)
		var user_name 	= _.escape(req.body.user_name)

		if(_.size(user_name) < 1) 
		{
			res.json( {status:'error', msg:'missing user_name in api call'})
			return false
		}

		var site_url = func.DomainURL(req).cur_path 

		//log api call	
		func.log('DELETE-> '+ site_url ) 

		//do you delete request stuff below
	})

});
//--->delete data - end