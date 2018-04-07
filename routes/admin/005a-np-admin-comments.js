/*
	Comments -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE table_name');



//--->create new data - start
app.put('/np-admin/comments', function(req, res, next) 
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

		//all good to go
 		var post_id 				= req.body.post_id;
		var comment_id 				= req.body.comment_id;
		var comment_author 			= req.body.comment_author;
		var comment_author_email 	= req.body.comment_author_email;
		var comment_author_url 		= req.body.comment_author_url;
		var comment_content 		= req.body.comment_content; 
		var comment_status 			= 'approved'

		if(!req.body.comment_id)
		{
			res.json({status:'error', msg: 'missing comment id'});	
			return false;
		}
		
		var qry = {comment_id: parseInt(comment_id)};


		var  np_comments =
		{
			comment_id:parseInt(comment_id),
			post_id:parseInt(post_id), //<---coming from np_posts
			
			comment_author: comment_author,
			comment_author_email: comment_author_email,
			comment_author_url: comment_author_url,
			comment_author_ip: '',
			comment_content: comment_content,
			comment_status: comment_status, //<--- pending/approved
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment(),
		}
		npdb.collection('np_comments').find(qry ).toArray(function (err,  data)
		{

			if(_.size(data) > 0 ) 
			{
				res.json( {status:'error',code:'comment_id_exist', msg:'comment id already exist'});
				return false;
			}
			else if(_.size(data) < 1 ) 
			{
				npdb.collection('np_comments').insert(np_comments);				 			 					
				res.json( {status:'success', msg:'comment added',  });

				//increase the post counter by 1
				//npdb.collection('np_posts').updateOne( { post_id: post_id  }, { $inc: { comment_counter: 1,  }} )

				console.log(post_id)
				update_post_comment_counter(post_id)
				return false; 					 
			}
		})

		
	})

});
//--->create new data - end


//--->get data - start
app.get('/np-admin/comments', function(req, res, next) 
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
 

		var np_join_comments_posts = function () 
		{
			return new Promise(function(resolve, reject) 
			{

				npdb.collection('np_posts').aggregate(
				[
				    {
				      $lookup:
				        {
				          from: "np_comments",
				          localField: "post_id",
				          foreignField: "post_id",
				          as: "comment_info"
				        }
				    },
				    {
				      $match: { "comment_info": { $ne: [] }, post_type:'post' }
				   }
				]).toArray(function (err, data)
				{
					 
					if(data) 
					{
						var get_data = []
						data.forEach(function (ele1,i) 
						{
							// body...
							ele1.comment_info.forEach(function (ele2,i)
							{
								var d1 = {
									post_id: ele1.post_id,
									post_title:ele1.post_title,

									post_url:ele1.post_url,

									 
									comment_id:ele2.comment_id,
									comment_author: ele2.comment_author,
									comment_author_email: ele2.comment_author_email,
									comment_author_url: ele2.comment_author_url,
									comment_content: ele2.comment_content,
									comment_status: ele2.comment_status,
									rec_dttm: ele2.rec_dttm,
									rec_dttm_unix: ele2.rec_dttm_unix, 
								}
								get_data.push(d1)
							})
						})
						resolve(get_data);
					}			
				}); 

			});
		}

		np_join_comments_posts().then(function (d1) 
		{
			res.json( 
				{
					status:'success', 
					msg:'found posts', 
					 
					get_np_join_comments_posts:d1,
				});
		})
		 
		
	})
 

});
//--->get data - end



//--->update data - start
app.post('/np-admin/comments/update/single', function(req, res, next) 
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

		var datasend 				= req.body.datasend;
		var comment_id 				= req.body.comment_id;
		var comment_author 			= req.body.comment_author;
		var comment_author_email 	= req.body.comment_author_email;
		var comment_author_url 		= req.body.comment_author_url;
		var comment_content 		= req.body.comment_content; 

		if(!req.body.comment_id)
		{
			res.json({status:'error', msg: 'missing comment id'});	
			return false;
		}
		
		var qry = {comment_id: parseInt(comment_id)};

		var update_comment_status = 
		{
			comment_author:comment_author,
			comment_author_email:comment_author_email,
			comment_author_url:comment_author_url,
			comment_content:comment_content,
		}

		npdb.collection('np_comments').find(qry ).toArray(function (err,  data)
		{

			if(_.size(data) < 1 ) 
			{
				res.json( {status:'error', msg:'no comment id found'});
				return false;
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_comments').updateOne( qry, { $set: update_comment_status },function (err, result)
				{
					if (err) throw err;					 
					
					res.json( {status:'success', msg:'updated comment row',  });
					return false; 		
					
					 
				})
			}
		})

	})

})

var update_post_comment_counter = function(post_id)
{
	var qry = {post_id: parseInt(post_id), comment_status: "approved"};

	npdb.collection('np_comments').find(qry ).toArray(function (err,  data)
	{		
		var total_comments = _.size(data)

		npdb.collection('np_posts').updateOne( {post_id: parseInt(post_id)}, { $set: {comment_counter:total_comments} })
		

	})
}
 
app.post('/np-admin/comments/single', function(req, res, next) 
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
		var comment_id 		= req.body.comment_id;
		var comment_status 	= req.body.comment_status;

		if(!req.body.comment_id)
		{
			res.json({status:'error', msg: 'missing comment id'});	
			return false;
		}
		
		var qry = {comment_id: parseInt(comment_id)};
		var update_comment_status = {
			comment_status:comment_status,
		}

		npdb.collection('np_comments').find(qry ).toArray(function (err,  data)
		{

			if(_.size(data) < 1 ) 
			{
				res.json( {status:'error', msg:'no comment id found'})
				return false
			}
			else if(_.size(data) > 0 ) 
			{
				npdb.collection('np_comments').updateOne( qry, { $set: update_comment_status },function (err, result)
				{
					if (err) throw err;	 

					res.json( {status:'success', msg:'updated row', np_comments:data })

					//update the post counter
					update_post_comment_counter(data[0].post_id) 
					 
					return false 
				})
			}
		})

	})

})

app.post('/np-admin/comments/multiple', function(req, res, next) 
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

		var datasend 			= req.body.datasend;
		var comment_post_ids 	= req.body.comment_post_ids;
		var comment_status 		= req.body.comment_status;

		if(!req.body.comment_post_ids)
		{
			res.json({status:'error', msg: 'missing comment id'});	
			return false;
		}

		//--->convert into integer - start
		var ids = []
		comment_post_ids.forEach(function(element, index)
		{
			ids.push(parseInt(element) )
		})		
		//--->convert into integer - end
		
		
		//find all the values in an array
		var qry = { comment_id: { $in: ids } }
		var update_comment_status = {comment_status:comment_status,	}


		npdb.collection('np_comments').find(qry).toArray(function (err,  data)
		{ 

			if(_.size(data) > 0) 
			{ 
				if (err) throw err; 

				res.json( {status:'success', msg:'updated row', post_data: data});

				//update
				npdb.collection('np_comments').updateMany( qry, { $set: update_comment_status })

				
				//--->update post comment counter > start
				_.uniq(data).forEach(function (ele) 
				{ 				 
					//update the post counter
					update_post_comment_counter(ele.post_id)
				})				
				//--->update post comment counter > end

			
				
				return false
				
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'});
			}
		})

		

	})

});
//--->update data - end



//--->delete data - start
app.delete('/np-admin/comments/single', function(req, res, next) 
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

		//all good to go
		var datasend 		= req.body.datasend; 
		var comment_id 		= parseInt(req.body.comment_id); 

		npdb.collection('np_comments').find({comment_id: comment_id}).toArray(function (err,  data)
		{ 
			//console.log(data)
			if(_.size(data) > 0) 
			{
				//delete row data
				npdb.collection('np_comments').deleteMany( { comment_id: comment_id  },function (err, result)
				{
					if (err) throw err;

					//get all 
					//res.json( {status:'success', msg:'deleted comment',})

					//update the post counter
					update_post_comment_counter(data[0].post_id)

					npdb.collection('np_comments').find({comment_status:'pending'}).toArray(function (err,  data2)
					{
						if(data) 
						{
							 res.json( {status:'success', msg:'deleted comment',np_comments:data2})
						}			
					}) 					  				
					 
				})
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid comment  id'});
			}
		})
	})

});

app.delete('/np-admin/comments/multiple', function(req, res, next) 
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
		var delete_comment_ids = req.body.delete_comment_ids; 
 

		if(_.size(delete_comment_ids) < 1 )
		{
			res.json( {status:'error', msg:'invalid page  id'});
			return false; 
		}

		//--->convert into integer - start
		var comment_ids = []
		delete_comment_ids.forEach(function(element, index)
		{
			comment_ids.push(parseInt(element) )
		})		
		//--->convert into integer - end

	 

		//find all the values in an array
		var qry = { comment_id: { $in: comment_ids } }

		npdb.collection('np_comments').find(qry).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{ 
				if (err) throw err;
 

				//res.json( {status:'success', msg:'deleted row' }) 

				//delete from np_posts
				npdb.collection('np_comments').deleteMany( qry) 



				//--->update post comment counter > start
				_.uniq(data).forEach(function (ele) 
				{ 	
					console.log(' ele.post_id ', ele.post_id)			 
					//update the post counter
					update_post_comment_counter(ele.post_id)
				})				
				//--->update post comment counter > end

				npdb.collection('np_comments').find({comment_status:'pending'}).toArray(function (err,  data2)
				{
					if(data) 
					{
						 res.json( {status:'success', msg:'deleted comment',np_comments:data2})
					}			
				}) 	


				return false
				
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'}) 
			}
		})
	})

});
//--->delete data - end