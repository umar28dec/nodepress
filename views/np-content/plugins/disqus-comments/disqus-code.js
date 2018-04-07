var update_disqus_link  = function (comment_code) 
{
    var get_comment_container = $('.comment_container') ;
 
    if(get_comment_container.html().length> 0)
    {
        //get_comment_container.remove();
        //cretae_disqus_comment_container
        get_comment_container.html('<div id="disqus_thread" style="padding:10px;"></div>'); 
        
        var d = document, s = d.createElement('script');
        s.src = 'https://'+comment_code+'.disqus.com/embed.js';
        s.setAttribute('async','true');
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        
    }
     
}

$(document).ready(function()
{
    
    var get_comment_container = $('.comment_container')
    if(get_comment_container.length > 0)
    {
        var get_disqus_link = JSON.parse( np_ls_get('ls_site_disqus_code') );

        if(np_size(get_disqus_link) > 0   )
        { 
            update_disqus_link(get_disqus_link.disqus_code);         
            return false;
        }

        np_sm_ajax({url:'/api/options',type:'get',data:{option_name:'disqus_code'}},function(data)
        {
           

            if(data.status == 'success')
            {
                var option_value = data.option_value; 
                //add 5 minutes to expire timestamp
                var date_expire = np_get_expire_timer({min:5});

                //add to localstorage
                var obj = 
                {
                    disqus_code:data.option_value,
                    code_expire_sec:date_expire.unix,
                    code_expire_iso: date_expire.iso,
                }
                np_ls_add('ls_site_disqus_code', JSON.stringify(obj) );

                update_disqus_link(data.option_value);
                  
            }
        })
    }
 
 })