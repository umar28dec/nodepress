/*
	Post -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->create new data - start
app.put('/np-admin/', function(req, res, next) 
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

});
//--->create new data - end


//--->get data - start
app.get('/np-admin/', function(req, res, next) 
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
	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/', function(req, res, next) 
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

});
//--->delete data - end