/*
	Here you will find all the table/collection structure.	
	
	Notes: 
	+moment() = unix timestamp down to millisecond. i.e 1360013296123

	Wordpress Database description:

	https://codex.wordpress.org/Database_Description#Database_Diagram
	
*/


//--->this will collection/table will be created on the fly 
var np_token =  
{
	token_id: +moment(),
	token_name: 'admin_token',
	token_value: HashPassword(+moment() + LoginID), //<---LoginID = user id
	token_expire_value: +moment().add(24, 'h'), //<---will expire in 24 hrs after login
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()
} 


//--->below collections/tables are create duing the configure installation process

var np_users =  
{
	user_id: +moment(),
	user_login: 'UserID', 
	user_pass: 'func.HashPassword(UserPassword)',
	user_email: 'UserEmail', 
	user_url:  'site_url', 
	user_access_type: 'admin',
	display_name: 'Nodepress JS Site', 
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()
} 



/*
	page_for_posts = to set a specific page for posts
	page_on_front =  to set a specific page for index.. i.e. sale's page
	
	store these in np_option 
	i.e 
	
	option_name: 'page_for_posts',
	option_value: '10',//<--- post id 
	autoload:'yes',

	option_name: 'page_on_front',
	option_value: '100',//<--- post id 
	autoload:'yes',

	if none are set, then it should go to index page.

*/





//for categories/post tags
var np_terms = 
{
	term_id:+moment(),
	name: 'Uncategorized',
	slug:'uncategorized',
	term_type:'category', //<---category/post_tag
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()
}

var np_terms_relationships = 
{
	term_id:term_id //<--- from np_terms
	post_id: post_id, //<--- from np_posts
}

var np_options =  
{
	option_id: +moment(),
	option_name: 'siteurl',
	option_value: 'http://mysite.com',
	autoload:'yes',//--->yes/no 
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()
} 


//for post & pages
var np_posts= 
{
	post_id: +moment(), 
	post_author_id: 'user_id', //<--- from np_users
	
	post_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	post_dttm_unix: +moment(),
	
	post_title: 'Hello World',
	post_url: 'hello-world',	
	
	post_teaser: 'This is my hello world post teaser', //<--- will be used as meta description
	post_tags: 'nodepress js, node, press,js', //<--- for seo purposes will go into post/page metadata
	
	post_excerpt: 'Read More',	
	post_content: 'I love NodePress JS CMS! It is awesome',

	post_status:'publish', 
	/*
		below are the different post statuses
		
		draft 	- a post in draft status
		pending - post is pending review
		publish - a published post or page
		trash 	- post is in trashbin.
	*/

	link_access_type: 'public', 
	/*
		below are the different link access type:

		public - visiable to everyone and will be added to site map for search engines to index
		link access - can only be viewed with direct link and will exclude site map(search engines won't be able to find it)
	*/

	post_feature_img: '',//<-- link to image saved in "np-content/uploads/"
	page_template: 'default', //<---
	post_type: 'post',//<--- post/page 
	categories: '',
	/*
		var categories_obj =
	    {
	    	post_id: post_id,
			term_id: 1,
			name: 'Uncategorized',
			slug:'uncategorized',
    	}
	*/
 	post_views: 0,
	comment_counter:0, //<---indicates total number of comments for post 
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()
}


var  np_comments =
{
	comment_id:+moment(),
	post_id:post_id, //<---coming from np_posts
	
	comment_author: '',
	comment_author_email: '',
	comment_author_url: '',
	comment_author_ip: '',
	comment_content: '',
	comment_status: 'pending', //<--- pending/approved
	rec_dttm: moment().format("YYYY-MM-DD h:mm:ss a"),
	rec_dttm_unix: +moment()

}
