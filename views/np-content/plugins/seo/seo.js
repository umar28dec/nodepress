$(document).ready(function()
{
    //load functions
     SEO()
})





var SEO = function (arguments) 
{
    // will add no follow to all external links

    var DLExt = function (ExtArr)
    {
        var DLExt;
        if(!ExtArr)
        {
            DLExt = ["zip", "rar", "mp3","mp4" ,"pdf", "docx", "pptx", "xlsx", "js","css"]; 
        }   
        else if(ExtArr)
        {
            DLExt = ExtArr; 
        }
        
        return DLExt;
    }
    var IsHrefExternal = function(HrefLinkSite)
    {
        var LocSite = location.hostname;
        if(LocSite != HrefLinkSite)
        { 
            //console.log('external link');
            //External link         
            return 'yes';
        }
    }
    

    var GetFileName = function(FileURL)
    {
      var GetFileName = FileURL.substring( FileURL.lastIndexOf('/')+1 );
      var RemoveFileExt = GetFileName.split('.')[0];
      return RemoveFileExt;
    }
    
    var GetFileExt = function(FileURL)
    {
      return FileURL.split('.').pop().toLowerCase();
    }
    

    //--->Add alt tag to all the images - Start
    jQuery("img").filter(function()  
    {       
      var img = jQuery(this);
      var FileName = img.attr('src');
      var Title = img.attr('title');
      var AltTag = img.attr('alt');
      if(!AltTag)
      {
        var id = Math.random().toString(36).substr(2,4);

        var GetSiteName =  GetFileName(location.hostname);
        var IMG_GetFileName  = GetFileName (FileName);
        //Just for fun
        var GetFileExt = FileName.split('.').pop().toLowerCase();
        var AddAltText = GetSiteName + '-'+IMG_GetFileName+'-'+id;
        img.attr({alt:AddAltText})
        
      }
    });
    //--->Add alt tag to all the images - End



    //--->Add external link with no follow- Start
    var GetDLExt =  DLExt();

    jQuery("a").filter(function()  
    {
        var FollowCheck = jQuery(this).attr('follow');      
        var LocSite = location.hostname;
        var HrefLinkSite = this.hostname;
        //console.warn('warning test');
                
        //Is external link
        if( IsHrefExternal(HrefLinkSite))
        { 
          var href = jQuery(this).attr('href');

          var GetFileExt = href.split('.').pop().toLowerCase();

          //Regular external link
          if(jQuery.inArray(GetFileExt, GetDLExt) == -1) 
          { 
            var get_current_rel = jQuery(this).attr('rel');

            if(get_current_rel =='follow')
            {
              jQuery(this).attr('target', '_blank')
              return false
            }
            else
            {
              //See if it has bootstrap button class
              var BtnClass = jQuery(this).hasClass('btn');

              //Awesome Font Class
              var FaClass = jQuery(this).hasClass('fa');

              if(BtnClass || FaClass)
              {
                jQuery(this).attr(
                {
                  target: '_blank',
                  rel: 'nofollow noopener'
                });
              }
              else
              {
                var is_nav = jQuery(this).closest('ul').hasClass('nav');
                if(!is_nav)
                {
                  jQuery(this).after(' <i class="fa fa-external-link" style="font-size:10px; Position:relative; top: -5px;"></i> ')                  
                  .attr(
                  {
                    target: '_blank',
                    rel: 'nofollow noopener'
                  });
                }
                else
                {
                  jQuery(this).attr(
                  {
                    target: '_blank',
                    rel: 'nofollow noopener'
                  });
                }
              } 
               
            }
          }
        }
    });
    //--->Add external link with no follow - End
}