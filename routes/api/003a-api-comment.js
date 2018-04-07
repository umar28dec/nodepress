/*
	Comment -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/
 


//--->update data - start
app.post('/api/comment', function(req, res, next) 
{ 
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );
 

	//check to see if logged in and has valid admin token
	func_db.admin_token_check(req).then(function(d1)
	{
		var site_url = func.DomainURL(req).cur_path;

		var Status = d1.status
		if(Status=="error")
		{
			//error with admin token
			res.json( {status:'error', code: 'missing_token', msg:'missing api token'});			
			return false
		}

		//all good to go
		func.log('POST-> '+ site_url )


		var post_id 				= req.body.post_id
		var comment_author 			= req.body.comment_author
		var comment_author_email 	= req.body.comment_author_email
		var comment_author_url 		= req.body.comment_author_url
		var comment_content 		= req.body.comment_content

		var template_obj = 
		{
			post_id:1,
			comment_author:'Nodepress',
			comment_author_email:'info@nodepressjs.com',
			comment_author_url:'http://www.nodepressjs.com',
			comment_content:'I love nodepress js'
		}

		if(!post_id || post_id < 0 )
		{
			res.json( {status:'error', template_obj:template_obj, missing_field: 'post_id', msg:'missing field > post id' }) 			
			return false
		}

		if(!comment_author || comment_author < 0 )
		{
			res.json( {status:'error', template_obj:template_obj, missing_field: 'comment_author', msg:'missing field > comment author'  }) 			
			return false
		}

		if(!comment_author_email || comment_author_email < 0 )
		{
			res.json( {status:'error', template_obj:template_obj, missing_field: 'comment_author_email', msg:'missing field > comment author email' }) 			
			return false
		}

		if(!comment_author_email || comment_author_email < 0 )
		{
			res.json( {status:'error', template_obj:template_obj, missing_field: 'comment_author_email', msg:'missing comment author email field' }) 			
			return false
		} 


		var post_id = parseInt(req.body.post_id)
		var user_ip = ip.get(req)


		var  np_comments =
		{
			comment_id:+moment(),

			post_id:post_id, //<---coming from np_posts
			
			comment_author: comment_author,
			comment_author_email: comment_author_email,
			comment_author_url: comment_author_url,
			comment_author_ip: user_ip,
			comment_content: comment_content,
			comment_status: 'pending', //<--- pending/approved
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment()

		}
		
		npdb.collection('np_posts').find({post_id:post_id}).toArray(function (err,  data)
		{
			if(_.size(data) < 1 ) 
			{
				res.json( {status:'error', msg:'invaild post id'});
			}			
			else if(_.size(data) > 0) 
			{
				//insert new comment data
				npdb.collection('np_comments').insert(np_comments)

				
				//npdb.collection('np_posts').updateOne( { post_id: post_id  }, { $inc: { comment_counter: 1,  }} )

				res.json( {status:'success', msg:'added new comment' });

			}

		})
	 
	})

});
//--->update data - end

 