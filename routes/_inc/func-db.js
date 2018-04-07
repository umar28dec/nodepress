
//--->Database connection file check - Start
exports.db_config_file_check = function( )  
{
	/*
		Check to see if mongodb database connection file exist
	*/
	if (!fs.existsSync(path.join(process.cwd()+'/db_conn/np-config.json')) ) 
	{
		//file doesn't exist
		return false;
	}
	//file does exist
	return true;
}
//--->Database connection file check - End




//--->Token Set - Start
exports.token_set = function(req,token_name, token_value)  
{
	var dttm = +moment(); 

	var user_ip = ip.get(req);

	//console.log(user_ip)
	//var token = func.HashPassword(dttm + LoginID); 

	var token_expire_value_unix = +moment().add(24, 'h'); //<---will expire in 24 hrs after login

	var np_token =  
	{
		rec_id: dttm,
		user_ip: user_ip, 
		token_name: token_name,
		token_value: token_value,
		token_expire_value: token_expire_value_unix,
		token_expire_dttm:  moment(token_expire_value_unix).format("YYYY-MM-DD h:mm:ss a"),
		rec_dttm: moment(dttm).format("YYYY-MM-DD h:mm:ss a"),
		rec_dttm_unix: dttm,
	} 

	npdb.collection('np_token').insert(np_token);

	//insert into table
	var data = [np_token];
	alasql('SELECT * INTO np_token FROM ?',[data]);
	
	//remove old tokens to clean up collection/table and keep the data at minimum
	npdb.collection('np_token').remove({ token_expire_value: { $lt: +moment() } } );
}

//--->Token Set - End



//--->Token Check - Start


exports.admin_token_check = function(req)  
{	
	var token_value = req.headers['token_value']  ;

	var user_ip = ip.get(req);

	/**/
	if(!token_value)
	{	
		data = { status:"error", msg:'missing ajax token... please re-login'};
		return Promise.resolve(data);
	}
	

	var data;
	//now - unix timestamp
	var now = +moment();

	//for cache lookup to speedup things
	var get_admin_token = alasql('SELECT * FROM np_token where token_value=?',[token_value]);

	if(_.size(get_admin_token) >0 )
	{
		//remove old tokens(less than now(unix timestamp) ) to clean up collection/table and keep the data at minimum
		
		//delete it from mongodb
		npdb.collection('np_token').remove({ token_expire_value: { $lt: now} } );

		//delete it from cache
		alasql('DELETE FROM np_token where token_expire_value<?',[now]);

		data = {status:'success',msg:'found rows',};

		return Promise.resolve(data)
	}

	//Lookup in the mongodb now b/c couldn't find it in the cache 
	return new Promise(function(resolve, reject) 
	{	
		// 
		//var qry = { $or: [ { token_value: admin_token }, { user_ip: user_ip} ] };
		
		//npdb.collection('np_token').find( qry).toArray(function (err, token_data)

		npdb.collection('np_token').find( { token_value:  token_value }).toArray(function (err, token_data)
		
		{
			if( _.size(token_data) <1) 
			{	
				data = { status:"error", code:'expire_token',msg:'your session has expired...please re-login'}
			}	
			else
			{
				data = {status:'success',msg:'found rows',};
			}

			//remove old tokens to clean up collection/table and keep the data at minimum
			npdb.collection('np_token').remove({ token_expire_value: { $lt: +moment() } } );

			//delete it from cache
			alasql('DELETE FROM np_token where token_expire_value<?',[now]);
			AddCacheTokens () 

			resolve(data)
		});
	});
}

function AddCacheTokens () 
{
	/*
		In case if the server restarts this will add the tokens back into cache
		So, that it can go back into the token check process and speed things up. 

		During the testing phase, calls via the cache only took on average 0.021ms compare to 
		mongodb call which took on average 11.580ms
	*/

	//Just to be safe
	alasql('DELETE FROM np_token');

	npdb.collection('np_token').find( { token_expire_value: { $gt: +moment() } } ).toArray(function (err, token_rows)
	{
		//console.log(token_rows);

		alasql('SELECT * INTO np_token FROM ?',[token_rows]);
	});

}

//--->Token Check - End