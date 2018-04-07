

//--->create/update sitemap xml > start
//site_map.CreateXMLFile(req)
exports.CreateXMLFile = function(req)
{
	var np_terms = new Promise(function(resolve, reject) 
	{
		npdb.collection('np_terms').find().toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		});
	});

	var np_posts = new Promise(function(resolve, reject) 
	{
		//post_dttm_unix :{$lte:+moment()}
		npdb.collection('np_posts')
		.find({post_status : "publish",link_access_type : "public",  })
		.sort( { rec_dttm_unix: -1 } ).toArray(function (err,  data)
		{
			if(data) 
			{
				resolve( data);
			}			
		});
	});

	Promise.all([np_posts]).then(function(results) 
	{
		//Make sure all promises done!

		var np_posts = results[0]
		//var np_terms = results[1]

		if(_.size(np_posts) < 1)
		{
			return false
		}

		var get_all_posts 		= alasql('select post_url from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_pages 		= alasql('select post_url from ? where post_type="page" order by post_dttm_unix DESC', [np_posts]) 
		var get_all_categories 	= alasql('select categories from ? where post_type="post" order by post_dttm_unix DESC', [np_posts]) 

		
		var get_site_url = req.protocol + '://' + req.get('host')+'/'

		var file_name = func.GetPathTo('/views/sitemap.xml')

		var file_text = ''
		file_text += '<urlset xmlns="'+get_site_url+'sitemap/0.9">'


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

		fs.writeFileSync(file_name, file_text )
	})
}
//--->create/update sitemap xml > start
