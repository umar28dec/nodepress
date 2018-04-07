//--->data mining functions > start

//--->bs alerts > start
var np_show_error = function (errorText,ElementObjID) 
{
    var strDiv = ''; 
    strDiv += '<div class="derr">';     
    strDiv += '<div class="alert alert-danger  form-control" style="padding:5px;font-size:14px"  > <i class="fa fa-exclamation-triangle "></i>  '+ errorText+'</div>';
    strDiv += '</div>';
        
    ElementObjID.after(strDiv);
    ElementObjID.css( "background-color", "yellow");
    ElementObjID.focus();
}

var np_clear_error = function ()
{
    $( ".derr" ).prevAll().css( "background-color", "");   

    //In case if remove (above) doesn't work
    $(".derr").hide();
    $(".derr").remove();
} 

var np_alert_msg = function (Msg,AlertType)
{ 
    //There are 4 types of alerts: success, info, warning and danger

    var Type = AlertType.toLowerCase(); 
    var TypeAlert; 
    if(Type == 'success')
    {
      TypeAlert = 'alert-success';
    }
    if(Type == 'error')
    {
      TypeAlert = 'alert-danger';
    }
    if(Type == 'info')
    {
      TypeAlert = 'alert-info';
    }
    if(Type == 'warning')
    {
      TypeAlert = 'alert-warning';
    } 
    var strDIV  = '';
    strDIV += '<div class="derr alert '+TypeAlert+'"  >'; 
    strDIV += '<div   style="padding:5px;font-size:16px">';
    strDIV += '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';    
    strDIV += Msg; 
    strDIV  +=  '</div>'; 
    strDIV  +=  '</div>';
    return strDIV;
}
//--->bs alerts > end


//--->group by > start
Array.prototype.groupBy = function(prop) 
{
    return this.reduce(function(groups, item) 
    {
        var val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {});
}
//--->group by > end


var np_get_site_url = function ()
{
    //var str_url = location.protocol + '//' + location.host+ '/'
    var str_url = '//' + location.host+ '/'; 
    return str_url ;
}

var np_size = function (collection) 
{ 
    //var len = collection.toString();
    if(!collection)
    {
        return 0;
    }
    
    var str = typeof(collection);  

    if(str ==="number" || str ==="string")
    {
      var d1 = str.toString();
      return collection.toString().length;
    }
    else if(str ==="object" || str ==="array")
    {       
      return Object.keys(collection).length;
    }     
} 


var np_format_view_count = function (num,decimalpoint) 
{
    if(num != '')
    { 
        var result;
        if(num<=0)
        {
            result = num; 
        }
        else  if (num >= 0 && num<999) 
        {
            //format to thousand
            result = num; 
        }
        else  if (num >= 1000 && num<999999) 
        {
            //format to thousand
            result =  (num / 1000).toFixed(decimalpoint).replace(/\.0$/, '') + 'K';
        }
        else if (num >= 1000000) 
        {
            //format to million
            result =    (num / 1000000).toFixed(decimalpoint).replace(/\.0$/, '') + 'M';
        }  
        return result;
    }
}

//--->cookie functions > start
var cookies = function(){}; 
cookies.Enable = function () 
{
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;

    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled)
    { 
        document.cookie="testcookie";
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return (cookieEnabled);
}

cookies.Add = function (cname, cvalue, exdays) 
{
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

cookies.Get = function (cname) 
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) 
    {
        var c = ca[i];
        while (c.charAt(0)==' ') 
        {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) 
        {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

cookies.AddObjArr = function (cname, cvalue, exdays) 
{
    var cookie_expire = exdays ? exdays : (1*24*60*60*1000)
    var d = new Date();    
    d.setTime(d.getTime() + cookie_expire);
    var expires = "expires="+ d.toUTCString();
    var ObjArrVal = JSON.stringify(cvalue); 
    document.cookie = cname + "=" + ObjArrVal + "; " + expires;
}

cookies.GetObjArr = function (cname) 
{
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) 
    {
      var c = ca[i];
      while (c.charAt(0)==' ') 
      {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) 
      {
        var val = c.substring(name.length,c.length); 
        return JSON.parse(val) ;
      }
    }
    return "";
}

cookies.Delete = function(name) 
{
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

//--->cookie functions > end


//--->localstorage functions > start
var np_ls_add = function(LookUpIndexKey,Val)
{
    localStorage.setItem(LookUpIndexKey,Val);
}

var np_ls_get = function(LookUpIndexKey)
{
    return localStorage.getItem(LookUpIndexKey);
}

var np_ls_delete = function (LookUpIndexKey) 
{     
    localStorage.removeItem(LookUpIndexKey);     
}
//--->localstorage functions > end

var np_get_expire_timer = function (obj) 
{ 
    var expire_time = Date.now();
    if(obj.milisec)
    {
        expire_time += obj.milisec; 
    }
    else if(obj.sec)
    {
        expire_time += 1000*obj.sec; 
    }
    else if(obj.min)
    {
        expire_time += 1000*60*obj.min; 
    }
    else if(obj.hr)
    {
        expire_time += 1000*60*60*obj.hr; 
    }
    else if(obj.day)
    {
        expire_time += 1000*60*60*24*obj.day; 
    } 
    expire_time = new Date(expire_time);
    return  {unix:expire_time.getTime(), iso: expire_time.toISOString()};
}

var np_check_expire_timer = function (get_time) 
{ 
    return new Date(get_time).getTime() - new Date().getTime();
}

var np_get_id = function  (len)
{   
    return Math.random().toString(36).substr(2,len);
}

var np_is_mobile = function () 
{
    var a = navigator.userAgent || navigator.vendor || window.opera
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
} 

var np_random_pick = function (collection) 
{
    var d1; 

    if(typeof(collection) != 'object')
    {
        d1 = collection;
    }
    
    else if(typeof(collection) == 'object')
    { 
        if(Array.isArray(collection))
        {
            d1 = collection[Math.floor((Math.random()*collection.length))];
        }
        else
        {
            d1 = collection;
        }
    }
    return d1;
} 
 
var np_convert_to_qry_str = function (collection) 
{
    var url;
    var arr1 = [];
    if(Array.isArray(collection))
    {
        collection.forEach(function(ele)
        { 
            if(typeof(ele) != 'object')
            {
                arr1.push(encodeURIComponent(ele));
            }
            else if(typeof(ele) == 'object')
            { 
                var obj = ele;
                for(var p in obj)
                {
                   if (obj.hasOwnProperty(p)) 
                   {
                       arr1.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                   }
                }
            }
        })
        url = arr1.join('&');           
    }
    else
    { 
        var obj = collection;
        for(var p in obj)
        {
           if (obj.hasOwnProperty(p)) 
           {
               arr1.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
           }
        }
        url = arr1.join('&');            
    }
    return url;
}

var np_sm_ajax = function (ajax_obj, cb) 
{
    //call i.e. np_sm_ajax({url:'mysite.com/api',type:'get',data:{user_id:'myuserid'}},function(data){console.log(data);})
    //ajax call variables
    var call_type = (ajax_obj.type).toLowerCase();      
    var call_data = ajax_obj.data;
    var call_url;

    //convert json data into query string
    var params
    if(call_type == 'get')
    { 
        //for get request only
        if(!call_data)
        {
            call_url = ajax_obj.url;
        }
        else if(call_data)
        {
            if(typeof(call_data) == 'string')
            {
                call_url = ajax_obj.url +'?'+ call_data;
            }
            else
            {                    
                call_url = ajax_obj.url +'?'+  np_convert_to_qry_str(call_data);                   
            }
        }
    }
    else
    {
        //for request > post/put/delete
        call_url = ajax_obj.url;
        params = JSON.stringify(call_data);
    }

    var xhttp; 
    xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhttp.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
        {           
            try 
            {
                cb_data =  JSON.parse(this.responseText);
            } catch (e) 
            {
                // Oh well...send it as is
                cb_data = this.responseText;
            }
            cb(cb_data);            
        }
    };
    xhttp.open(call_type, call_url, true);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    call_data ? xhttp.send(params) : xhttp.send();
}


var np_include_once = function(FileURL)
{
    var get_file_type = FileURL.split('.').pop().toLowerCase();

    //--->do js > start
    if(get_file_type == 'js')
    {
        var get_links    = document.getElementsByTagName('script');

        //--->loop through all the links > start
        var arr = []
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i]; 
            var link = v1.src;

            if(link == FileURL)
            {   
                arr.push(FileURL);
            }
        } 
        //--->loop through all the links > end

        //--->add to header > start
        if(arr.length < 1)
        {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = FileURL;
            script.type = 'text/javascript';
            script.setAttribute('async','true');
            head.appendChild(script);
        }
        //--->add to header > end
    }

    //--->do js > end


    //--->do css > start
    if(get_file_type == 'css')
    {
        var get_links    = document.getElementsByTagName('link');

        //--->loop through all the links > start
        var arr = []
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i]; 
            var link = v1.href;

            if(link == FileURL)
            {       
                arr.push(FileURL);
            }
        } 
        //--->loop through all the links > end

        //--->add to header > start
        if(arr.length < 1)
        {
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('link');
            script.href = FileURL;
            script.rel = 'stylesheet';
            script.setAttribute('async','true');
            head.appendChild(script)
        }
        //--->add to header > end
    }
    //--->do css > end
}

var np_is_included = function(FileURL)
{
    var get_file_type = FileURL.split('.').pop().toLowerCase();

    //--->do js > start
    if(get_file_type == 'js')
    {
        var get_links    = document.getElementsByTagName('script');

        //--->loop through all the links > start
        var arr = [];
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i]; 
            var link = v1.src;

            if(link == FileURL)
            {   
                arr.push(FileURL);
            }
        } 
        //--->loop through all the links > end

        //--->found file in header > start
        if(arr.length > 0)
        {
            return arr;
        }
        //--->found file in header > end
    }

    //--->do js > end


    //--->do css > start
    if(get_file_type == 'css')
    {
        var get_links    = document.getElementsByTagName('link');

        //--->loop through all the links > start
        var arr = []
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i]; 
            var link = v1.href;

            if(link == FileURL)
            {       
                arr.push(FileURL);
            }
        } 
        //--->loop through all the links > end

        //--->found file in header > start
        if(arr.length > 0)
        {
            return arr;
        }
        //--->found file in header > end
    }

    //--->do css > end

    return false;
}

var np_remove_once = function(FileURL)
{
    var get_file_type = FileURL.split('.').pop().toLowerCase();

    //--->do js > start
    if(get_file_type == 'js')
    {
        var get_links    = document.getElementsByTagName('script');

        //--->loop through all the links > start
        var arr = []
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i]; 
            var link = v1.src;

            if(link == FileURL)
            {   
                arr.push(FileURL);
                v1.parentNode.removeChild(v1);
            }
        } 
        //--->loop through all the links > end        
    }
    //--->do js > end


    //--->do css > start
    if(get_file_type == 'css')
    {
        var get_links    = document.getElementsByTagName('link');

        //--->loop through all the links > start
        var arr = [];
        for (var i = 0; i < get_links.length; i++) 
        {
            var v1 =  get_links[i];
            var link = v1.href;

            if(link == FileURL)
            {       
                arr.push(FileURL);
                v1.parentNode.removeChild(v1);
            }
        } 
        //--->loop through all the links > end 
    }
    //--->do css > end
}
var np_parse_url = function(get_url) 
{
 
    parsed_url = {}
    
    var url
    if(!get_url)
    {
        url = window.location.href; 
    }
    else
    {
        url = get_url; 
    }    

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
          parsed_url.subdomain = domain_parts[0] == 'www' ?  null : domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2];
          break;
        case 4:
          parsed_url.subdomain = domain_parts[0] == 'www' ?  null : domain_parts[0];
          parsed_url.host = domain_parts[1];
          parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
          break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;


    function getUrlVars(url) 
    {   
        var decodedUrl = decodeURIComponent(url);
        var any_param = decodedUrl.indexOf('?'); 
        if(any_param >  0)
        {
             any_param = decodedUrl.slice(decodedUrl.indexOf('?') + 1);
            var hashes = any_param.split('&');
            
            var merged = {};
            var hash;        

            for(var i = 0; i < hashes.length; i++) 
            {
                var res = {};
                hash = hashes[i].split('=');  

                if(hash.length > 0)
                {
                    res[hash[0]] = hash[1];
                    Object.assign(merged, res );
                }
            }            
            if(hashes.length > 0)
            {
                return merged;    
            }
        }
        else
        {
            return null; 
        }
    }

    return Object.assign(parsed_url, {qry_str : getUrlVars(url)});
}

np_bs_tab = function (ObjArr)
{ 
    /* 
      Will create a Bootstrap tab screen

      //example tab data array
      var arr = [ 
        {tab_name:'tab 1', tab_content: "this is my tab 1 contain is"},
        {tab_name:'tab 2', tab_content: "this is my tab 2 "},
      ]
    */
    //Get object Arr
    var arr = ObjArr; 

    var id  = Math.random().toString(36).substr(2)

    //--->get tab name - start
    var strTabName = '';
    strTabName +='<ul class="nav nav-tabs" role="tablist">';
    arr.forEach( function(element, index) 
    {
      var tab_id =  (element.tab_name).replace(/[^\w]+/g, '-') +'-id-'+id
      var tab_name = element.tab_name
      if(index <1)
      {
        strTabName +='<li role="presentation" class="active"><a href="#'+tab_id+'"  role="tab" data-toggle="tab">'+tab_name+'</a></li>'
      }
      else
      {
        strTabName +='<li role="presentation"><a href="#'+tab_id+'"  role="tab" data-toggle="tab">'+tab_name+'</a></li>'
      }
       
    });
    strTabName +='</ul>';
    //--->get tab name - end

    //--->get tab content - start
    var strTabContent = '';
    strTabContent +='<div class="tab-content" style="padding:10px;">';
    arr.forEach( function(element, index) 
    {
      var tab_id =  (element.tab_name).replace(/[^\w]+/g, '-') +'-id-'+id
      var tab_content = element.tab_content
      if(index <1)
      {
        strTabContent +='<div role="tabpanel" class="tab-pane active '+tab_id+'" id="'+tab_id+'">'+tab_content+'</div>'
      }
      else
      {
        strTabContent +='<div role="tabpanel" class="tab-pane '+tab_id+'" id="'+tab_id+'">'+tab_content+'</div>'
      }
       
    });
    strTabContent +=' </div>';
    //--->get tab content - end

    var strTabDiv = ''
    +'<div class="panel panel-default"  >'
      + '<div style="padding:10px;">'
        + strTabName
        + strTabContent
      + '</div>'
    + '</div>'
    //console.log(strTabDiv)
    return strTabDiv;    
}
  
np_bs_modal = function (object_data)
{
    /* 
      Will create a Bootstrap Modal

      //example panel object data
      var object_data =
      {
        ModalTitle:'ModalTitle', 
        ModalBodyContent: "this is my Modal Body Content ",
      }

    */

    //remove all old modals first
    jQuery(document).find('.modal').remove();

    var modalHTML =''+
    '<div class="modal fade np-modal" id="myModal" role="dialog">'+
      
      //--->Modal - Stat
      '<div class="modal-dialog modal-lg">'+

        '<div class="modal-content">'+
          
          //--->Modal Header - Start
          '<div class="modal-header">'+
            //Close button
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            //Title
            '<h4 class="modal-title">'+object_data.ModalTitle+'</h4>'+

          '</div>'+
          //--->Modal Header - End

          //--->Modal Body - Start
              '<div class="modal-body">'+
                ''+object_data.ModalBodyContent+''+
              '</div>'+
              //--->Modal Body - End

              //--->Modal Footer - Start
              '<div class="modal-footer">'+
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
              '</div>'+
              //--->Modal Footer - End


        '</div>'+

      '</div>'+
      //--->Modal - End
    '</div>';
    
    //add new modal to body
    jQuery('body').append(modalHTML);

    jQuery('#myModal').modal('show');
}


np_bs_panel = function (object_data)
{ 
   /* 
      Will create a Bootstrap panel screen

      //example panel object data
      var object_data =
      {
        panel_header:'header', 
        panel_content: "this is my panel 1 content",
        panel_footer: "footer",
        panel_class: "default",
         
      }
    */
    //Get object Arr
    var obj = object_data  

    var panel_class = obj.panel_class ? obj.panel_class : 'default' 

    var strDIV = ''
    strDIV += '<div class="panel panel-'+panel_class+'"  >'

            if(obj.panel_header)
            {
              strDIV +='<div class="panel-heading" >'+ obj.panel_header + '</div>'
            }

            strDIV += '<div style="padding:10px;"></div>'

            strDIV +='<div class="panel-body" >' + obj.panel_content+ '</div>'

            if(obj.panel_footer)
            {
              strDIV +='<div class="panel-footer" >'+ obj.panel_footer + '</div>'
            }
    strDIV +='</div>'

    return strDIV
}

//--->data mining functions > end





//--->np api functions > start

//--->plugins > start
var np_get_top_posts = function  ()
{   
    var np_widget_top_posts = $(document).find('.np_widget_top_posts');

    if(np_widget_top_posts.length < 1)
    {
        return false;
    }

    //--->loop through all > start
    //in case there are multiple containers
    $.each(np_widget_top_posts, function(i, v) 
    {
        var ele = $(this);

        //clear dummy data
        ele.html('loading');

        var widget_top_posts_title = ele.attr('widget_top_posts_title');
        var widget_top_posts_counter = ele.attr('widget_top_posts_counter');

        var top_posts_counter = widget_top_posts_counter ? widget_top_posts_counter : 10; 
        
        var DataString =  {token_id:np_get_id(),top_posts_counter:top_posts_counter}; 
    
        var ajax = np_ajax('GET','/api/top-posts',DataString);

        ajax.fail(function(xhr, ajaxOptions, thrownError) 
        {
          console.log(thrownError); 
          console.log(xhr);   
        })
        
        ajax.done(function(data,textStatus, jqXHR) 
        { 
            //console.log(data)
            var Status = data.status;

            if(Status == 'error')
            {
                ele.html('');
                console.log(data);
            }
            else if(Status == 'success')
            {  
                //limit the number of posts to show
                var top_posts =  data.top_posts.slice(0, top_posts_counter);
                var site_url = data.site_url;

                //--->create categories list > start
                var d = '';
                d +='<label class="widget_top_posts_title">'+widget_top_posts_title+'</label>';
                d +='<br>';
                $.each(top_posts, function(i1, v1) 
                {    
                    var post_title = v1.post_title;

                    var post_url = site_url +'/'+ v1.post_url;
                     
                 
                    d += '<a href="'+post_url+'" > '+post_title+'</a>';
                    if(v1.post_views > 0)
                    {   
                        var counter = v1.post_views > 0 ? np_format_view_count(v1.post_views,2) : v1.post_views;
                        d +='<br>';
                        d += '<span style=" padding:3px;font-size: 15px;" class="fa fa-eye" title="Total Views"> '+counter+'</span>';
                    }    
                    d +='<hr>';
                })            
                d+='';
                //--->create categories list > end

                //out put
                ele.html(d);
            }
        })
        
    })
    //--->loop through all > end 
}
 
var np_get_categories = function  ()
{   
    var np_widget_categories = $(document).find('.np_widget_categories');

    if(np_widget_categories.length < 1)
    {
        return false;
    }
 
    
    np_widget_categories.html('loading');

    var DataString =  {token_id:np_get_id()}; 
    
    var ajax = np_ajax('GET','/api/categories',DataString); 

    ajax.fail(function(xhr, ajaxOptions, thrownError) 
    {
      console.log(thrownError); 
      console.log(xhr);   
    })

    ajax.done(function(data,textStatus, jqXHR) 
    { 
        //console.log(data)
        var Status = data.status;

        if(Status == 'error')
        {
            console.log(data);
            np_widget_categories.html('');
        }
        else if(Status == 'success')
        {   
            var arr_categories = data.categories;
            var site_url = data.site_url;

            
            $.each(np_widget_categories, function(i, v) 
            {
                var ele = $(this);

                var widget_category_title = ele.attr('widget_category_title');
                var icon_class = ele.attr('icon_class');            

                //--->parse category data > start
                var cat = []    
                arr_categories.forEach(function(ele1)
                {
                    var get_cat = ele1.categories;

                    get_cat.forEach(function(ele2)
                    {
                        cat.push(ele2);
                    })
                }) 
                //--->parse category data > end 

                //group categories
                var group_cat = cat.groupBy('name'); 

                //--->create categories list > start
                var d = '';             
                d +='<label class="widget_category_title">'+widget_category_title+'</label>';
                d +='<br>';
                $.each(group_cat, function(i1, v1) 
                {    
                    var cat_url = site_url+'/category/'+v1[0].slug;
                    d += '<i class="'+icon_class+'"> ';
                        d += '<a href="'+cat_url+'" > '+i1+'</a>';
                    d +='</i>';
                    d +='<br>';
                })            
                d+='';
                //--->create categories list > end

                //out put list
                ele.html(d);
                //console.log(icon_class)
            })
        }        
    })
}
//--->plugins > end

var np_get_token = function () 
{    
    var get_token  =  cookies.Get('np_client_token') ? cookies.Get('np_client_token') : $('.np_client_token').html();
 
    if(np_size(get_token) > 0  || get_token)
    {       
        return false; 
    } 

    var DataString =  {token_id:np_get_id()}; 
 
    var ajax  = $.ajax(
    {
        type: 'GET',     
        url: '/api/token',
        cache: false,        
        data: DataString,
        dataType: "json"
    })
    
    ajax.fail(function(xhr, ajaxOptions, thrownError) 
    {
      console.log(thrownError); 
      console.log(xhr);  
    })

    ajax.done(function(data,textStatus, jqXHR) 
    { 
        var Status = data.status;

        if(Status == 'error')
        {
            console.log(data);                  
        }
        else if(Status == 'success')
        { 
            if(cookies.Enable() )
            {
                cookies.Add('np_client_token',data.token );         
            }
            else if(!c.Enable() )
            {
                var strDIV = '<div class="np_client_token" style="display:none;">'+data.token+'</div>';
                $('body').append(strDIV);
            }
        }        
    })
}

var np_ajax_comment = function  (DataString)
{   
    return np_ajax('POST','/api/comment',DataString); 
}

var np_ajax_option = function  (option_name)
{   
    var DataString = {option_name: option_name} ;
    return np_ajax('GET','/api/options',DataString);
}


 
var np_ajax = function  (CallType,CallURL,DataString)
{  
    var get_token  =  cookies.Get('np_client_token')  ? cookies.Get('np_client_token') : $('.np_client_token').html();    
    return $.ajax(
    {
        type: CallType,     
        url: CallURL,
        cache: false,
        headers: { "token_value": get_token},   
        data: DataString,
        dataType: "json"
    })
}
//--->np api functions > end

 
document.addEventListener("DOMContentLoaded", function(event) 
{
    np_include_once('/np-core/libs/awesome-functions/awesome-functions.min.js');

    if((cdn_libs).toLowerCase() =='no')
    {
        //load locally
       
        np_include_once('/np-core/libs/font-awesome/css/font-awesome.min.css');
        np_include_once('/np-core/libs/prism/prism.min.css');

        np_include_once('/np-core/libs/bootstrap/js/bootstrap.min.js');
        np_include_once('/np-core/libs/prism/prism.min.js');
    }
    else  if((cdn_libs).toLowerCase() =='yes')
    {   
        np_include_once('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
        np_include_once('https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css');

        np_include_once('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js');
        np_include_once('https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/prism.min.js');
    }

    np_get_token();     

    np_get_categories();

    np_get_top_posts();
    
});





window.addEventListener("load", function(event) 
{
    //BS tooltip
    //$(document).tooltip({ selector: "[data-toggle]" });
 
    //--->remove modal container > start   
    $(document).on('click', '.btn', function () 
    { 
    	var get_modal_container = $(this).attr('data-dismiss');
    	if(get_modal_container =='modal')
    	{
    		$(document).find('.modal').remove();
    		$(document).find('.modal-backdrop').remove();
    	}
    });  

    $(document).on('click', '.close', function () 
    { 
    	var get_modal_container = $(this).attr('data-dismiss');
    	if(get_modal_container =='modal')
    	{
    		$(document).find('.modal').remove();
    		$(document).find('.modal-backdrop').remove();
    	}
    }); 

    $(document).on('hidden.bs.modal', '.modal', function () 
    {   
		$(this).remove();
        $(document).find('.modal-backdrop').remove();
    })
    //--->remove modal container > end

    
    
    //--->search box > start

    $('.np_widget_search').on('keypress','.np_search_box', function(event) 
    { 
        var code = event.which ? event.which : event.keyCode;

        if (code == 13) 
        {
            np_clear_error();
            var ele = $(this).closest('.np_widget_search').find('.np_search_box');

            if(!ele.val())
            {
                np_show_error('please enter text', $(this));
            }
            else
            {
                var search_url = np_get_site_url()+'search/'+ele.val();
                window.location = search_url;
            }
        }
    })

    $(document).on('click', '.np_btn_search', function(event) 
    {
        event.preventDefault();

        np_clear_error();
        var ele = $(this).closest('.np_widget_search').find('.np_search_box');

        if(!ele.val())
        {
            np_show_error('please enter text', $(this));
        }
        else
        {
            var search_url = np_get_site_url()+'search/'+ele.val();
            window.location = search_url;
        }

    })
    //--->search box > end
});