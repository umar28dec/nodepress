

exports.header_files = function()  
{
	//var site_root_url = func.DomainURL(req).url + '/';

	npdb.collection('np_options').find({option_name: "active_plugins"}).toArray(function (err,  data)
	{
		var np_header = ''
		np_header +='<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">\n'
		np_header +='<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript"></script>\n'
		np_header +='<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js" type="text/javascript"></script>\n'

		if(_.size(data) >0) 
		{
			data.forEach(function (ele) 
			{
				//var obj = JSON.parse(ele.option_value)
				var obj = ele.option_value
				obj.forEach(function(ele2)
				{
					
					np_header +='<script src="'+ele2.plugin_url+'" type="text/javascript"></script>\n'
				})
				
			})
		}
		return np_header


	})

	/*
	var np_header = ''
	+'<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">\n'	
	+'<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript"></script>\n'
	+'<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js" type="text/javascript"></script>\n'
	
	+'<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.css">\n'
	+'<script src="//cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js" type="text/javascript"></script>\n'

	+'<script src="//apimk.com/cdn/awesome-functions/awesome-functions-mini.js" type="text/javascript"></script>'


	//+'<script src="../np-core/js/np-core.js" type="text/javascript"></script>\n'
	+'<script src="../np-content/plugins/plugin.mini.js" type="text/javascript"></script>\n'
	//+'<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">'

    return np_header;
    */
}

exports.footer_files = function()  
{
	var np_footer = ''
	+'<script src="../np-core/js/np-core.js" type="text/javascript"></script>'
	+'<script src="//apimk.com/cdn/awesome-functions/awesome-functions-mini.js" type="text/javascript"></script>'

    return np_footer;
}