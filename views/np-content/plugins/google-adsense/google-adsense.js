var update_google_adsense  = function (google_adsense_code) 
{
    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    if( $(document).find('.google_adsense_container').length > 0)
    {
        $(document).find('.google_adsense_container').html(google_adsense_code+'<br>')     
    }

    var total_paragraphs = $(document).find('.np_post_content').find('p').length

    //will show ad after paragraph number
    var show_ad_in_p = randomIntFromInterval(3,total_paragraphs -1 )
    
    var show_ad_in_p1 = randomIntFromInterval(3,total_paragraphs - 1)
    var show_ad_in_p2 = randomIntFromInterval(3,total_paragraphs - 1)


    $(document).find('.np_post_content').find('p').eq(show_ad_in_p1).after(google_adsense_code+'<br>') 
    $(document).find('.np_post_content').find('p').eq(show_ad_in_p2).after(google_adsense_code+'<br>') 
}

$(document).ready(function()
{   

    if( $(document).find('.google_adsense_container').length > 0)
    { 
        var get_google_adsense_link = JSON.parse( np_ls_get('ls_google_adsense') );

        if(np_size(get_google_adsense_link) > 0   )
        { 
            update_google_adsense(get_google_adsense_link.google_adsense);         
            return false;
        } 
     

        np_sm_ajax({url:'/api/options',type:'get',data:{option_name:'google_adsense'}},function(data)
        {
            //console.log(data);

            if(data.status == 'success')
            {
                // preserve newlines, etc - use valid JSON
                var option_value = data.option_value.replace(/\\n/g, "\\n")  
                .replace(/\\'/g, "\\'")
                .replace(/\\"/g, '\\"')
                .replace(/\\&/g, "\\&")
                .replace(/\\r/g, "\\r")
                .replace(/\\t/g, "\\t")
                .replace(/\\b/g, "\\b")
                .replace(/\\f/g, "\\f"); 

                //add 5 minutes to expire timestamp
                var date_expire = np_get_expire_timer({hr:5});

                //add to localstorage
                var obj = 
                {
                    google_adsense:data.option_value,
                    code_expire_sec:date_expire.unix,
                    code_expire_iso: date_expire.iso,
                }
                
                np_ls_add('ls_google_adsense', JSON.stringify(obj) );

                update_google_adsense(data.option_value);
            }
        })
    }
 })