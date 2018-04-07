/*
	Sitemap & RSS feed -> CRUD 

	C = Create
	R = Read/Get
	U = Update 
	D = Delete
*/

var strip_html_tags = function(stringWithHTML)
{
	//will strip all the html tags.
	
	//this function is being used for meta description(page teaser)

	var str = stringWithHTML.replace(/&nbsp;/g,' ') 
	.replace(/\n/g, " ")
	.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "")
	return str
}

app.get('/sitemap', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	//-->log visitor info > start
	var str_log = 'GET-> '+ func.DomainURL(req).cur_path
	+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
	func.log(str_log)	
	//-->log visitor info > end
 

	npdb.collection('np_posts')
	.find({post_status : "publish",link_access_type : "public",  })
	.sort( { rec_dttm_unix: -1} ).toArray(function (err,  data)
	{
		var np_posts = data

		var get_all_posts 		= alasql('select post_url from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_pages 		= alasql('select post_url from ? where post_type="page" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_categories 	= alasql('select categories from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 

		
		//you can use the one below if you want include the protocol(http or https) in your url
		//var get_site_url = req.protocol + '://' + req.get('host')+'/'

		//this excludes the protocol from the url
		var get_site_url = func.DomainURL(req).url +'/' 

		var file_text = ''		
		file_text += '<urlset xmlns="'+get_site_url+'sitemap" >'


		//--->create posts info > start
		get_all_posts.forEach(function (ele) 
		{
			file_text +='<url>'
			file_text +='<loc>'+get_site_url+ele.post_url+'</loc>'
			file_text +='</url>'
		})
		//--->create posts info > end



		//--->create categories info > start
		var a1 = []
		get_all_categories.forEach(function (ele1) 
		{	
			ele1.categories.forEach(function (ele2) 
			{
				a1.push({slug:ele2.slug})
			}) 
		})
		var get_final_cat = alasql('select slug from ? group by slug', [a1])

		get_final_cat.forEach(function (ele3) 
		{
			file_text +='<url>'
			file_text +='<loc>'+get_site_url+'category/'+ele3.slug+'</loc>'
			file_text +='</url>'
		})

		//--->create categories info > end



		//--->create pages info > start
		get_all_pages.forEach(function (ele) 
		{
			file_text +='<url>'
			file_text +='<loc>'+get_site_url+ele.post_url+'</loc>'
			file_text +='</url>'
		})
		//--->create pages info > end

		file_text +='</urlset>'

		res.set('Content-Type', 'text/xml');

		//res.write(file_text)
		res.send(file_text)
		//res.end()
	}) 
})

app.get('/rss', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	var site_url = func.DomainURL(req).cur_path;

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
		.find({post_status : "publish", link_access_type:'public', post_dttm_unix :{$lte:+moment()} })
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

	
	Promise.all([np_posts,np_options,np_users]).then(function(results) 
	{
		//Make sure all promises done!


		//-->log visitor info > start
		var str_log = 'GET-> '+ func.DomainURL(req).cur_path
		+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
		func.log(str_log)	
		//-->log visitor info > end

		var np_posts 	= results[0]
		var np_options 	= results[1]	
		var np_users 	= results[2]	


		var home_page_title = alasql('select * from ? where option_name="home_page_title" ', [np_options])[0].option_value
		var home_page_description = alasql('select * from ? where option_name="home_page_description" ', [np_options])[0].option_value

		
		var site_url = func.DomainURL(req).url


		var get_all_posts 		= alasql('select * from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_pages 		= alasql('select * from ? where post_type="page" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_categories 	= alasql('select * from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 

		//you can use the one below if you want include the protocol(http or https) in your url
		//var get_site_url = req.protocol + '://' + req.get('host')+'/'

		//this excludes the protocol from the url
		var get_site_url = func.DomainURL(req).url +'/'

		
		var file_text = ''

		file_text += '<?xml version="1.0" encoding="UTF-8" ?>'		 
		file_text += '<rss version="2.0">'
		file_text += '<channel>'

			file_text +='<title>'+home_page_title+'</title>'
			file_text +='<link>'+get_site_url+'</link>'
			file_text +='<description>'+home_page_description+'</description>'
			file_text +='<language>en-us</language>'
			file_text +='<ttl>60</ttl>'
			file_text +='<changefreq>hourly</changefreq>'  

				//--->create posts info > start
				get_all_posts.forEach(function (ele) 
				{
					file_text +='<item>'
					file_text +='<loc>'+get_site_url+ele.post_url+'</loc>'
					
					file_text +='<title>'+ele.post_title+'</title>'
					file_text +='<link>'+get_site_url+ele.post_url+'</link>'

					ele.categories.forEach(function(ele)
					{
						file_text +='<category><![CDATA['+ele.name+']]></category>'	
					})

					//D, d M Y H:i:s GMT
					var d = moment(ele.post_dttm_unix).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
					//var d = moment(ele.post_dttm_unix).format()
					file_text +='<pubDate>'+d+'</pubDate>'


					file_text +='<description><![CDATA['+strip_html_tags(ele.post_teaser)+']]> </description>'
					file_text +='</item>'
				})
				//--->create posts info > end


		file_text += '</channel>'
		file_text += '</rss>'
 

		res.set('Content-Type', 'text/xml')

		//res.write(file_text)
		res.send(file_text)
		//res.end()

	})
	
})


app.get('/feed', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	var site_url = func.DomainURL(req).cur_path;

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
		.find({post_status : "publish", link_access_type:'public', post_dttm_unix :{$lte:+moment()} })
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

	
	Promise.all([np_posts,np_options,np_users]).then(function(results) 
	{
		//Make sure all promises done!


		//-->log visitor info > start
		var str_log = 'GET-> '+ func.DomainURL(req).cur_path
		+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
		func.log(str_log)	
		//-->log visitor info > end

		var np_posts 	= results[0]
		var np_options 	= results[1]	
		var np_users 	= results[2]	


		var home_page_title = alasql('select * from ? where option_name="home_page_title" ', [np_options])[0].option_value
		var home_page_description = alasql('select * from ? where option_name="home_page_description" ', [np_options])[0].option_value

		
		var site_url = func.DomainURL(req).url


		var get_all_posts 		= alasql('select * from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_pages 		= alasql('select * from ? where post_type="page" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_categories 	= alasql('select * from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 

		//you can use the one below if you want include the protocol(http or https) in your url
		//var get_site_url = req.protocol + '://' + req.get('host')+'/'

		//this excludes the protocol from the url
		var get_site_url = func.DomainURL(req).url +'/'

		//var file_name = func.GetPathTo('/views/sitemap.xml')

		var file_text = ''

		file_text += '<?xml version="1.0" encoding="UTF-8" ?>'		 
		file_text += '<rss version="2.0">'
		file_text += '<channel>'

			file_text +='<title>'+home_page_title+'</title>'
			file_text +='<link>'+get_site_url+'</link>'
			file_text +='<description>'+home_page_description+'</description>'
			file_text +='<language>en-us</language>'
			file_text +='<ttl>60</ttl>'
			file_text +='<changefreq>hourly</changefreq>'

				//--->create posts info > start
				get_all_posts.forEach(function (ele) 
				{
					file_text +='<item>'
					file_text +='<loc>'+get_site_url+ele.post_url+'</loc>'
					
					file_text +='<title>'+ele.post_title+'</title>'
					file_text +='<link>'+get_site_url+ele.post_url+'</link>'

					ele.categories.forEach(function(ele)
					{
						file_text +='<category><![CDATA['+ele.name+']]></category>'	
					})

					//D, d M Y H:i:s GMT
					var d = moment(ele.post_dttm_unix).format('ddd, DD MMM YYYY HH:mm:ss ZZ')
					//var d = moment(ele.post_dttm_unix).format()
					file_text +='<pubDate>'+d+'</pubDate>'


					file_text +='<description><![CDATA['+strip_html_tags(ele.post_teaser)+']]> </description>'
					file_text +='</item>'
				})
				//--->create posts info > end


		file_text += '</channel>'
		file_text += '</rss>'
 

		res.set('Content-Type', 'text/xml')

		//res.write(file_text)
		res.send(file_text)
		//res.end()

	})
	
})