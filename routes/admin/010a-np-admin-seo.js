/*
	SEO -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');

//--->get data - start
app.get('/np-admin/seo', function(req, res, next) 
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
		func.log('GET-> '+ site_url );

		npdb.collection('np_options').find().toArray(function (err,  d1)
		{
			//{option_name:'home_page_title', option_name:'home_page_description', }

			var data = alasql('select * from ? where option_name="home_page_title" or option_name="home_page_description" ',[d1])

			if(_.size(data) <1)
			{
				res.json( {status:'error',code:'no_data', msg:'no data found',  });
				return false;
			}			
			else if(_.size(data) > 0)
			{
				var home_page_title = alasql('select * from ? where option_name="home_page_title"',[d1])[0].option_value
				var home_page_description = alasql('select * from ? where option_name="home_page_description"',[d1])[0].option_value

				res.json( {status:'success',msg:'found data', seo_data:data, home_page_title:home_page_title, home_page_description:home_page_description  });
				return false;
			}
		})

	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/seo', function(req, res, next) 
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

		var datasend 		= req.body.datasend;
		var home_page_title 	= req.body.home_page_title;
		var home_page_description 	= req.body.home_page_description;

		if(_.size(home_page_title) < 1 || _.size(home_page_description) <1)
		{
			res.json( {status:'error',  msg:'missing home page info',  })
			return false
		}

		var np_options =
		[
			{
				option_id: +moment(),	
				option_name: 'home_page_title',	
				option_value: home_page_title,	
				autoload:'yes',
				rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
				rec_dttm_unix: +moment(),
			},
			{
				option_id: +moment(),	
				option_name: 'home_page_description',	
				option_value: home_page_description,	
				autoload:'yes',
				rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
				rec_dttm_unix: +moment(),
			}
		]

		npdb.collection('np_options').find({option_name:'home_page_title',option_name:'home_page_description' }).toArray(function (err,  data)
		{
			if(_.size(data) <1)
			{
				
				npdb.collection('np_options').insertMany(np_options);

				res.json( {status:'success', msg:'aded new seo data',  });
				return false;
			}			
			else if(_.size(data) > 0)
			{
				npdb.collection('np_options').updateOne( {option_name: "home_page_title"}, { $set: {option_value:home_page_title} })
				npdb.collection('np_options').updateOne( {option_name: "home_page_description"}, { $set: {option_value:home_page_description} })

				res.json( {status:'success',msg:'updated seo data'  });
				return false;
			}
		})

	})

});
//--->update data - end


 