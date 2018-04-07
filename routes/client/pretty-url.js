app.get('/go/:id', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	var url = req.params.id;

	//-->log visitor info > start
	var str_log = 'GET-> '+ func.DomainURL(req).cur_path 
	+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
	func.log(str_log)	
	//-->log visitor info > end
			
	npdb.collection('np_pretty_url').find({url_short : url,}).toArray(function (err,  d2)
	{
		 
		if(_.size(d2) < 1)
		{
			var d = func.DomainURL(req).url + '/'+url
			res.redirect(d );
			return false;
		}
		else if(_.size(d2) > 0)
		{
			var url_long = d2[0].url_long
			var url_id = d2[0].url_id 
			res.redirect(url_long);

			//update post/page view counter
			npdb.collection('np_pretty_url').updateOne( { url_id: url_id  }, { $inc: { url_counter: 1,  }} )

			var np_pretty_url_tracker= 
			{
				url_id: url_id, 

				url_tracker_id:+moment(),

				url_tracker_ip:ip.get(req),
				url_tracker_refer: func.referer(req),  
			 
				rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
				rec_dttm_unix: +moment()
			}
			npdb.collection('np_pretty_url_tracker').insertOne(np_pretty_url_tracker);

			

		}
	})
})