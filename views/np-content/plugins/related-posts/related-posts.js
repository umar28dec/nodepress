$(document).ready(function($)
{
    //var url = np_parse_url().path;
    var url  = window.location.pathname.substring(1)

    //--->related posts > start     
    if($(document).find('.related_posts').length > 0)
    {
        function shuffle_array(arra1) 
        {
            var ctr = arra1.length, temp, index;

            // While there are elements in the array
            while (ctr > 0) 
            {
                // Pick a random index
                    index = Math.floor(Math.random() * ctr);
                // Decrease ctr by 1
                    ctr--;
                // And swap the last element with it
                temp = arra1[ctr];
                arra1[ctr] = arra1[index];
                arra1[index] = temp;
            }
            return arra1;
        }
        np_sm_ajax({url:'api/related/post',type:'get',data:{url:url}},function(data)
        {
            //console.log(data);
            if(data.status == 'success')
            {
                

                var related_posts  =  data.related_posts;
 
                if(np_size(related_posts) > 0 )
                {
                    var r = np_random_pick(related_posts);
                    
                    var top_5_relate_post = shuffle_array(related_posts).slice(0,5);
                    
                    var strDIV = ''
                    strDIV +='<div class="container-fluid"> '
                        strDIV += '<div class="panel panel-default">'
                            strDIV +='<div class="panel-heading"><strong>You Might Also Like: </strong></div>'
                            strDIV +='<div class="panel-body">'
                                $.each(top_5_relate_post, function(index, val) 
                                {  
                                    strDIV += '<a class="text-capitalize " href="'+val.post_url+'">'

                                        strDIV += '<div class="col-sm-4 text-left1 "  style="padding:5px;">'
                                            strDIV +='<img src="'+val.post_feature_img+'" class="img-rounded  "  width="150" height="150">' 
                                            strDIV += '<br><br>'
                                            strDIV +=' <span class="fa fa-arrow-right" > '+val.post_title +' </span>'
                                            strDIV += '<br><br>'
                                        strDIV += ' </div>'

                                    strDIV += '  </a>'

                                }); 
                                strDIV +='<br>'
                            strDIV += ' </div>'
                        strDIV += ' </div>' 
                    strDIV +='</div>';
                    $(document).find('.related_posts').html(strDIV) ;
                    
                }
            }
        })
    }
    //--->related posts > end
}) 