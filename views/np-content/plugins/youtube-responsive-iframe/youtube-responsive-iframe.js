$(document).ready(function()
{
    //load functions
    YouTubeiFrameEmbedResponsive()
})


var GetDomainName = function(url)
{
   var sourceString = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
    return sourceString; 
}
 

var YouTubeiFrameEmbedResponsive = function ()
{
    /*
        this will make the youtube video iframe fit the div and be responsive
    */
    var iframe_check = $("iframe")
    
    if(iframe_check.length > 0)
    {
	    $("iframe").each(function() 
	    {         
	        var get_src = $(this).attr('src');
	        
	        var domain_name = GetDomainName(get_src);
	 
	        var get_host = parseURL(get_src).host

	        if(domain_name=='youtube.com' || get_host=='youtube')
	        {
	            var strDiv = ''
	            +'<div class="embed-responsive embed-responsive-16by9">'
	                +'<iframe class="embed-responsive-item" src="'+get_src+'" allowfullscreen="allowfullscreen"></iframe>'
	            +'</div>';
	            $(this).before(strDiv);
	            $(this).remove();
	        } 
	    });
	}
}

var parseURL = function (url)
{
    parsed_url = {}

    if ( url == null || url.length == 0 )
        return parsed_url;

    protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0,protocol_i);

    remaining_url = url.substr(protocol_i + 3, url.length);
    domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    domain_parts = parsed_url.domain.split('.');
    switch ( domain_parts.length )
    {
        case 2:
          parsed_url.subdomain = null;
          parsed_url.host = domain_parts[0];
          parsed_url.tld = domain_parts[1];
          break;
        case 3:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}