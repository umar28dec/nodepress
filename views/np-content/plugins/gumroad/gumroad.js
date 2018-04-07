var gumroad_js = function()
{
    var arr1 = []

    $("a").filter(function()  
    {
        var ele = $(this);

        var href_link = ele.attr('href');

        
        if(href_link.indexOf('gum') !== -1)
        {
            arr1.push(href_link);
        } 
    })
    //console.log(arr1)

    if(arr1.length > 0)
    {
        np_include_once('https://gumroad.com/js/gumroad.js');
    }


}


$(document).ready(function()
{
    //load functions
    gumroad_js()
})


 