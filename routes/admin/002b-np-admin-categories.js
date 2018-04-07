/*
	Post -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE np_posts');

//--->create new data - start
app.put('/np-admin/categories', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	//console log
	func.log('PUT-> categories' ) 

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
		var datasend 		= req.body.datasend;	
		var term_id 		= req.body.term_id;
		var category_name 	= req.body.category_name;
		var category_slug 	= req.body.category_slug;

		var np_terms_new = 
		{
			term_id: parseInt(term_id),
			name: category_name,
			slug:category_slug,
			term_type:'category', //<---category/post_tag
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment()
		}

		if(datasend !='new')
		{
			res.json( {status:'error', msg:'invalid category insert call'});
			return false; 
		}

		//--->check to see if category already exist or not
		npdb.collection('np_terms').find({slug:category_slug}).toArray(function (err,  data)
		{
			if(_.size(data) > 0) 
			{
				//category already exist
				res.json( {status:'error', msg:'category slug already exist'});
				return false; 
			}			
			else if(_.size(data) < 1) 
			{
				//insert new data
				npdb.collection('np_terms').insert(np_terms_new,function (err, result) 
				{
					if (err) throw err;
      				 
      				//get all categories
      				npdb.collection('np_terms').find().toArray(function (err,  data)
					{
						res.json( {status:'success', msg:'inserted new', cat_data: data});
						return false; 		
					})


				});
				
			}
		}); 
		 

	})

});
//--->create new data - end


//--->get data - start
app.get('/np-admin/categories', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	 
	var site_url = func.DomainURL(req).cur_path;

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);

			res.json(d1);			
			return false; 
		}



		//all good to go
		func.log('GET-> '+ site_url );

		npdb.collection('np_terms').find({term_type:'category'}).toArray(function (err,  data)
		{
			if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'not categories found'});
			}			
			else if(_.size(data) >0) 
			{
				//insert new post data
				 
				res.json( {status:'success', msg:'found posts', category_data:data});
			}
		});
	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/categories', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	 
	var site_url = func.DomainURL(req).cur_path;


	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('GET-> '+ site_url );

		var datasend 		= req.body.datasend; 
		var term_id 		= req.body.cat_id;
		var category_name 	= req.body.category_name;
		var category_slug 	= req.body.category_slug;

		var np_terms_update = 
		{
			name: category_name,
			slug:category_slug,
		}

		if(datasend !='update')
		{
			res.json( {status:'error', msg:'invalid category insert call'});
			return false; 
		}


		npdb.collection('np_terms').find({term_id: parseInt(term_id)}).toArray(function (err,  data)
		{
			if(_.size(data) > 0) 
			{
				//update old row data
				npdb.collection('np_terms').updateOne( { term_id: parseInt(term_id) }, { $set: np_terms_update },function (err, result)
				{
					if (err) throw err;

					//get all categories
	  				npdb.collection('np_terms').find().toArray(function (err,  data)
					{
						res.json( {status:'success', msg:'updated row', cat_data: data});
						return false; 		
					})
					 
				})
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid category slug/id'});
			}
		})

	})

});
//--->update data - end



//--->delete data - start
app.delete('/np-admin/categories', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	var site_url = func.DomainURL(req).cur_path;

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var Status = d1.status;
		if(Status=="error")
		{
			//error with admin token
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);

			res.json(d1);			
			return false; 
		}

		//all good to go
		func.log('GET-> '+ site_url );
		
		var datasend 		= req.body.datasend; 
		var term_id 		= req.body.term_id;


		npdb.collection('np_terms').find({term_id: parseInt(term_id)}).toArray(function (err,  data)
		{
			if(_.size(data) > 0) 
			{
				//delete row data
				npdb.collection('np_terms').deleteMany( { term_id: parseInt(term_id)  },function (err, result)
				{
					if (err) throw err;

					//get all categories
	  				npdb.collection('np_terms').find().toArray(function (err,  data)
					{
						res.json( {status:'success', msg:'deleted row', cat_data: data});

						//delete from np_terms_relationships
						//npdb.collection('np_terms_relationships').deleteMany( { term_id: parseInt(term_id)  })
						return false; 		
					})
					 
				})
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid category slug/id'});
			}
		})

	})

});
//--->delete data - end