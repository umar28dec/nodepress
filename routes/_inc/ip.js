exports.get = function(req)
{
  /*
    This will get user ip address
    
    Note req has to be part of the call otherwise it won't work.
    
    call it like this: ip.get(rep)


  */
  var ip_info = req.headers['x-forwarded-for'] || 
  req.connection.remoteAddress || 
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;

  var array = ip_info.split(',');
  return array[0];
}

exports.lookup = function(UserIP)
{
  /*
    This will lookup user ip loc info
  */
  var GetURL = 'https://apimk.com/ip?callback=json&ip='+UserIP;

  request(GetURL, function (err,res,body) 
  {
      return body;
  });
}
 