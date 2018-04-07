/*
	Pretty URL -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE np_posts');

//--->create new data - start
app.put('/np-admin/pretty-url', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		
		var site_url = func.DomainURL(req).cur_path;


		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);	
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('PUT-> '+ site_url );

		//get variables
		var datasend 			= req.body.datasend;

		var url_id 				= +moment();
		var pretty_url_title 	= req.body.pretty_url_title;
		var pretty_url_note 	= req.body.pretty_url_note;
		var pretty_url_long 	= req.body.pretty_url_long;
		var pretty_url_short 	= req.body.pretty_url_short;

		//console.log(Categories)

		/*
			1) Check to see if post url already exist
			2) Insert data into table/collection
		*/

		

		var np_pretty_url= 
		{
			url_id: url_id, 
			url_title:pretty_url_title,
			url_note: pretty_url_note,  
			url_long: pretty_url_long,
			url_short: pretty_url_short,
			url_counter:0,
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment()
		}

		//--->url check - start
		npdb.collection('np_pretty_url').find({url_short:pretty_url_short}).toArray(function (err,  d1)
		{
			if(_.size(d1) > 0) 
			{
				res.json( {status:'error', msg:'pretty-url slug already exist'});
			}			
			else if(_.size(d1) < 1) 
			{
				//insert new data
				npdb.collection('np_pretty_url').insertOne(np_pretty_url,function(err, result) 
				{
					npdb.collection('np_pretty_url').find().toArray(function (err,  d2)
					{
						res.json( {status:'success', msg:'inserted new pretty url', pretty_url:d2});

					})
				});
			}
		}); 
		//--->url check - end 

	})

});
//--->create new data - end




//--->get data - start
app.get('/np-admin/pretty-url', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

 
	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		var site_url = func.DomainURL(req).cur_path;

		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);	
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('GET-> '+ site_url );

		npdb.collection('np_pretty_url').find({}).toArray(function (err,  d1)
		{ 
			if(_.size(d1) < 1) 
			{
				res.json( {status:'no_data', msg:'not pretty-url found'});
			}			
			else if(_.size(d1) > 0) 
			{
				res.json( {status:'success', msg:'found pretty url', pretty_url:d1});
			}

		})
 
	}) 

});
 

app.get('/np-admin/pretty-url/stats', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

 
	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		var site_url = func.DomainURL(req).cur_path;

		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);	
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('GET-> '+ site_url );

		var url_id 	= parseInt(_.escape(req.query.url_id) )

		var np_pretty_url = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_pretty_url').find({url_id:url_id},{_id: 0}).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})

		var np_pretty_url_tracker = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_pretty_url_tracker').find({url_id:url_id},{_id: 0}).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data);
				}			
			})
		})
		
		Promise.all([np_pretty_url,np_pretty_url_tracker]).then(function(results) 
		{
			//Make sure all promises done!

			var np_pretty_url 	= results[0]
			var np_pretty_url_tracker 	= results[1]
			if(_.size(np_pretty_url_tracker) < 1) 
			{
				res.json( {status:'no_data', msg:'no pretty-url stats found'});
			}			
			else if(_.size(np_pretty_url_tracker) > 0) 
			{
				res.json( {status:'success', msg:'found pretty url', pretty_url:np_pretty_url, pretty_url_stats:np_pretty_url_tracker});
			}

			 
		})
 
	}) 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/pretty-url/update', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	//console log
	func.log('POST-> posts/edit' ) 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		var site_url = func.DomainURL(req).cur_path;

		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

	 
		//all good to go
		func.log('POST-> '+ site_url );

		var url_id 				= parseInt(req.body.url_id);
 

		var pretty_url_title 	= req.body.pretty_url_title;
		var pretty_url_note 	= req.body.pretty_url_note;
		var pretty_url_long 	= req.body.pretty_url_long;
		var pretty_url_short 	= req.body.pretty_url_short;

	  	var np_pretty_url = 
		{
			url_title:pretty_url_title,
			url_desc: pretty_url_note,  
			url_long: pretty_url_long,
			url_short: pretty_url_short,
		}
		
		npdb.collection('np_pretty_url').find({url_id: url_id} ).toArray(function (err,  data)
		{
			if(_.size(data)  < 1 ) 
			{
				//found url with another post_id
				res.json( {status:'error', msg:'no data found'});
				return false;
			}

			else if(_.size(data) > 0) 
			{
				//update old row data
				npdb.collection('np_pretty_url').updateOne( { url_id: url_id }, { $set: np_pretty_url },function (err, result)
				{
					if (err) throw err;
					
					npdb.collection('np_pretty_url').find({}).toArray(function (err,  d2)
					{
						res.json( {status:'success', msg:'updated pretty url', pretty_url:d2});

					})
					return false; 		
					
					 
				})
			}			

		})


	})

});
//--->update data - end
 
//--->reset post views to zero  > start

app.post('/np-admin/pretty-url/views/reset', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

 
	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//console log
		func.log('POST -> post/single' ) 

		//all good to go
		var datasend 		= req.body.datasend; 
		var url_id 		= parseInt(req.body.url_id); 

		npdb.collection('np_pretty_url').find({url_id: url_id}).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{
				//delete row data
				npdb.collection('np_pretty_url').updateOne( { url_id: url_id  }, { $set: {url_counter:0} }); 

				//npdb.collection('np_pretty_url').updateOne( { url_id: url_id  }, { $set: {url_counter:0} }); 
				npdb.collection('np_pretty_url_tracker').deleteMany( { url_id: url_id  });
				
				res.json( {status:'success', msg:'reseted  views'});
				return false; 		
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'});
			}
		})
	})

});
//--->reset post views to zero  > end

//--->delete single - start

app.delete('/np-admin/pretty-url', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

 
	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		var site_url = func.DomainURL(req).cur_path;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//console log	 
		func.log('DELETE-> '+ site_url );

		//all good to go
		var datasend 		= req.body.datasend; 
		var url_id 		= parseInt(req.body.url_id); 

		npdb.collection('np_pretty_url').find({url_id: url_id}).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{
				//delete row data
				npdb.collection('np_pretty_url').deleteMany( { url_id: url_id  },function (err, result)
				{
					if (err) throw err;

					//get all categories
	  				npdb.collection('np_pretty_url').find({}).toArray(function (err,  d2)
					{
						res.json( {status:'success', msg:'data pretty url', pretty_url:d2});

					})
					 
				})
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid url  id'});
			}
		})
	})

});
//--->delete single - end

//--->delete multiple - start
app.delete('/np-admin/pretty-url/multiple', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			res.json(d1);			
			return false; 
		}

		//console log
		func.log('DELETE-> post/multiple' ) 

		//all good to go
		var datasend 		= req.body.datasend; 
		var delete_url_ids = req.body.delete_url_ids; 
 

		if(_.size(delete_url_ids) < 1 )
		{
			res.json( {status:'error', msg:'invalid post  id'});
			return false; 
		}

		//--->convert into integer - start
		var url_ids = []
		delete_url_ids.forEach(function(element, index)
		{
			url_ids.push(parseInt(element) )
		})		
		//--->convert into integer - end

	 

		//find all the values in an array
		var qry = { url_id: { $in: url_ids } }

		npdb.collection('np_pretty_url').find(qry).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{ 
				if (err) throw err;
 

				res.json( {status:'success', msg:'deleted urls ids' });

				//delete from np_posts
				npdb.collection('np_pretty_url').deleteMany( qry);
				
				return false; 		
				
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'});
			}
		})
	})

});
//--->delete multiple - end