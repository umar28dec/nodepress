/*
	Page -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/


//create tables for cache(in memory) look to speed up things
//alasql('CREATE TABLE np_posts');

//--->create new data - start
app.put('/np-admin/pages/new', function(req, res, next) 
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
		var datasend 		= req.body.datasend;

		var PostTitle 		= req.body.PostTitle;
		var PostURL 		= req.body.PostURL;

		var Content_Teaser 	= req.body.Content_Teaser;		
		var Content_Post 	= req.body.Content_Post;

		var PostDttm 		= req.body.PostDttm;
		var AllowComments 	= req.body.AllowComments;

		var PostTags 		= req.body.PostTags;
		
		var PageTemplate 	= req.body.PageTemplate;
		var FeatureIMG 		= req.body.FeatureIMG;

		var  post_author_id = req.body.post_author_id; 

		var  LinkAccessType = req.body.LinkAccessType; 

		var post_status 	=  req.body.post_status; 
	

		/*
			1) Check to see if post url already exist
			2) Insert data into table/collection
		*/

		var post_id = +moment();

		var post_dttm;
		if(PostDttm)
		{ 
			var fullDateReal = new Date(PostDttm);
			var post_dttm = fullDateReal.toISOString();
		}
		else if(!PostDttm)
		{
			var fullDateReal = new Date();
			var post_dttm = fullDateReal.toISOString();
		}


		 

		var np_posts= 
		{
			post_id: post_id, 
			post_author_id: parseInt(post_author_id), //<--- from np_users
			
			post_dttm: moment(post_dttm).format("YYYY-MM-DD h:mm:ss a"),
			post_dttm_unix: +moment(post_dttm),
			
			post_title: PostTitle,
			post_url: PostURL,	
			post_teaser: Content_Teaser, //<--- will be used as meta description
			post_excerpt: '',	
			post_content: Content_Post,
			post_status:post_status, 
			link_access_type:LinkAccessType,
			post_tags: PostTags, //<--- for seo purposes will go into post/page metadata
			post_feature_img: FeatureIMG,//<-- link to image saved in "np-content/uploads/"
			page_template: PageTemplate, //<---
			post_type: 'page',//<--- post/page
			categories:'',
			post_views: 0,
			comments_allow: AllowComments, //<--- Yes/No
			comment_counter:0, //<---indicates total number of comments for post
			rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
			rec_dttm_unix: +moment()
		}

		//return false; 
		//--->post url check - start
		npdb.collection('np_posts').find({post_url:PostURL}).toArray(function (err,  data)
		{
			if(_.size(data) > 0) 
			{
				res.json( {status:'error', msg:'post url already exist'});
			}			
			else if(_.size(data) < 1) 
			{
				//insert new post data
				npdb.collection('np_posts').insert(np_posts);
				res.json( {status:'success', msg:'updated post data', post_id:post_id});				
			}
		}); 
		//--->post url check - end  

	})

});
//--->create new data - end




//--->get data - start
app.get('/np-admin/pages', function(req, res, next) 
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


		var np_join_users_posts = function () 
		{
			return new Promise(function(resolve, reject) 
			{

				npdb.collection('np_posts').aggregate(
				[
				    {
				      $lookup:
				        {
				          from: "np_users",
				          localField: "post_author_id",
				          foreignField: "user_id",
				          as: "author_info"
				        }
				    },
				    {
				      $match: { "author_info": { $ne: [] }, post_type:'page' }
				   }
				]).toArray(function (err, data)
				{
					if(data) 
					{
						var get_data = []
						data.forEach(function (ele,i) 
						{

							// body...
							var d1 = {
								post_id: ele.post_id,
								post_title:ele.post_title,

								post_url:ele.post_url,

								post_views:ele.post_views,
								
								post_status:ele.post_status,

								link_access_type:ele.link_access_type,
								
								categories:ele.categories,

								post_dttm:ele.post_dttm,
								post_dttm_unix:ele.post_dttm_unix,

								post_author_id:ele.post_author_id,
								user_access_type:ele.author_info[0].user_access_type,
								author_name: ele.author_info[0].display_name,

							}
							get_data.push(d1)
						})
						resolve(get_data);
					}			
				}); 

			});
		}
		
		
		np_join_users_posts().then(function (d1) 
		{
			if(_.size(d1) < 1) 
			{
				func.log('Warning-> '+site_url+' (error msg)-> no posts' );	
				res.json( {status:'no_page', msg:'no posts are in the database...create one...'});
				return false;
			}
			res.json( 
			{
				status:'success', msg:'found pages', 				 
				get_np_join_users_posts:d1,
			})
			
		})
	}) 

});

app.get('/np-admin/pages/single', function(req, res, next) 
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

		//good to go
		func.log('GET-> '+ site_url );

		var datasend 	= req.query.datasend;
		var post_id 	= req.query.post_id;

		

		if(!post_id)
		{
			res.json( {status:'error', msg:'missing post id'});
			return false;
		}

		//all good to go
		npdb.collection('np_posts').find({post_id: parseInt(post_id) },{_id: 0}).toArray(function (err,  data)
		{
			//console.log('get_post_id', data)
			if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'});
				return false;
			}			
			res.json( {status:'success', msg:'found post data', post_data: data});

		});

	})

});
//--->get data - end



//--->update data - start
app.post('/np-admin/pages/edit', function(req, res, next) 
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
			func.log('Failed-> '+site_url+' (error msg)-> '+d1.msg);
			res.json(d1);			
			return false; 
		}

	
		//all good to go
		func.log('POST-> '+ site_url );

		//get variables
		var datasend 		= req.body.datasend;
		var PostTitle 		= req.body.PostTitle;
		var PostURL 		= req.body.PostURL;
		var Content_Teaser 	= req.body.Content_Teaser;
		var ReadMore 		= req.body.ReadMore;
		var Content_Post 	= req.body.Content_Post;
		var PostDttm 		= req.body.PostDttm;
		var PostTags 		= req.body.PostTags;
		var Categories 		= req.body.Categories;
		var FeatureIMG 		= req.body.FeatureIMG;

		var post_id 		= parseInt(req.body.post_id);

		var post_author_id 	= req.body.post_author_id; 

		var LinkAccessType = req.body.LinkAccessType; 
		var PageTemplate 	= req.body.PageTemplate;
		var AllowComments 	= req.body.AllowComments;

		var post_status 	=  req.body.post_status;
		
		var post_dttm;
		if(PostDttm)
		{ 
			var fullDateReal = new Date(PostDttm);
			var post_dttm = fullDateReal.toISOString();
		}
		else if(!PostDttm)
		{
			var fullDateReal = new Date();
			var post_dttm = fullDateReal.toISOString();
		}


		//console.log(Categories)

		/*
			1) Check to see if post url already exist
			2) Insert data into table/collection
		*/

		if(!req.body.post_id)
		{
			res.json({status:'error', msg: 'missing post id'});	
			return false;
		}

		if(datasend !='edit')
		{
			res.json( {status:'error', msg:'invalid post edit call'});
			return false; 
		}

		

		var np_posts_update = 
		{
			post_id: post_id, 
			post_author_id: parseInt(post_author_id), //<--- from np_users
			
			post_dttm: moment(post_dttm).format("YYYY-MM-DD h:mm:ss a"),
			post_dttm_unix: +moment(post_dttm),
			
			post_title: PostTitle,
			post_url: PostURL,	
			post_teaser: Content_Teaser, //<--- will be used as meta description
			post_excerpt: ReadMore,	
			post_content: Content_Post,
			post_status:post_status, 
			link_access_type:LinkAccessType,
			post_tags: PostTags, //<--- for seo purposes will go into post/page metadata
			post_feature_img: FeatureIMG,//<-- link to image saved in "np-content/uploads/"			
			categories:'',
			comments_allow: AllowComments, //<--- Yes/No

			page_template: PageTemplate, //<---
		}

		/*
			var qry = {post_url: post_url, post_id:{$ne: post_id} };

			- will make sure that url is not the same as already in the system
			  for another post_id
		*/
		var qry = {post_url: PostURL, post_id:{$ne: post_id} };

		npdb.collection('np_posts').find(qry ).toArray(function (err,  data)
		{
			if(_.size(data)   > 0 ) 
			{
				//found url with another post_id				
				res.json( {status:'error', msg:'post url already exist for another post'});
				return false;
			}

			else if(_.size(data) < 1) 
			{
				//update old row data
				npdb.collection('np_posts').updateOne( { post_id: post_id  }, { $set: np_posts_update },function (err, result)
				{
					if (err) throw err;
	  				res.json( {status:'success', msg:'updated row', cat_data: data});
					return false; 		
				})
			}
		})
	})

});
//--->update data - end




//--->delete data - start

//--->delete single - start

app.delete('/np-admin/pages', function(req, res, next) 
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
		func.log('DELETE-> post/single' ) 

		//all good to go
		var datasend 		= req.body.datasend; 
		var post_id 		= parseInt(req.body.post_id); 

		npdb.collection('np_posts').find({post_id: post_id}).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{
				//delete row data
				npdb.collection('np_posts').deleteMany( { post_id: post_id  },function (err, result)
				{
					if (err) throw err;

					//get all categories
	  				npdb.collection('np_posts').find().toArray(function (err,  data)
					{
						res.json( {status:'success', msg:'deleted row', post_data: data});
						return false; 		
					})
					 
				})
			}			
			else if(_.size(data) < 1) 
			{
				res.json( {status:'error', msg:'invalid post  id'});
			}
		})
	})

});
//--->delete single - end

//--->delete multiple - start
app.delete('/np-admin/pages/multiple', function(req, res, next) 
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
		var delete_post_ids = req.body.delete_post_ids; 
 

		if(_.size(delete_post_ids) < 1 )
		{
			res.json( {status:'error', msg:'invalid page  id'});
			return false; 
		}

		//--->convert into integer - start
		var post_ids = []
		delete_post_ids.forEach(function(element, index)
		{
			post_ids.push(parseInt(element) )
		})		
		//--->convert into integer - end

	 

		//find all the values in an array
		var qry = { post_id: { $in: post_ids } }

		npdb.collection('np_posts').find(qry).toArray(function (err,  data)
		{ 
			if(_.size(data) > 0) 
			{ 
				if (err) throw err; 

				res.json( {status:'success', msg:'deleted row', post_data: data});

				//delete from np_posts
				npdb.collection('np_posts').deleteMany( qry);
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


//--->delete data - end