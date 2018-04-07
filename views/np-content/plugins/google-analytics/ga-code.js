var update_ga_link  = function (ga_code) 
{
    var d = document, s = d.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id='+ga_code;
    s.setAttribute('async','true');
    (d.head || d.body).appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments)};
    gtag('js', new Date());

    gtag('config', ga_code);     
}

$(document).ready(function()
{
    
  
    var get_ga_link = JSON.parse( np_ls_get('ls_site_ga_code') );

    if(np_size(get_ga_link) > 0   )
    { 
        update_ga_link(get_ga_link.ga_code);         
        return false;
    } 


 

    np_sm_ajax({url:'/api/options',type:'get',data:{option_name:'ga_code'}},function(data)
    {
        //console.log(data);

        if(data.status == 'success')
        {
            var option_value = data.option_value; 
            //add 5 minutes to expire timestamp
            var date_expire = np_get_expire_timer({min:5});

            //add to localstorage
            var obj = 
            {
                ga_code:data.option_value,
                code_expire_sec:date_expire.unix,
                code_expire_iso: date_expire.iso,
            }
            np_ls_add('ls_site_ga_code', JSON.stringify(obj) );

            update_ga_link(data.option_value);
              
        }
    })

 
 })