var page_render = function(page_obj)
{ 

	npdb.collection('np_options').find().toArray(function (err,  data)
	{
		var v1 = page_obj

		var blog_name = alasql('select * from ? where option_name="blogname" ', [data])[0].option_value

		var cdn_libs = alasql('select * from ? where option_name="cdn_libs" ', [data])

		var get_active_plugins = alasql('select * from ? where option_name="active_plugins" ', [data])

		var np_header = ''

		//np_header += '<title>'+v1.page_title+  ' - ' + blog_name+'</title>\n\n'
		np_header += '<title>'+v1.page_title +'</title>\n\n'
 
		np_header += '\t<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\n'
		
		np_header += '\t<meta name=viewport content="width=device-width, initial-scale=1">\n\n'
	 

		np_header +='\t<link rel="canonical" href="'+v1.page_url+'" /> \n'

		np_header +='\t<meta name="description" content="'+strip_html_tags(v1.page_description)+'" /> \n'

		if(v1.page_tags)
		{
			np_header +='\t<meta name="Keywords" content="'+v1.page_tags+'">\n'	
		}
		np_header +='\t<link rel="icon" href="/favicon.ico" type="image/x-icon">\n'
		np_header +='\n\n'


		//--->Twitter Card data > start
		np_header +='\t<!--[Twitter Card data > start]--> \n'
		np_header +='\t<meta name="twitter:card" value="summary">\n'
		np_header +='\t<meta name="twitter:title" content="'+v1.page_title+'">\n'
		np_header +='\t<meta name="twitter:description" content="'+strip_html_tags(v1.page_description)+'">\n'
		
		//---> Twitter Summary card images must be at least 120x120px 
		if(v1.post_feature_img)
		{
			var d1 = v1.post_feature_img.replace("../", v1.site_url+"/");
			np_header +='\t<meta name="twitter:image" content="'+d1+'"> \n'
		}
		np_header +='\t<!--[Twitter Card data > end]--> \n\n'

		//--->Twitter Card data > end


		//--->Open Graph data > start
		np_header +='\t<!--[Open Graph data > start]--> \n'
		np_header +='\t<meta property="og:type" value="article">\n'
		np_header +='\t<meta property="og:title" content="'+v1.page_title+'">\n'
		np_header +='\t<meta property="og:description" content="'+strip_html_tags(v1.page_description)+'">\n'
		np_header +='\t<meta property="og:url" content="'+v1.page_url+'">\n'

		if(v1.post_feature_img)
		{
			var d1 = v1.post_feature_img.replace("../", v1.site_url+"/");
			np_header +='\t<meta property="og:image" content="'+d1+'"> \n'
		}
		np_header +='\t<!--[Open Graph data > end]--> \n\n'
 	
 		//--->Open Graph data > end



		//--->Schema.org markup for Google+ > start
		np_header +='\t<!--[Schema.org markup for Google+ > start]--> \n'
		np_header +='\t<meta property="og:type" value="article">\n'
		np_header +='\t<meta itemprop="name" content="'+v1.page_title+'">\n'
		np_header +='\t<meta itemprop="description" content="'+strip_html_tags(v1.page_description)+'">\n'

		if(v1.post_feature_img)
		{
			var d1 = v1.post_feature_img.replace("../", v1.site_url+"/");
			np_header +='\t<meta itemprop="image" content="'+d1+'"> \n'
		}
		np_header +='\t<!--[Schema.org markup for Google+ > end]--> \n\n'
 	
 		//--->Schema.org markup for Google+ > end


 		//--->libs > start
 		np_header +='\t<!--[libs > start]--> \n'

 		var cdnjs_files_css = '' 		
		cdnjs_files_css +='\t<link defer async="true" rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">\n'
		//cdnjs_files_css +='\t<link async  rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\n'
		//cdnjs_files_css +='\t<link async  rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css">\n' 

		var cdnjs_files_js = ''
		cdnjs_files_js +='\t<script  src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript"></script>\n'		
		cdnjs_files_js +='\t<script  src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js" type="text/javascript"></script>\n'
		//cdnjs_files_js +='\t<script defer src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js" type="text/javascript"></script>\n'
			
 		var local_files_css = '' 		
		local_files_css +='\t<link   rel="stylesheet" href="'+v1.site_url+'/np-core/libs/bootstrap/css/bootstrap.min.css">\n'
		//local_files_css +='\t<link defer  rel="stylesheet" href="'+v1.site_url+'/np-core/libs/font-awesome/css/font-awesome.min.css">\n'
		//local_files_css +='\t<link async defer  rel="stylesheet" href="'+v1.site_url+'/np-core/libs/prism/prism.min.css">\n'
		

		var local_files_js = ''
		local_files_js +='\t<script  src="'+v1.site_url+'/np-core/libs/jquery/jquery.min.js" type="text/javascript"></script>\n'
		local_files_js +='\t<script  defer src="'+v1.site_url+'/np-core/libs/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>\n'				
		//local_files_js +='\t<script  async defer src="'+v1.site_url+'/np-core/libs/prism/prism.min.js" type="text/javascript"></script>\n'
 		
		var check_cdn_libs
		
 		if(_.size(cdn_libs) > 0)
 		{
			//user wants to use cdnjs to load libs
			if(cdn_libs[0].option_value == 'yes')
			{
				check_cdn_libs = 'yes'
				np_header += cdnjs_files_css
				np_header += cdnjs_files_js
			}
			else
			{
				check_cdn_libs = 'no'
				//load libs locally				
				np_header += local_files_css
				np_header += local_files_js
			}
 		}
 		else
 		{
 			//load libs locally
 			//np_header += local_files
 			check_cdn_libs = 'no'
 			np_header += local_files_css
			np_header += local_files_js
 		}

 		np_header +='\t<!--[libs > end]--> \n\n'

 	 
 				
 		//minified np core js file and paint it to the page... will help with the google page speed!!!
		np_header +='\t<script  type="text/javascript">\n '

		np_header += '\t var cdn_libs="'+check_cdn_libs+'"; '

		np_header += ''+get_file_content('/views/np-core/js/np-core.js')


		np_header +='\t\n\n</script>\n'

		//--->libs > end		
		
		
		//--->plugins > start
		if(_.size(get_active_plugins) >0) 
		{	
			np_header +='\t<!--[plugins > start--> \n'

			np_header +='\t<script type="text/javascript">\n\n'

			get_active_plugins.forEach(function (ele) 
			{
				var obj = ele.option_value
				if(_.size(obj) > 0)				
				{
					obj.forEach(function(ele2)
					{ 
						//in case if you want to include the whole file instead of putting the data of the file on page.
						//note if you link to file... it will increase your page load time!!!
						//np_header +='\t<script defer src="'+v1.site_url+'/'+ele2.plugin_url+'" type="text/javascript"></script>\n'
						
						//minified the files... this will decrease your page load time
						//np_header += '\t'+get_file_content('/views/'+ele2.plugin_url)
						np_header += '\t'+raw_content('/views/'+ele2.plugin_url)
						np_header +='\n'
					})
				}
			})			
			np_header +='\t\n\n</script>\n\n'
			np_header +='\t\n\n<!--[plugins > end--> \n\n'
		}
		//--->plugins > end
	
	

		//set full url for any images
		var post_content = (v1.post_content).replace("../np-content/", v1.site_url+"/np-content/")

		
		 
		v1.res.render(v1.page_dir, 
		{   

			blog_name: blog_name ? blog_name : '',

			//from own server
			post_feature_img: v1.post_feature_img ? v1.post_feature_img.replace("../", v1.site_url+"/") : '',

			//for cdn
			//post_feature_img: v1.post_feature_img ? cdn_feature_img(v1.post_feature_img.replace("../", v1.site_url+"/")) : '',

			page_title: v1.page_title ?  v1.page_title : '' ,
			page_description: v1.page_description ?  v1.page_description : '' ,
			page_tags: v1.page_tags ?  v1.page_tags : '' ,

			np_head:np_header ,
			
			 
			theme_url:v1.theme_url ?  v1.theme_url : '' ,

			site_url:v1.site_url ?  v1.site_url : '' ,

			have_posts: v1.have_posts ?  v1.have_posts : '', 
			
			post_id: v1.post_id ?  v1.post_id : '', 
			post_title: v1.post_title ?  v1.post_title : '',
			post_url: v1.post_url ?  v1.post_url : '',
			post_dttm: v1.post_dttm ?  v1.post_dttm : '',
			post_dttm_unix: v1.post_dttm_unix ?  v1.post_dttm_unix : '',

			//post_content: v1.post_content,
			post_content: post_content,

			 
			comments_allow:v1.post_comments_allow ?  v1.post_comments_allow : '',
			post_comments: v1.post_comments ?  v1.post_comments : '',
			
			//post_comments_total:v1.post_comments,
			

			author_name:  v1.post_author_name ?  v1.post_author_name : '',
			author_url:  v1.post_author_url ?  v1.post_author_url : '',

			 
			//get_sidebar:v1.get_sidebar,
			sidebar_content :v1.get_sidebar,
			footer_content: v1.footer_content,

			active_menu:v1.active_menu,

			pagination: v1.pagination ?  v1.pagination : ''
		}
		,function(err, html) 
	 	{
	 		var d =  html
			//remove html comments
			.replace(/<!--(.*?)-->/g, '')
			//remove whitespace
			.replace(/\>\s*\</g,'><')

			//v1.res.setHeader("Cache-Control", "public, max-age=14400");
			//v1.res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
	 		
	  		v1.res.send(d);
		}) 

	})
}

var cdn_feature_img = function  (img) 
{
	var cdn_feature_img = img
	//.replace("../", v1.site_url+"/")
	//.replace('http://','')
	.replace('https://','https://img.')

	return cdn_feature_img;
}

function file_check(path) 
{
  try {
    return fs.statSync(path);
  } catch (ex) {}
  return false;
}
var raw_content =  function(file_path)
{
	if(file_check(func.GetPathTo(file_path)))
	{
		var data = fs.readFileSync( func.GetPathTo(file_path), 'utf8' )	
		.replace(/\n/g, '')
		return data
	}
	
}
var get_file_content = function(file_path)
{
	if(file_check(func.GetPathTo(file_path))){}
		var data = fs.readFileSync( func.GetPathTo(file_path), 'utf8' )		
		//.replace(/\n/g, '')
		//.replace(/\s+/g, ' ')
		//.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\//g,"")
		//.replace(/\/\/.*/g,"") 	 
		//.replace(/\s\s+/g, ' ') 

		var result = UglifyJS.minify(data, 
		{
			mangle: true,
			compress: {
				sequences: true,
				dead_code: true,
				conditionals: true,
				booleans: true,
				unused: true,
				if_return: true,
				join_vars: true,
				drop_console: true
			} 
		}); 
		result.code 

		return result.code
		//return data 
	
}

var theme_page_check = function (page_template,get_theme_folder) 
{
	//check to see if theme file exist
	var page_check = _.includes(page_template, 'default')

	var dir_page

	if(page_check)
	{
		dir_page = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/page.ejs')
	}
	else if(!page_check)
	{	

		var dir_file = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/'+page_template) 

		if( fs.existsSync(dir_file) )
		{
			dir_page = dir_file
		}
		else
		{
			dir_page = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/page.ejs')
		}
	}

	return dir_page
}




app.get('/', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	//redirect to site index/main page
	//res.redirect('np-admin');
	var site_url = func.DomainURL(req).cur_path;
	
	//-->log visitor info > start
	var str_log = 'GET-> '+ func.DomainURL(req).cur_path
	+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
	func.log(str_log)	
	//-->log visitor info > end

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

		var np_posts 	= results[0]
		var np_options 	= results[1]	
		var np_users 	= results[2] 

		

		var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value
		
		var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder
		
		var home_page_title = alasql('select * from ? where option_name="home_page_title" ', [np_options])[0].option_value
		var home_page_description = alasql('select * from ? where option_name="home_page_description" ', [np_options])[0].option_value

		var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value

		var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
		var active_footer_client = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 




 
		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value
		//var site_url = func.DomainURL(req).url


		var page_on_front_id = alasql('select * from ? where option_name="page_on_front" ', [np_options])

		
		//--->home page is set to custom page > start
		if(_.size(page_on_front_id) > 0)
		{
			//home is set to custom page
			var get_id =  parseInt(page_on_front_id[0].option_value)
			var v1 = alasql('select * from ? where post_id=? ', [np_posts,get_id])[0]

			if(_.size(v1) > 0)
			{ 			
				var dir_page = theme_page_check(v1.page_template ,get_theme_folder)

				var page_obj =
				{   
					res:res,
					req:req,
					page_dir:dir_page, 

					page_url: site_url+'/'+v1.post_url,

					page_title: home_page_title,
					page_description: home_page_description,
					
					page_tags: v1.post_tags,
					post_feature_img:v1.post_feature_img,
					 
					theme_url:theme_url,

					site_url:site_url,

					have_posts:'',
					
					post_id: v1.post_id, 
					post_title: v1.post_title,
					post_url: v1.post_url,
					post_dttm: v1.post_dttm,
					post_dttm_unix: v1.post_dttm_unix,
					post_content: v1.post_content,

					post_comments_allow:(v1.comments_allow).toLowerCase(),
					post_comments: '',

					author_name: 'post_author_name',
					author_url: 'post_author_url',

					
					get_sidebar:active_sidebar_client,
					footer_content:active_footer_client, 

					active_menu:active_menu
				}
				page_render (page_obj) 
				return false
			} 
		}
		//--->home page is set to custom page > end
  

		//--->home page is set to blog posts > start

		//will show list of blog posts on the home page

		var dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/index.ejs') 

		var paging_data = create_pagination_data
		({
			site_url:site_url,
			np_posts:np_posts,
			np_options:np_options,
			page_id:1
		})
		 
		var obj =
		{
			np_posts:paging_data.pg_data_arr, 
			np_users:np_users,
			site_url:site_url,
		} 

		have_posts = filter_all_post_data(obj) 

		var page_obj =
		{   
			res:res,
			req:req,
			page_dir:dir_post, 

			page_url: site_url,
			page_title: home_page_title,
			page_description: home_page_description,
			page_tags: '',
			post_feature_img:'',
			 
			theme_url:theme_url,

			site_url:site_url,

			have_posts:have_posts,
			 
			post_title: 'post_title',
			post_url: 'post_url',
			post_dttm: 'post_dttm',
			post_dttm_unix: 'post_dttm_unix',
			post_content: 'post_content',

			post_comments_allow:'',
			post_comments: 'post_comments',

			author_name: 'post_author_name',
			author_url: 'post_author_url',

			
			get_sidebar:active_sidebar_client,
			footer_content:active_footer_client, 

			active_menu:active_menu, 
			pagination:paging_data.pg_div
		}

		page_render (page_obj) 

		//--->home page is set to blog posts > end
		 
	}) 
}) 

app.get('/page/:id', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	//only accept integer
	var page_id = parseInt(req.params.id) 



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

		var np_posts 	= results[0]
		var np_options 	= results[1]	
		var np_users 	= results[2] 

		

		var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value
		
		var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder
		
		var home_page_title = alasql('select * from ? where option_name="home_page_title" ', [np_options])[0].option_value
		var home_page_description = alasql('select * from ? where option_name="home_page_description" ', [np_options])[0].option_value

		var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value

		var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
		var active_footer_client = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 

		//var site_url = func.DomainURL(req).url
		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value

		//page id is not a integer so show 404 error page
		if(!page_id)
		{
			
			//-->log visitor info > start
			var str_log = 'Warning-> '+ func.DomainURL(req).cur_path
			+'(error msg)-> 404 page '
			+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
			func.log(str_log)	
			//-->log visitor info > end	

			var page_404 = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/404.ejs')
			
			

			var page_obj =
			{   
				res:res,
				req:req,
				page_dir:page_404, 

				page_url: site_url+'/404',
				page_title: "404 - Oh nooo can't find your page " ,
				page_description: '',
				page_tags: '',
				post_feature_img:'',
				 
				theme_url:theme_url,

				site_url:site_url,

				have_posts:'',
				 
				post_title: "404 - Oh nooo can't find your page",
				post_url: 'post_url',
				post_dttm: 'post_dttm',
				post_dttm_unix: 'post_dttm_unix',
				post_content: 'post_content',

				post_comments_allow:'',
				post_comments: 'post_comments',
				

				author_name: 'post_author_name',
				author_url: 'post_author_url',

				
				get_sidebar:active_sidebar_client,
				footer_content:active_footer_client,

				active_menu:active_menu
			}

			page_render (page_obj)
			return false 
		}

		//--->home page is set to blog posts > start

		//will show list of blog posts on the home page


		//-->log visitor info > start
		var str_log = 'GET-> '+ func.DomainURL(req).cur_path
		+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
		func.log(str_log)	
		//-->log visitor info > end 
		 

		var paging_data = create_pagination_data
		({
			site_url:site_url,
			np_posts:np_posts,
			np_options:np_options,
			page_id:page_id
		}) 

		var obj =
		{ 
			np_posts:paging_data.pg_data_arr,
			np_users:np_users,
			site_url:site_url,
		} 	

		have_posts = filter_all_post_data(obj) 

		var dir_post 
		if(_.size(have_posts) < 1)
		{
			//no posts were found based on the page id
			dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/404.ejs')
		}
		else if(_.size(have_posts) > 0)
		{
			//posts were found based on the page id
			dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/index.ejs')
		}

		var page_obj =
		{   
			res:res,
			req:req,
			page_dir:dir_post, 

			page_url: site_url,
			page_title: home_page_title,
			page_description: home_page_description,
			page_tags: '',
			post_feature_img:'',
			 
			theme_url:theme_url,

			site_url:site_url,

			have_posts:have_posts,
			 
			post_title: 'post_title',
			post_url: 'post_url',
			post_dttm: 'post_dttm',
			post_dttm_unix: 'post_dttm_unix',
			post_content: 'post_content',

			post_comments_allow:'',
			post_comments: 'post_comments',

			author_name: 'post_author_name',
			author_url: 'post_author_url',

			
			get_sidebar:active_sidebar_client,
			footer_content:active_footer_client, 

			active_menu:active_menu, 
			pagination:paging_data.pg_div
		}

		page_render (page_obj) 

		//--->home page is set to blog posts > end

	})


})







app.get('/:id', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	/*
		1) check to see if "post_url" has any folders with the name
			- if so, redirect to it.

		2) if not, then look up "post_url_all" in database and process it
	*/
	

	var post_url = req.params.id
	//var site_url = func.DomainURL(req).cur_path

	

	
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
		.find({post_url : post_url} )
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

		var home_page_title = alasql('select * from ? where option_name="home_page_title" ', [np_options])[0].option_value
		var home_page_description = alasql('select * from ? where option_name="home_page_description" ', [np_options])[0].option_value

		var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value

		var blog_name = alasql('select * from ? where option_name="blogname" ', [np_options])[0].option_value

		var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value

		var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder	

		var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
		var active_footer_client  = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 

		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value


		if(_.size(np_posts) < 1) 
		{
			// no post/page found

			//-->log visitor info > start
			var str_log = 'Warning-> '+ func.DomainURL(req).cur_path
			+'(error msg)-> 404 page '
			+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
			func.log(str_log)	
			//-->log visitor info > end	

			var page_404 = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/404.ejs')
			
			//var site_url = func.DomainURL(req).url

			var page_obj =
			{   
				res:res,
				req:req,
				page_dir:page_404, 

				page_url: site_url+'/404',
				page_title: "404 - Oh nooo can't find your page - "+ blog_name,
				page_description: '',
				page_tags: '',
				post_feature_img:'',
				 
				theme_url:theme_url,

				site_url:site_url,

				have_posts:'',
				 
				post_title: "404 - Oh nooo can't find your page",
				post_url: 'post_url',
				post_dttm: 'post_dttm',
				post_dttm_unix: 'post_dttm_unix',
				post_content: 'post_content',

				post_comments_allow:'',
				post_comments: 'post_comments',
				

				author_name: 'post_author_name',
				author_url: 'post_author_url',

				
				get_sidebar:active_sidebar_client,
				footer_content:active_footer_client,

				active_menu:active_menu
			}

			page_render (page_obj)

			
		}	

		//np_posts
		else if(_.size(np_posts) >0) 
		{

			//-->log visitor info > start
			var str_log = 'GET-> '+ func.DomainURL(req).cur_path 
			+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
			func.log(str_log)	
			//-->log visitor info > end
 
			

			var dir_post = path.join(process.cwd(), '/views/np-content/themes/'+get_theme_folder+'/single.ejs');
			//var dir_page = path.join(process.cwd(), '/views/np-content/themes/'+get_theme_folder+'/page.ejs');
			
			var site_url = site_url
			
			var v1 = np_posts[0]
			
			var post_id = v1.post_id

			var dir_page = theme_page_check(v1.page_template ,get_theme_folder)

			var page_for_posts_id = alasql('select * from ? where option_name="page_for_posts" ', [np_options])



			//--->page_for_posts_id > start
			if(_.size(page_for_posts_id) >0) 
			{
				var get_id =  parseInt(page_for_posts_id[0].option_value)
				if(post_id == get_id)
				{					
					//page is set up to show all blog posts

					var dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/index.ejs')

					npdb.collection('np_posts')
					.find({post_status : "publish", link_access_type:'public',post_type:'post', post_dttm_unix :{$lte:+moment()} })
					.sort( { rec_dttm_unix: -1 } ).toArray(function (err,  data)
					{
						if(_.size(data) < 1) 
						{
							//no posts found
							var v2 = np_posts[0]
							var page_obj =
							{   
								res:res,
								req:req,
								page_dir:dir_post, 								
								

								page_url: site_url,							
								 

								page_title: v2.post_title,							 
								page_description: v2.post_teaser,

								page_tags: v2.post_tags,
								post_feature_img:v2.post_feature_img,
								 
								theme_url:theme_url,

								site_url:site_url,

								have_posts:'',
								 
								post_title: 'post_title',
								post_url: 'post_url',
								post_dttm: 'post_dttm',
								post_dttm_unix: 'post_dttm_unix',
								post_content: 'post_content',

								post_comments_allow:'',
								post_comments: 'post_comments',

								author_name: 'post_author_name',
								author_url: 'post_author_url',

								
								get_sidebar:active_sidebar_client,
								footer_content:active_footer_client,

								active_menu:active_menu
							}

							page_render (page_obj) 

							return false 
						}
						else if(_.size(data) > 0) 			
						{
							var v2 = np_posts[0]

							var paging_data = create_pagination_data
							({
								site_url:site_url,
								np_posts:data,
								np_options:np_options,
								page_id:1
							}) 
							
							var obj1 =
							{ 
								np_posts:paging_data.pg_data_arr,
								np_users:np_users,
								site_url:site_url,
							} 	

							var obj =
							{
								//np_posts:data,
								np_posts:paging_data.pg_data_arr,
								np_users:np_users,
								site_url:site_url,
							} 
							
							have_posts = filter_all_post_data(obj)			

							var page_obj =
							{   
								res:res,
								req:req,
								page_dir:dir_post, 

								page_url: site_url,
								page_title: v2.post_title,
								page_description: v2.post_teaser,
								page_tags: v2.post_tags,
								post_feature_img:v2.post_feature_img,
								 
								theme_url:theme_url,

								site_url:site_url,

								have_posts:have_posts,
								 
								post_title: 'post_title',
								post_url: 'post_url',
								post_dttm: 'post_dttm',
								post_dttm_unix: 'post_dttm_unix',
								post_content: 'post_content',

								post_comments_allow:'',
								post_comments: 'post_comments',

								author_name: 'post_author_name',
								author_url: 'post_author_url',

								
								get_sidebar:active_sidebar_client,
								footer_content:active_footer_client,

								active_menu:active_menu ,
								pagination:paging_data.pg_div
							}

							page_render (page_obj) 


							return false 
						}

					})
					return false 
					 
				}

			}
			//--->page_for_posts_id > end

		 

			//--->regular page > start
		 
			var get_post_type = (v1.post_type).toLowerCase()
			npdb.collection('np_comments').find({post_id : post_id, comment_status : "approved"},{_id: 0}).toArray(function (err,  d2)
			{
				var post_comments
				if(_.size(d2) < 1)
				{
					post_comments = ''

				}
				else if(_.size(d2) > 0)
				{
					//decs order
					//post_comments = _.reverse(d2)

					//asc order
					post_comments = d2

				}

				//update post/page view counter
				npdb.collection('np_posts').updateOne( { post_id: post_id  }, { $inc: { post_views: 1,  }} )
			
				if(get_post_type=='post')
				{
					//do the post stuff here
					

					var page_obj =
					{   
						res:res,
						req:req,
						page_dir:dir_post, 

						page_url: site_url+'/'+v1.post_url,

						//page_title: home_page_title,							 
						//page_description: home_page_description,

						page_title: v1.post_title + ' - '+ home_page_title,
						page_description: v1.post_teaser,
						
						page_tags: v1.post_tags,
						post_feature_img:v1.post_feature_img,
						 
						theme_url:theme_url,

						site_url:site_url,

						have_posts:'',
						
						post_id: v1.post_id, 
						post_title: v1.post_title,
						post_url: v1.post_url,
						post_dttm: v1.post_dttm,
						post_dttm_unix: v1.post_dttm_unix,
						post_content: v1.post_content,

						post_comments_allow:(v1.comments_allow).toLowerCase(),
						post_comments: post_comments,
						

						author_name: v1.post_author_name,
						author_url: v1.post_author_url,

						
						get_sidebar:active_sidebar_client,
						footer_content:active_footer_client,

						active_menu:active_menu 
					}

					page_render (page_obj)

					return false 
				}
				else if(get_post_type=='page')
				{
					//do the page stuff here
									
					var page_obj =
					{   
						res:res,
						req:req,
						page_dir:dir_page, 

						page_url: site_url+'/'+v1.post_url,
						page_title: v1.post_title ,
						page_description: v1.post_teaser,
						page_tags: v1.post_tags,
						post_feature_img:v1.post_feature_img,
						 
						theme_url:theme_url,

						site_url:site_url,

						have_posts:'',
						
						post_id: v1.post_id, 
						post_title: v1.post_title,
						post_url: v1.post_url,
						post_dttm: v1.post_dttm,
						post_dttm_unix: v1.post_dttm_unix,
						post_content: v1.post_content,

						post_comments_allow:(v1.comments_allow).toLowerCase(),
						post_comments: post_comments,
						

						author_name: v1.post_author_name,
						author_url: v1.post_author_url,

						
						get_sidebar:active_sidebar_client,
						footer_content:active_footer_client,

						active_menu:active_menu 
					}

					page_render (page_obj)
					return false 

				}
			}) 
			//--->regular page > end 
			
		}
	})
	 
})


app.get('/category/:id', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	/*
		category is working correctly
	*/

	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' );

	var get_id = req.params.id;

	var site_url = func.DomainURL(req).cur_path;

	if(get_id)
	{
		var slug_id = get_id.toLowerCase(); 

		var np_posts = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_posts')
			.find({post_status : "publish", post_type:'post',link_access_type:'public', post_dttm_unix :{$lte:+moment()}},{_id: 0})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data)
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

		var np_options = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data)
				}			
			})
		})
		
		Promise.all([np_posts,np_users,np_options ]).then(data => 
		{
			var np_posts = data[0]
			var np_users = data[1]
			var np_options = data[2]
			

			var blog_name = alasql('select * from ? where option_name="blogname" ', [np_options])[0].option_value

			var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value

			var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value
			
			var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
			var active_footer_client  = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 

			var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder	

			var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value
			//var site_url = func.DomainURL(req).url


			//-->log visitor info > start
			var str_log = 'GET-> '+ func.DomainURL(req).cur_path
			+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
			func.log(str_log)	
			//-->log visitor info > end
			
			 

			var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder;

			var dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/category.ejs')

			var page_title = 'Category - '+get_id

			var have_posts 

			if(_.size(np_posts) < 1 )
			{
				
				have_posts = ''
			}
			else 
			{	

				var get_categories = alasql('select categories from ? ', [np_posts]);
				
				var arr_found_categories = []
				get_categories.forEach( function(element, index) 
				{
					// statements
					var curr_obj = element.categories;

					var find_category = alasql('select * from ?  where slug=?', [curr_obj, slug_id]) ;

					if(_.size(find_category) > 0)
					{
						var find_post_id = find_category[0].post_id;
						var user_category = alasql('select * from ?  where post_id=?', [np_posts, find_post_id]) ;

						var user_category_found_obj = user_category[0];

						//console.log(user_category_found_obj)

						var get_author_display_name = alasql('select * from ?  where user_id=?', [np_users, user_category_found_obj.post_author_id])[0].display_name;
						//add all of the posts info
						arr_found_categories.push(
						{
							post_id:user_category_found_obj.post_id,
							post_author_id:user_category_found_obj.post_author_id,
							post_author_name:get_author_display_name,
							post_dttm:user_category_found_obj.post_dttm,
							post_dttm_unix:user_category_found_obj.post_dttm_unix,
							post_title:user_category_found_obj.post_title,
							post_url:site_url+'/'+user_category_found_obj.post_url,
							post_teaser:user_category_found_obj.post_teaser,
							post_excerpt:user_category_found_obj.post_excerpt,
							post_feature_img:user_category_found_obj.post_feature_img,
							post_views:user_category_found_obj.post_views,
							comment_counter:user_category_found_obj.comment_counter,
							comments_allow:user_category_found_obj.comments_allow
						})	 			
					} 
				});				
				
				if(_.size(arr_found_categories) < 1 )
				{
					//func.log('Warning-> '+site_url+' (error msg)-> no posts were found under this category' );
					//res.json( {status:'error', msg:'no posts were found under this category',});
					//return false; 
					have_posts = ''
				}
				else if(_.size(arr_found_categories) >0 )
				{
					have_posts  = alasql('select * from ?  order by post_dttm_unix DESC ', [arr_found_categories]) ; 
				}
			}
			
			var page_obj =
			{   
				res:res,
				req:req,
				page_dir:dir_post, 

				page_url: site_url,
				page_title: page_title,
				page_description: '',
				page_tags: '',
				post_feature_img:'',
				 
				theme_url:theme_url,

				site_url:site_url,

				have_posts:have_posts,
				
				post_id: 'post_id', 
				post_title: 'post_title',
				post_url: 'post_url',
				post_dttm: 'post_dttm',
				post_dttm_unix: 'post_dttm_unix',
				post_content: 'post_content',

				post_comments_allow:'',
				post_comments: 'post_comments',
				

				author_name: 'post_author_name',
				author_url: 'post_author_url',
 
				get_sidebar:active_sidebar_client,
				footer_content:active_footer_client,

				active_menu:active_menu
			}

			page_render (page_obj);

		}) 

	} 
	 
})

     

app.get('/search/:id', function(req, res, next) 
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )

	var get_id = req.params.id; 
 

	if(get_id)
	{
		var slug_id = get_id.toLowerCase(); 

		var np_posts = new Promise(function(resolve, reject) 
		{
			var search_string = decodeURIComponent(get_id);

			//need this in order for it to work correctly
			npdb.collection('np_posts').createIndex( { post_content: "text" } );

			var query = 
			{
				$text: {$search:  search_string, $language: 'en'}, 
				post_status : "publish",
				post_type:'post',
				link_access_type:'public', 
				post_dttm_unix :{$lte:+moment()}
			}

			npdb.collection('np_posts')
			.find(query,{_id: false})
			.toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data)
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

		var np_options = new Promise(function(resolve, reject) 
		{
			npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
			{
				if(data) 
				{
					resolve( data)
				}			
			})
		})
		
		Promise.all([np_posts,np_users,np_options ]).then(data => 
		{
			var np_posts = data[0]
			var np_users = data[1]
			var np_options = data[2]
			

			var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value

			var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value
			
			var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
			var active_footer_client  = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 

			var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder	

			//var site_url = func.DomainURL(req).url
			var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value
 
			//-->log visitor info > start
			var str_log = 'GET-> '+ func.DomainURL(req).cur_path
			+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
			func.log(str_log)	
			//-->log visitor info > end
			
			 

			var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder;

			var dir_post = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/search.ejs')

			var page_title = 'Search -'+get_id
 
			

			var have_posts 
			
			if(_.size(np_posts) < 1 )
			{
				//func.log('Warning-> '+site_url+' (error msg)-> no posts were found under this category' );
				//res.json( {status:'error', msg:'no posts were found under this category',});
				//return false; 
				have_posts = ''
			}
			else if(_.size(np_posts) >0 )
			{
				//site_url
				search_data  = alasql('select * from ?  order by post_dttm_unix DESC ', [np_posts]) ; 

				var obj =
				{
					np_posts:np_posts,
					np_users:np_users,
					site_url:site_url,
				} 

				have_posts = filter_all_post_data(obj)			
				 
			}
			//have_posts = np_posts

			var page_obj =
			{   
				res:res,
				req:req,
				page_dir:dir_post, 

				page_url: site_url,
				page_title: page_title,
				page_description: '',
				page_tags: '',
				post_feature_img:'',
				 
				theme_url:theme_url,

				site_url:site_url,

				have_posts:have_posts,
				
				post_id: 'post_id', 
				post_title: 'post_title',
				post_url: 'post_url',
				post_dttm: 'post_dttm',
				post_dttm_unix: 'post_dttm_unix',
				post_content: 'post_content',

				post_comments_allow:'',
				post_comments: 'post_comments',
				

				author_name: 'post_author_name',
				author_url: 'post_author_url',
 
				get_sidebar:active_sidebar_client,
				footer_content:active_footer_client,

				active_menu:active_menu
			}

			page_render (page_obj);

		}) 

	}  
})






//--->for custom 404 error page - start
app.get('*', function(req, res)
{
	//If config file doesn't exist
	if(!func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-config' )
		
	/*
		This has to be the last route in order for it to work

		Look for any:

		1) subdomains
		2) url redirects
		3) any api calls
		4) if all of the above fails, then show 404 page
	*/ 

	//-->log visitor info > start
	var str_log = 'Warning-> '+ func.DomainURL(req).cur_path
	+' error msg(404 page - last route) '
	+' IP('+ip.get(req)+') Referer('+func.referer(req)+')'
	func.log(str_log)	
	//-->log visitor info > end	


	var np_posts = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_posts')
		.find({post_status : "publish", post_type:'post',link_access_type:'public', post_dttm_unix :{$lte:+moment()}},{_id: 0})
		.toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data)
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

	var np_options = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_options').find({autoload:'yes'}).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data)
			}			
		})
	})
	
	Promise.all([np_options ]).then(data => 
	{
		var np_options = data[0]
		
		var get_theme_folder =  alasql('select * from ? where option_name="active_theme" ', [np_options])[0].option_value

		var active_menu = alasql('select * from ? where option_name="active_menu" ', [np_options])[0].option_value

		var active_sidebar_client = alasql('select * from ? where option_name="active_sidebar_client"',[np_options])[0].option_value 
		var active_footer_client  = alasql('select * from ? where option_name="active_footer_client"',[np_options])[0].option_value 

		var theme_url = func.DomainURL(req).url+ '/np-content/themes/'+get_theme_folder	

		var page_404 = func.GetPathTo('/views/np-content/themes/'+get_theme_folder+'/404.ejs')

		var site_url = func.DomainURL(req).url

		var site_url =    alasql('select * from ? where option_name="siteurl" ', [np_options])[0].option_value
	 
			
		var page_obj =
		{   
			res:res,
			req:req,
			page_dir:page_404, 

			page_title: "404 - Oh nooo can't find your page",
			page_description: '',
			page_tags: '',
			 
			theme_url:theme_url,

			site_url:site_url,

			have_posts:'',
			
			post_id: 'v1.post_id', 
			post_title: "404 - Oh nooo can't find your page",
			post_url: 'post_url',
			post_dttm: 'post_dttm',
			post_dttm_unix: 'post_dttm_unix',
			post_content: 'post_content',

			post_comments_allow:'',
			post_comments: 'post_comments',
			

			author_name: 'post_author_name',
			author_url: 'post_author_url',

 		
			get_sidebar:active_sidebar_client,
			footer_content:active_footer_client,

			active_menu:active_menu 
		}

		page_render (page_obj) 

 	})
});
//--->for custom 404 error page - end



//---> data mining functions > start

//--->These are being used above so don't mess or delete them!!! <---

var strip_html_tags = function(stringWithHTML)
{
	//will strip all the html tags.
	
	//this function is being used for meta description(page teaser)

	var str = stringWithHTML.replace(/&nbsp;/g,' ') 
	.replace(/\n/g, " ")
	.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/ig, "")
	return str
}


var filter_all_post_data = function(post_obj)
{
	/*
		var obj ={
			np_posts:np_posts,
			np_users:np_users,
			site_url:site_url,
		}
	*/
	
	var np_posts = post_obj.np_posts
	var np_users = post_obj.np_users
	var site_url = post_obj.site_url

	var arr_data = []
	np_posts.forEach( function(element, index) 
	{
		// statements
		var curr_obj = element

		var get_author = alasql('select * from ?  where user_id=?', [np_users, curr_obj.post_author_id])[0] ;
		arr_data.push(
		{
			post_id: curr_obj.post_id,
			post_author_id: curr_obj.post_author_id,
			
			
			post_author_name: get_author.display_name,
			post_author_url: get_author.user_url, 

			post_dttm:curr_obj.post_dttm,
			post_dttm_unix:curr_obj.post_dttm_unix,
			post_title:curr_obj.post_title,
			post_url:site_url+'/'+curr_obj.post_url,
			post_teaser:curr_obj.post_teaser,
			post_excerpt:curr_obj.post_excerpt,
			
			post_feature_img:curr_obj.post_feature_img.replace("../",site_url+"/"),
			//post_feature_img:curr_obj.post_feature_img.replace("../",site_url.replace('https://','//cdn.')+"/"),
			
			post_views:curr_obj.post_views,
			comment_counter:curr_obj.comment_counter,
			comments_allow:curr_obj.comments_allow
		})	 
	})  
	return arr_data
}



var create_pagination_data = function (obj) 
{
	//This will create page navigation.. i.e. <- Previous 1 ... 4 5 6 .. 15 Nex ->
	var np_posts = obj.np_posts
	var np_options = obj.np_options
	var page_id = obj.page_id
	var site_url = obj.site_url

	//get all the post for total number of post
	var get_posts_data = alasql('select * from ? where post_type="post" order by post_dttm_unix DESC ', [np_posts])
	
	
	//posts per page limit		
	var post_per_page_limit = alasql('select * from ? where option_name="posts_per_page"',[np_options])[0].option_value 

	var sql = 'select * from ? where post_type="post" order by post_dttm_unix DESC LIMIT ' + post_per_page_limit +' '
	var get_limited_posts = alasql(sql, [np_posts])


	var total_posts_count = _.size(get_posts_data)

	var total_posts_limit =  post_per_page_limit

	//hide the pagining if the total post count is less than post limit per page
	var post_limit_vs_total_post_count = total_posts_limit - total_posts_count

	//total posts
	//i.e. 10 posts
	var total_posts_count = _.size(get_posts_data)
	
	//total pages needed to show posts per page(i.e. 3 posts per page)		
	var total_pages_count =    Math.ceil(total_posts_count / post_per_page_limit)

	var create_pagination = ''

	var links = 2

	var start = ( (page_id - links)  ) > 0 ? ( (page_id - links)  ) : 1

	var end = (page_id + links) < total_pages_count ? (page_id + links) : total_pages_count

	
	var get_last_page_number = (total_pages_count - end) + 1

	//--->starting page > start
	if(page_id == 1 )
	{				
		create_pagination +=' '	
	}
	else 
	{
		var page_num = page_id - 1

		if(start <2)
		{
			create_pagination +=' '
		}
		else
		{
			create_pagination +='<li><a href="'+site_url+'/page/'+page_num+'">&larr; Previous</a></li>' 	
		}
	}

	//for spacing triple dots (...)
	if(page_id > 1 )
	{
		if(start <2)
		{
			create_pagination +=' '
		}
		else
		{
			create_pagination +='<li><a href="'+site_url+'/page/1">1</a></li>' 
			create_pagination +='<li class="disabled"><span>...</span></li>' 	
		}
	}
	//--->starting page > end



	for (var i = start; i <= end; i++) 
	{
		var page_num = i  	
	
		if(page_num == page_id)
		{	 
			//for current page
			create_pagination += '<li class="active"><span href="'+site_url+'/page/'+page_num+'">'+page_num+'</span></li>'
		}
		else  
		{
			create_pagination +='<li><a href="'+site_url+'/page/'+page_num+'">'+page_num+'</a></li>' 	
		}
	}

	//--->starting page > start

	//for spacing triple dots (...)
	if(page_id < end )
	{
		if(get_last_page_number < 2)
		{
			create_pagination +=' '
		}
		else
		{
			
			create_pagination +='<li class="disabled"><span>...</span></li>'	
		 
			create_pagination +='<li><a href="'+site_url+'/page/'+total_pages_count+'">'+total_pages_count+'</a></li>' 
		}
		
	}

	if(page_id == end )
	{		
		//create_pagination +='<li class="disabled"><span>&raquo;</span></li>'	
		create_pagination +=' '
	}
	else 
	{
		var page_num = page_id + 1

		if(get_last_page_number < 2)
		{
			create_pagination +=' '
		}
		else
		{
			create_pagination +='<li><a href="'+site_url+'/page/'+page_num+'">Next &rarr;</a></li>'
		}
	}
	//--->starting page > end

	var start_page_num = (page_id * post_per_page_limit) - post_per_page_limit
	
	var end_page_num = start_page_num + parseInt(post_per_page_limit) 

	var d1 = {
		pg_data_arr : get_posts_data.slice(start_page_num, end_page_num),
		pg_div : post_limit_vs_total_post_count < 0 ? create_pagination : ''
	}
	return  d1
}





//---> data mining functions > end