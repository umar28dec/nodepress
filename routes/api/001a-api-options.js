/*
	Options -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/

//--->get data - start
app.get('/api/options', function(req, res, next) 
{ 

	var site_url = func.DomainURL(req).cur_path
 	func.log('GET-> '+ site_url )
 
	var option_name 	= _.escape(req.query.option_name) 

	if(_.size(option_name) < 1) 
	{
		res.json( {status:'error', msg:'missing option name  in api call'})
		return false
	}

	npdb.collection('np_options').find({option_name: option_name, autoload:'no'},  {'option_value': true, '_id':false}).toArray(function (err,  data)
	{
		if(_.size(data) < 1) 
		{
			res.json( {status:'error', msg:'invalid option name'})
			return false
		}			
		res.json( {status:'success', msg:'found option data', option_value: data[0].option_value})

	})

})
//--->get data - end


//--->add/update data - start
app.post('/api/options', function(req, res, next) 
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

		var option_name 	= req.body.option_name
		var option_value 	= req.body.option_value
		
		if(_.size(option_name)<1)
		{
			res.json( {status:'error', msg:'missing option name  in api call'})
			return false
		}

		var new_plugin_activate =
		{
			option_id : +moment(),
			option_name : option_name,
			option_value :  option_value,
			autoload : "no",
			rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix : +moment()
		}


		npdb.collection('np_options').find({option_name: option_name}).toArray(function (err,  data)
		{
			if(_.size(data) < 1) 
			{
				//add new option data
				npdb.collection('np_options').insert(new_plugin_activate)

				res.json( {status:'success', msg:'added new option data'})
				return false
			}
			else if(_.size(data) >0) 
			{
				//update option data
				npdb.collection('np_options')
				.updateOne( {option_name: option_name}, { $set: {option_value:option_value} },function (err, result)
				{
					if (err) throw err;					 
					
					res.json( {status:'success', msg:'updated option value',  })
					return false
				})		
			}
		})
	})

});
//--->add/update data - end
