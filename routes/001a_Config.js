
app.get('/np-config', function(req, res, next) 
{ 
	func.log('np-config')
	var config_check = func_db.db_config_file_check() 
 

	if(config_check)
	{
		res.redirect(func.DomainURL(req).url);
	 	return false; 
	}
	else if (! config_check) 
	{
		var admin_url_dir = func.DomainURL(req).url + '/np-admin/' ;
		var site_root_url = func.DomainURL(req).url + '/';

		var dir = path.join(process.cwd(), '/views/np-admin/np-config');

		res.render(dir, 
		{  
			admin_url_dir: admin_url_dir,
			site_root_url:site_root_url,
			page_title: 'NodePress &rsaquo; Setup Configuration File'
		}); 
		return false; 
	}
});


app.post('/np-config/connection-check', function(req, res, next) 
{
	//If config file doesn't exist
	if(func_db.db_config_file_check() ) return res.redirect( func.DomainURL(req).url + '/np-admin' );

	var SiteTitle 		= req.body.SiteTitle;
	var UserID 			= req.body.UserID;
	var UserPassword 	= req.body.UserPassword;
	var UserEmail 		= req.body.UserEmail;
	var DBConnURL 		= req.body.DBConnURL;

	var site_url		= func.DomainURL(req).url;
	
	func.log('connection-check')

	if(!DBConnURL)
	{
		res.json({ status:"error",msg:'No Database URL' } );
		 
	}
	else if(DBConnURL)
	{

		MongoClient.connect(DBConnURL, (err, database) => 
		{
			if (err) 
			{ 
				res.json({ status:"error",msg:"Can't connect to your mongodb" } ) 
				return console.log(err) 
			};
			
			//Check to see if the database already exist

			var user_data_check = new Promise(function(resolve, reject) 
			{
				database.collection('np_users').find().toArray(function (err, data)
				{
					resolve(data);
				});
			});
			
 			user_data_check.then(function(data)
			{
				//console.log(data)
				if(_.size(data) >0)
				{
					//Already installed the database
					
					res.json({ status:"success",   site_url:site_url+'/np-admin',  } );
					CreateConfigFolderFile (DBConnURL,site_url) ;
					return false;
				}
				else
				{
					return data;
				}

			}).then(function(data)
			{
				//New install
				if(!data) return false;

				/*
					Create collections/tabls:
					- np_users = will hold user info
					- np_terms = will hold categories info							
					- np_options = will hold info about site and this is where developers can store info about their themes and plugins
					- np_posts = will hold posts and pages info
					- np_comments = will hold comments info
				*/
				var const_id =  +moment();

				//--->create user collection/table - start
				var np_users =  
				{
					user_id:const_id,
					user_login: UserID, 
					user_pass: func.HashPassword(UserPassword),
					user_email: UserEmail, 
					user_url:  site_url, 
					user_access_type: 'admin',
					display_name: UserID, 
					rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
					rec_dttm_unix: +moment(),
				} 
				database.collection('np_users').insert(np_users);
				//--->create user collection/table - end

				

				//--->create terms/categroies collection/table - start
				var np_terms = 
				{
					term_id: 1,
					name: 'Uncategorized',
					slug:'uncategorized',
					term_type:'category',
					rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
					rec_dttm_unix: +moment()
				}
				database.collection('np_terms').insert(np_terms);
				//--->create terms/categroies collection/table - end




				//--->create terms_relationships collection/table - start
				var np_terms_relationships = 
				{
					term_id:const_id,
					post_id: const_id,
				}
				//database.collection('np_terms_relationships').insert(np_terms_relationships);
				//--->create terms_relationships collection/table - end


				//--->create options collection/table - start
				var np_options = 
				[
					{
						option_id: +moment(),
						option_name: 'siteurl',	
						option_value: site_url,	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					}, 
					{
						option_id: +moment(),	
						option_name: 'blogname',	
						option_value: SiteTitle,	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'admin_email',	
						option_value: UserEmail,	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'home_page_title',	
						option_value: SiteTitle,	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'home_page_description',	
						option_value: 'Just another awesome blog',	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'active_theme',	
						option_value: 'nodepress-js-theme',	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'posts_per_page',	
						option_value: 10,	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'post_comments_allow',	
						option_value: 'yes',	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id: +moment(),	
						option_name: 'active_menu',	
						option_value: '<li><a class="menu_item_list_group fa fa-home" href="'+ req.protocol + '://' + req.get('host') +'/" target="_self" >  Home</a></li>',	
						autoload:'yes',
						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment(),
					},
					{
						option_id : +moment(),
						option_name : "active_sidebar_client",
						option_value :  '',
						autoload : "yes",
						rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix : +moment()
					},
					{
						option_id : +moment(),
						option_name : "active_sidebar_server",
						option_value :  '',
						autoload : "yes",
						rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix : +moment()
					},
					{
						option_id : +moment(),
						option_name : "active_footer_client",
						option_value :  '',
						autoload : "yes",
						rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix : +moment()
					},
					{
						option_id : +moment(),
						option_name : "active_footer_server",
						option_value :  '',
						autoload : "yes",
						rec_dttm : moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix : +moment()
					}


					
				]
				database.collection('np_options').insertMany(np_options);
				//--->create options collection/table - end


				//--->create posts collection/table - start
				var np_posts= 
				[
					{
						post_id: const_id, 
						post_author_id: const_id, //<--- from np_users
						
						post_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						post_dttm_unix: +moment(),
						
						post_title: 'Hello World',
						post_url: 'hello-world',	
						
						post_teaser: 'This is my hello world post teaser', //<--- will be used as meta description
						post_tags: 'nodepress js, node, press,js', //<--- for seo purposes will go into post/page metadata
						

						post_excerpt: 'Read More',	
						post_content: 'I love NodePress JS CMS! It is awesome...',
						post_status:'publish', 	
						link_access_type: 'public',
						
						post_feature_img: '../np-content/uploads/nodepress-js.png',//<-- link to image saved in "np-content/uploads/"
						page_template: 'default', //<---
						post_type: 'post',//<--- post/page 
						categories: [{
							post_id: const_id,
							term_id: 1,
							name: 'Uncategorized',
							slug:'uncategorized',
						}],
					 	post_views: 0,
					 	comments_allow: 'yes',

						comment_counter:1, //<---indicates total number of comments for post/page

						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment()
					},
					{
						post_id: +moment(), 
						post_author_id: const_id, //<--- from np_users
						
						post_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						post_dttm_unix: +moment(),
						
						post_title: 'Example Page',
						post_url: 'example-page',	
						
						post_teaser: 'This is my hello world post teaser', //<--- will be used as meta description
						post_tags: 'nodepress js, node, press,js', //<--- for seo purposes will go into post/page metadata
						

						post_excerpt: '',	
						post_content: 'This is a example page.. ',
						post_status:'publish', 

						link_access_type: 'public',	

						
						post_feature_img: '../np-content/uploads/nodepress-js.png',//<-- link to image saved in "np-content/uploads/"
						page_template: 'default', //<---
						post_type: 'page',//<--- post/page 
						categories:'',
					 	post_views: 0,
					 	comments_allow: 'no',
						comment_counter:0, //<---indicates total number of comments for post/page

						rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
						rec_dttm_unix: +moment()
					},
				]
				database.collection('np_posts').insertMany(np_posts);
				
				//--->create posts collection/table - end

				//--->create comments collection/table - start
				var  np_comments =
				{
					comment_id:+moment(),
					post_id:const_id, //<---coming from np_posts
					
					comment_author: 'A NodePress JS Commenter',
					comment_author_email: 'np@nodepressjs.com',
					comment_author_url: 'https://nodepressjs.com/',
					comment_author_ip: '',
					comment_content: '<p>Hi, this is a comment.<br />To get started with moderating, editing, and deleting comments, please visit the Comments screen in the dashboard.<br />',
					comment_status: 'approved', //<--- pending/approved
					rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
					rec_dttm_unix: +moment()

				}
				database.collection('np_comments').insert(np_comments);
				//--->create comments collection/table - end

				res.json({ status:"success",   site_url:site_url+'/np-admin',  } );
				CreateConfigFolderFile (DBConnURL,site_url);

				Create_Robots_Files(req)
				
				
			})	
			
		})
	}
})


var Create_Robots_Files = function(req)
{
	var get_site_url = req.protocol + '://' + req.get('host')
	
	var file_name = func.GetPathTo('/views/robots.txt')

	var file_text = ''
	+'User-agent: * \r\n'
	+'\r\n'
	+'Crawl-delay: 10 \r\n'
	+'\r\n'
	+'Disallow: /np-admin/ \r\n'
	+'\r\n'
	+'Sitemap: '+get_site_url+'/sitemap\r\n'

	fs.writeFileSync(file_name, file_text )
}

var CreateConfigFolderFile = function  (DBConnURL,site_url) 
{
	//create np-config.json	
	var np_config_file = 
	{
		db_conn:DBConnURL,
		sit_url: site_url
	}

	//make a folder

	var mk_dir = func.GetPathTo('/db_conn')
	
	fs.mkdirSync(mk_dir)

	//create file
	var file_name = func.GetPathTo('/db_conn/np-config.json')


	fs.writeFileSync(file_name, JSON.stringify(np_config_file, null, 2) )
}

