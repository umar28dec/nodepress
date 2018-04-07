/*
	Token -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//--->get data - start
app.get('/api/token', function(req, res, next) 
{ 

	var user_ip 	= ip.get(req)
	var token_id 	= req.query.token_id


	if(_.size(token_id) < 1 )
	{		
		res.json( {status:'error', msg:'missing token id'})
		return false
	}

 	npdb.collection('np_token').find( { token_name:  'client_token', user_ip:user_ip, }).toArray(function (err, token_data)
	{	
		var get_max_token = alasql('select * From ? where token_expire_value > ? ', [token_data, +moment()])

		if( _.size(get_max_token) <1)
		{
			//set new token
			var dttm = +moment()	
			
			var id = Math.random().toString(36).substr(2,6)

			var create_salt =  'Nodepress JS'		

			var token_value = func.HashPassword(dttm + create_salt)


			res.json({ status:"success", token:token_value, })

			//set token
			func_db.token_set(req,'client_token', token_value) 

			clean_up_tokens()

		}
		else if( _.size(get_max_token) >0) 
		{	
			var now = +moment()
			
			res.json({ status:"success", token:get_max_token[0].token_value,  })

			clean_up_tokens()


		}

	}) 
 

}) 
//--->get data - end

var clean_up_tokens = function()
{
	//remove old tokens to clean up collection/table and keep the data at minimum
	npdb.collection('np_token').remove({ token_expire_value: { $lt: +moment()  } } )

	alasql('DELETE FROM np_token')

	npdb.collection('np_token').find( { token_expire_value: { $gt: +moment() } } ).toArray(function (err, token_rows)
	{ 
		alasql('SELECT * INTO np_token FROM ?',[token_rows])
	})
}

 