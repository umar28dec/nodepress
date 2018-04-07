exports.GetPostURL = function(req)  
{
    /*
        this will get all the url forward slashes data and will remove the first occurrence of slash
        i.e. if url is (nodpressjs.com/hello-word/doc), it will return: hello-word/doc

    */
    
    var string  = (req.originalUrl).toLowerCase();
    //var str = string+'/'
    var d1 =  (string.match(/\/(.*)/))[1]
    var d2 = d1.replace(/\//g, ',')
    var d3 = d2.split(",");
    var arr = []
    d3.forEach( function(element, index) 
    {
        if(element)
        {
            arr.push({url: element})     
        }       
    });
    
    if(arr.length > 1)
    {   

        var id = arr[0].url+',';
        var re = new RegExp(id, 'g');
        var d4 = d2.replace( re, "");

        var d5 = d4.replace(/,/g,'/')
     
        console.log('d4 '+d5 )
    }
  

    return {first_url:arr[0].url, url_arr: arr};   
}

exports.GetFileName = function(FileURL)
{
    var GetFileName = FileURL.substring( FileURL.lastIndexOf('/')+1 );
    var RemoveFileExt = GetFileName.split('.')[0];
    return RemoveFileExt;
}

exports.GetFileExt = function(FileURL)
{
    return FileURL.split('.').pop().toLowerCase();
}

var GetDomainName = function(url)
{
   var sourceString = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
    return sourceString; 
}

exports.referer = function(req)  
{
	/*
    return req.headers.referer  ? req.headers.referer : 'direct';

    */
    var get_ref = req.headers.referer

    var result 
 
    if(_.size(get_ref) <1 )
    {
        result = 'direct'
    }
    else if(_.size(get_ref) > 0)
    {
        var get_ref_domain = GetDomainName(get_ref)
        
        var url  = get_ref
        var get_ref_url_path = url.split("/")[url.split("/").length-1]
        
        
        var get_site_domain = GetDomainName(req.protocol + '://' + req.get('host')) 


        if(get_ref_domain  != get_site_domain)
        {

            result = get_ref
        }
        else if(get_ref_domain == get_site_domain)
        {

            //result = req.originalUrl
            result = get_ref_url_path ? get_ref_url_path : '/'
        }
    }
   
    return result
    
    //return req.headers.referer  ? req.headers.referer : 'direct';
}
exports.log = function(entrytype)  
{
    var dttm = moment().tz('America/New_York').format('YYYY-MM-DD h:mm:ss a');
    console.log('[ '+dttm + ' ] '+  entrytype)
}

exports.RootDir = function()  
{
    /*
        need this in case if node js changes this in the futurn to something else.
        you would just change it here instead of all of the different files through 
        out the NodePress JS CMS
    */

    //--->will root directory path... i.e where "app.js/server.js" file is
    return process.cwd();
    
}
exports.GetPathTo = function(file_path)  
{
    /*
        need this in case if node js changes this in the futurn to something else.
        you would just change it here instead of all of the different files through 
        out the NodePress JS CMS
    */
    //will join the path from root directory to user define path
    return path.join(func.RootDir(), file_path);
}


exports.DomainURL = function(req)  
{
    return  {   
        //url: req.protocol + '://' + req.get('host'),
        url: '//' + req.get('host'),
        pathname: req.originalUrl,
        cur_path: '//' + req.get('host') + req.originalUrl,         
    } ;
}

exports.HashPassword = function(secret)  
{
    return crypto.createHmac('sha512', secret)
    .update('nodepress js')
    .digest('hex');
}

exports.GetRandomID = function (len) 
{
    /*
        - will generate random string(numbers and letters only) 
          between 9 to 12 character long
        - if no len is provided, it will ignore the len parameter
          and give max length string
    */   
    return Math.random().toString(36).substr(2,len) ;
};

exports.AutoID = function(strlen)  
{
	var code_len = '';
	if(strlen)
	{
		//var code_len = 'x';
		for (var i = 0; i < strlen; i++) 
		{
			//code_len.concat(code_len);
			code_len +='x'
		};
	}
	else 
	{
		code_len ='xxxxxxxx'
	}

    var d = new Date().getTime();
    if(process.hrtime() && typeof process.hrtime() === "function"){
        d += process.hrtime();; //use high-precision timer if available
    }
    //var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
    var uuid = code_len.replace(/[xy]/g, function(c) 
    {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;

}

exports.IsEmail = function(value)  
{
 
    var regexp = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return !regexp.test(value);
}

exports.IsEmpty = function(value)
{
	var regexp  = /\S+/;
	return !regexp.test(value);
}

exports.IsURL = function (value) 
{
  var regexp = /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i			
  return !regexp.test(value);
}

exports.IsJSON = function (something) 
{
  if (typeof something != 'string')
        something = JSON.stringify(something);
    try {
        JSON.parse(something);
        return true;
    } catch (e) {
        return false;
    }
}