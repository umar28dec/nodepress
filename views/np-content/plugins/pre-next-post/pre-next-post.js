//$(document).ready(function($)
document.addEventListener("DOMContentLoaded", function(event) 
{
    //var url = np_parse_url().path;

    var url  = window.location.pathname.substring(1)

    //--->pre/next post > start    
    if($(document).find('.post_pre').length > 0)
    {
        np_sm_ajax({url:'/api/post/pre-next',type:'get',data:{url:url}},function(data)
        {
            //console.log(data)
            if(data.status == 'success')
            {
                var post_next = data.post_next;
                var post_pre  = data.post_pre;

                if(np_size(post_pre) > 0 )
                {
                    var btn = ''
                    + '<a class="text-capitalize" href="'+post_pre.post_url+'">'
                        +'<img src="'+post_pre.post_feature_img+'" class="img-rounded"  width="304" height="236">'
                        + '<br><br>'
                        +'<span   >  <p class="small"> <i class="fa fa-arrow-left "  > </i> Previous Post </p>     ('+post_pre.post_title +')</span>'                        
                    + '  </a>'
                    + '<br><br>'
                     
                    $(document).find('.post_pre').html(btn);                     
                }

                if(np_size(post_next) > 0 )
                {                        
                    var btn = ''                     
                    + '<a class="text-capitalize" href="'+post_next.post_url+'">'
                        +'<img src="'+post_next.post_feature_img+'" class="img-rounded"  width="304" height="236">'
                        + '<br><br>'
                        +'<span   > <p class="small"> Next Post <i class="fa fa-arrow-right"  > </i>  </p> ( '+post_next.post_title +' )  </span>'                         
                    + '  </a>'
                    + '<br><br>'                 
                    
                    $(document).find('.post_next').html(btn);
                }
            }
        })
    }
    //--->pre/next post > end
 
})