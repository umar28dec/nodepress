/*
	Categories -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/

//--->get data - start
app.get('/api/categories', function(req, res, next) 
{ 

	var site_url = func.DomainURL(req).cur_path
 	func.log('GET-> '+ site_url )

  
 
	var option_name 	= _.escape(req.query.option_name) 

	/*
	if(_.size(option_name) < 1) 
	{
		res.json( {status:'error', msg:'missing option name  in api call'})
		return false
	}
	*/
	
	var np_options = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_posts = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_posts')
		.find( {post_type: 'post', post_status:'publish', link_access_type : "public" , post_dttm_unix :{$lte:+moment()} },  {'categories': true, '_id':false})
		.sort( { post_views: -1 } )
		.toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_users = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_users').find({},{_id: 0}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})
	
	Promise.all([np_posts,np_options,]).then(function(results) 
	{
		var np_posts = results[0]
		var np_options = results[1]	
		

		if(_.size(np_posts) < 1) 
		{
			res.json( {status:'error', msg:'no data found'})
			return false
		}		

		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value	

		var d = alasql('select categories from ? order by categories ASC',[np_posts])	

		res.json( {status:'success', msg:'found option data', categories: d, site_url:site_url })


	})
})


app.get('/api/top-posts', function(req, res, next) 
{ 

	var site_url = func.DomainURL(req).cur_path
 	func.log('GET-> '+ site_url )
 
	var counter 	= _.escape(req.query.top_posts_counter) 
	
	if(_.size(counter) < 1) 
	{
		res.json( {status:'error', msg:'missing top posts counter in api call'})
		return false
	}	

	var np_options = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_posts = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_posts')
		.find({post_type: 'post', post_status:'publish' , link_access_type : "public", post_dttm_unix :{$lte:+moment()} } )
		.sort( { post_views: -1 } )
		.toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_users = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_users').find({},{_id: 0}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})
	
	Promise.all([np_posts,np_options,]).then(function(results) 
	{
		var np_posts = results[0]
		var np_options = results[1]	
		

		if(_.size(np_posts) < 1) 
		{
			res.json( {status:'error', msg:'no data found'})
			return false
		}		

		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value	

		//var d = alasql('select post_title, post_views, post_url from ? order by post_views DESC',[np_posts])	
		var sql = 'select post_title, post_views, post_url from ? order by post_views DESC LIMIT  '+ counter	
		
		var d = alasql(sql,[np_posts])

		res.json( {status:'success', msg:'found option data', top_posts: d, site_url:site_url })
	})
})


app.get('/api/related/post', function(req, res, next) 
{ 

	var site_url = func.DomainURL(req).cur_path
 	func.log('GET-> '+ site_url )
 
	var post_url 	= _.escape(req.query.url) 

 
	if(_.size(post_url) < 1) 
	{
		res.json( {status:'error', msg:'missing post url in api call'})
		return false
	}
	
	var np_options = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_posts = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_posts')
		.find({post_type: 'post', post_status:'publish' , link_access_type : "public", post_dttm_unix :{$lte:+moment()} } )
		.sort( { rec_dttm_unix: -1 } ).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_users = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_users').find({},{_id: 0}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})
	
	Promise.all([np_posts,np_options, np_users]).then(function(results) 
	{
		var np_posts = results[0]
		var np_options = results[1]	
		var np_users = results[2]	

		var check_url = alasql('select * from ? where post_url=?', [np_posts, post_url])

		if(_.size(check_url) < 1 )
		{
			res.json( {status:'error',  msg:"no related posts found"})
			return false
		}

		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value

		var cat_slug = alasql('select * from ? where post_url=?', [np_posts, post_url])[0].categories
		var cat_post_url = alasql('select * from ? where post_url=?', [np_posts, post_url])[0].post_url

		var get_all_cats = []

		cat_slug.forEach(function(ele0) 
		{
			np_posts.forEach(function(ele1) 
			{
				var ele_cat = ele1.categories			
				if(_.size(ele_cat) > 0)
				{				
					ele_cat.forEach(function(ele2) 
					{
						if(ele0.slug  == ele2.slug &&  cat_post_url != ele1.post_url)
						{	
							var d1 = ele1.post_feature_img.replace("../", site_url+"/");

							get_all_cats.push({
								post_title:ele1.post_title,
								post_url: site_url+'/'+ele1.post_url,
								post_feature_img: d1
							}) 
						}
					})
				} 
			})
		})

		if(_.size(get_all_cats) < 1 )
		{
			res.json( {status:'error',  msg:"no related posts found"})
			return false
		}

		res.json( {status:'success',  related_posts:get_all_cats})
		
	})

})



app.get('/api/post/pre-next', function(req, res, next) 
{ 

	var site_url = func.DomainURL(req).cur_path
 	func.log('GET-> '+ site_url )
 
	var post_url 	= _.escape(req.query.url) 

 
	if(_.size(post_url) < 1) 
	{
		res.json( {status:'error', msg:'missing post url in api call'})
		return false
	}
	
	var np_options = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_posts = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_posts')
		.find({post_type: 'post', post_status:'publish' , link_access_type : "public", post_dttm_unix :{$lte:+moment()} } )
		.toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})

	var np_users = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_users').find({},{_id: 0}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		})
	})
	
	Promise.all([np_posts,np_options, np_users]).then(function(results) 
	{
		var np_posts = results[0]
		var np_options = results[1]	
		var np_users = results[2]	

		var check_url = alasql('select * from ? where post_url=?', [np_posts, post_url])

		if(_.size(check_url) < 1 )
		{
			res.json( {status:'error',  msg:"no posts found"})
			return false
		}

		var site_url = alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value


		var np_posts_pre =  alasql('select * from ? ORDER BY post_id  ASC', [np_posts]);

		var np_posts_next =  alasql('select * from ? ORDER BY post_id DESC', [np_posts]);

		var post_id = alasql('select * from ? where post_url=?', [np_posts_pre, post_url])

		var post_next = alasql('select post_title, post_url,post_feature_img from ? where post_id>?', [np_posts, post_id[0].post_id])[0]
		var post_pre = alasql('select post_title, post_url,post_feature_img from ? where post_id<?', [np_posts_next, post_id[0].post_id])[0]

		var d1_pre,d1_next;

		if(_.size(post_pre) < 1 )
		{
			d1_pre = null
			
		}
		else if(_.size(post_pre) > 0 )
		{
			d1_pre = 
			{
				post_title: post_pre.post_title,
				post_url: site_url+'/'+ post_pre.post_url,
				post_feature_img: post_pre.post_feature_img.replace("../", site_url+"/")
			}
		}

		
		if(_.size(post_next) < 1 )
		{
			var d1_next = null
			
		}
		else if(_.size(post_next) > 0 )
		{
			d1_next = 
			{
				post_title: post_next.post_title,
				post_url: site_url+'/'+ post_next.post_url,
				post_feature_img: post_next.post_feature_img.replace("../", site_url+"/")
			}
		} 

		res.json( {status:'success',  post_pre:d1_pre, post_next:d1_next,   })
		
	})

})
//--->get data - end 